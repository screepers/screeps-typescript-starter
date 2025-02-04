import { RoomRoutine } from "RoomProgram";
import { forEach } from "lodash";

export class Bootstrap extends RoomRoutine {
    name = "bootstrap";
    //constructionSite!: ConstructionSiteStruct;

    constructor(pos: RoomPosition) {
        super(pos, { jack: [] });
    }

    routine(room: Room) {
        let spawns = room.find(FIND_MY_SPAWNS);
        let spawn = spawns[0];
        if (spawn == undefined) return;

        let jacks = _.map(this.creepIds.jack, (id) => Game.getObjectById(id)!);

        forEach(jacks, (jack) => {
            if (jack.store.energy == jack.store.getCapacity() && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                this.DeliverEnergyToSpawn(jack, spawn);
            } else if (jack.store.energy > 0 && spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 150 && room?.controller?.level && room.controller.level < 2) {
                this.upgradeController(jack);
            } else {
                if (!this.pickupEnergyPile(jack)) {
                    this.HarvestNearestEnergySource(jack);
                }
            }
        });
    }

    calcSpawnQueue(room: Room): void {
        const spawns = room.find(FIND_MY_SPAWNS);
        const spawn = spawns[0];
        if (!spawn) return;

        this.spawnQueue = [];

        if (this.creepIds.jack.length < 2) {
            this.spawnQueue.push({
                body: [WORK, CARRY, MOVE],
                pos: spawn.pos,
                role: "jack"
            });
        }
    }

    HarvestNearestEnergySource(creep: Creep): boolean {
        let energySources = creep.room.find(FIND_SOURCES);
        energySources = _.sortBy(energySources, s => s.pos.findPathTo(creep.pos).length);

        let e = energySources.find(e => {
            let adjacentSpaces = creep.room.lookForAtArea(LOOK_TERRAIN, e.pos.y - 1, e.pos.x - 1, e.pos.y + 1, e.pos.x + 1, true);

            let openSpaces = 0;
            forEach(adjacentSpaces, (space) => {
                if (space.terrain == "plain" || space.terrain == "swamp") {
                    let pos = new RoomPosition(space.x, space.y, creep.room.name);
                    pos.lookFor(LOOK_CREEPS);
                    if (pos.lookFor(LOOK_CREEPS).length == 0) {
                        openSpaces++;
                    } else if (pos.lookFor(LOOK_CREEPS)[0].id == creep.id) {
                        openSpaces++;
                    }
                }
            });

            return (openSpaces > 0);
        });

        if (e == undefined) return false;

        creep.say('harvest');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, e.pos.x, e.pos.y);

        creep.moveTo(e, { maxOps: 50, range: 1 });
        creep.harvest(e);

        return true;
    }

    BuildMinerContainer(creep: Creep) {
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length == 0) return;
        let site = constructionSites[0];

        creep.say('build');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, site.pos.x, site.pos.y);

        creep.moveTo(site, { maxOps: 50, range: 2 });
        creep.build(site);
    }

    pickupEnergyPile(creep: Creep): boolean {
        let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES, { filter: (resource) => resource.resourceType == RESOURCE_ENERGY && resource.amount > 50 });

        if (droppedEnergies.length == 0) return false;

        let e = _.min(droppedEnergies, e => e.pos.findPathTo(creep.pos).length);

        creep.say('pickup energy');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, e.pos.x, e.pos.y);

        creep.moveTo(e, { maxOps: 50, range: 1 });
        creep.pickup(e);

        return true;
    }

    DeliverEnergyToSpawn(creep: Creep, spawn: StructureSpawn): number {
        creep.say('deliver');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, spawn.pos.x, spawn.pos.y);

        creep.moveTo(spawn, { maxOps: 50, range: 1 });
        return creep.transfer(spawn, RESOURCE_ENERGY);
    }

    upgradeController(creep: Creep): void {
        let c = creep.room.controller;
        if (c == undefined) return;

        creep.say('upgrade');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, c.pos.x, c.pos.y);

        creep.moveTo(c, { maxOps: 50, range: 1 });
        creep.upgradeController(c);
    }

    dismantleWalls(creep: Creep): void {
        let walls = creep.room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_WALL });

        if (walls.length == 0) return;

        let wall = _.min(walls, w => w.pos.findClosestByPath(FIND_MY_SPAWNS));

        creep.say('dismantle');
        new RoomVisual(creep.room.name).line(creep.pos.x, creep.pos.y, wall.pos.x, wall.pos.y);

        creep.moveTo(wall, { maxOps: 50, range: 1 });
        creep.dismantle(wall);
    }

    getScaledBody(body: BodyPartConstant[], scale: number): BodyPartConstant[] {
        let newBody: BodyPartConstant[] = [];

        forEach(body, (part) => {
            for (let i = 0; i < scale; i++) {
                newBody.push(part);
            }
        });

        return newBody;
    }
}
