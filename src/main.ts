import { Construction } from "./Construction"
import { EnergyMining } from "./EnergyMining";
import { RoomRoutine } from "./RoomProgram";
import { Bootstrap } from "./bootstrap";
import { forEach, sortBy } from "lodash";
import { ErrorMapper } from "./ErrorMapper";
import { RoomMap } from "./RoomMap";

declare global {
  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is blue forty two ${Game.time}`);

  _.forEach(Game.rooms, (room) => {
    // Ensure room.memory.routines is initialized
    if (!room.memory.routines) {
      room.memory.routines = {};
    }

    const routines = getRoomRoutines(room);

    _.forEach(routines, (routineList, routineType) => {
      _.forEach(routineList, (routine) => routine.runRoutine(room));
      if (routineType) {
        room.memory.routines[routineType] = _.map(routineList, (routine) => routine.serialize());
      }
    });

    new RoomMap(room);
  });

  // Clean up memory
  _.forIn(Memory.creeps, (_, name) => {
    if (name) {
      if (!Game.creeps[name]) delete Memory.creeps[name];
    }
  });
});


function getRoomRoutines(room: Room): { [routineType: string]: RoomRoutine[] } {
  if (!room.controller) return {};

  // Initialize room.memory.routines if not present
  if (!room.memory.routines) {
    room.memory.routines = {};
  }

  // Sync routines with the current state of the room
  if (!room.memory.routines.bootstrap) {
    room.memory.routines.bootstrap = [new Bootstrap(room.controller.pos).serialize()];
  }

  // Sync energy mines with current sources
  const currentSources = room.find(FIND_SOURCES);
  const existingSourceIds = _.map(room.memory.routines.energyMines || [], (m) => m.sourceId);
  const newSources = _.filter(currentSources, (source) => !existingSourceIds.includes(source.id));

  if (newSources.length > 0 || !room.memory.routines.energyMines) {
    room.memory.routines.energyMines = _.map(currentSources, (source) => initEnergyMiningFromSource(source).serialize());
  }

  // Sync construction sites
  const currentSites = room.find(FIND_MY_CONSTRUCTION_SITES);
  const existingSiteIds = _.map(room.memory.routines.construction || [], (c) => c.constructionSiteId);
  const newSites = _.filter(currentSites, (site) => !existingSiteIds.includes(site.id));

  if (newSites.length > 0 || !room.memory.routines.construction) {
    room.memory.routines.construction = _.map(currentSites, (site) => new Construction(site.id).serialize());
  }

  // Deserialize routines
  return {
    bootstrap: _.map(room.memory.routines.bootstrap, (memRoutine) => {
      const b = new Bootstrap(room.controller!.pos);
      b.deserialize(memRoutine);
      return b;
    }),
    energyMines: _.map(room.memory.routines.energyMines, (memRoutine) => {
      const m = new EnergyMining(room.controller!.pos);
      m.deserialize(memRoutine);
      return m;
    }),
    construction: _.map(room.memory.routines.construction, (memRoutine) => {
      const c = new Construction(memRoutine.constructionSiteId);
      c.deserialize(memRoutine);
      return c;
    })
  };
}

function initEnergyMiningFromSource(source: Source): EnergyMining {
  const harvestPositions = _.filter(
    source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true),
    (pos) => pos.terrain === "plain" || pos.terrain === "swamp"
  ).map((pos) => new RoomPosition(pos.x, pos.y, source.room.name));

  const spawns = _.sortBy(source.room.find(FIND_MY_SPAWNS), (s) => s.pos.findPathTo(source.pos).length);

  const m = new EnergyMining(source.pos);
  m.setSourceMine({
    sourceId: source.id,
    HarvestPositions: _.sortBy(harvestPositions, (h) => h.getRangeTo(spawns[0])),
    distanceToSpawn: spawns[0].pos.findPathTo(source.pos).length,
    flow: 10
  });

  return m;
}


//////
/*
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



  ////

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

*/

