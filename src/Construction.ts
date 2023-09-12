import { ConstructionSiteStruct } from "ConstructionSite";
import { RoomRoutine } from "RoomProgram";
import { any, forEach } from "lodash";

export class Construction extends RoomRoutine {
    name = "construction";
    constructionSite!: ConstructionSiteStruct;

    constructor() {
        super();
    }

    routine(room: Room): void {
        console.log('construction');

        //calculateConstructionSites(room);

        if (!room.memory.constructionSites) { room.memory.constructionSites = [] as ConstructionSiteStruct[]; }

        let sites = room.memory.constructionSites as ConstructionSiteStruct[];
        sites = _.filter(sites, (site) => {
            return Game.getObjectById(site.id) != null;
        });

        if (sites.length == 0) {
            let s = room.find(FIND_MY_CONSTRUCTION_SITES);
            if (s.length == 0) { return; }

            room.memory.constructionSites.push({ id: s[0].id, Builders: [] as Id<Creep>[] });
        }

        if (sites.length == 0) { return; }

        forEach(sites, (s) => {
            this.BuildConstructionSite(s);
        });

        room.memory.constructionSites = sites;
    }

    calcSpawnQueue(room: Room): void {
        let sites = room.memory.constructionSites as ConstructionSiteStruct[];
        if (sites.length == 0) { return; }

        if (this.creepIds['builder'].length == 0) {
            this.spawnQueue.push({
                body: [WORK, CARRY, MOVE],
                pos: Game.getObjectById(sites[0].id)!.pos,
                role: "builder"
            });
        }
    }

    BuildConstructionSite(site: ConstructionSiteStruct) {
        let ConstructionSite = Game.getObjectById(site.id)!;
        let builders = site.Builders.map((builder) => {
            return Game.getObjectById(builder)!;
        });

        if (builders.length == 0) { return; }
        let builder = builders[0];

        if (builder.pos.getRangeTo(ConstructionSite.pos) > 3) {
            builder.moveTo(ConstructionSite.pos);
        } else {
            builder.build(ConstructionSite);
        }
    }

    calculateConstructionSites(room: Room) {
        let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        forEach(constructionSites, (site) => {
            if (!any(room.memory.constructionSites, (s) => { return s.id == site.id })) {
                let newSite = {
                    id: site.id,
                    Builders: [] as Id<Creep>[]
                } as ConstructionSiteStruct;
                room.memory.constructionSites.push(newSite);
            }
        });
    }
}
