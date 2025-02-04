import { Construction } from "Construction";
import { EnergyMining } from "EnergyMining";
import { RoomRoutine } from "RoomProgram";
import { Bootstrap } from "bootstrap";
import { forEach, sortBy } from "lodash";
import { ErrorMapper } from "utils/ErrorMapper";
import { RoomMap } from "RoomMap";

declare global {
  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  forEach(Game.rooms, (room) => {
    let routines = getRoomRoutines(room);

    room.memory.routines = {};

    _.keys(routines).forEach((routineType) => {
      _.forEach(routines[routineType], (routine) => {
        console.log(`running routine ${routineType} in room ${room.name} ${JSON.stringify(routine)}`);
        routine.runRoutine(room);
      });
    });

    _.keys(routines).forEach((routineType) => {
      room.memory.routines[routineType] = _.map(routines[routineType], (routine) => routine.serialize())
    });

    new RoomMap(room);
  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

});


function getRoomRoutines(room: Room): { [routineType: string]: RoomRoutine[] } {
  if (!room.controller) { return {}; }

  if (room.memory?.routines?.bootstrap == null || room.memory?.routines?.bootstrap.length == 0) {
    room.memory.routines = {
      bootstrap: [new Bootstrap(room.controller?.pos).serialize()]
    };
  }

  if (room.memory?.routines?.energyMines == null || room.memory?.routines?.energyMines.length == 0) {
    let energySources = room.find(FIND_SOURCES);
    let mines = _.map(energySources, (source) => initEnergyMiningFromSource(source));

    room.memory.routines.energyMines = _.map(mines, (m) => m.serialize());
  };

  if (room.memory?.routines?.construction == null || room.memory?.routines?.construction.length == 0) {
    console.log(`room.memory.routines.construction is empty adding c`);
    room.memory.routines.construction = [];
    let s = room.find(FIND_MY_CONSTRUCTION_SITES);
    _.forEach(s.slice(0, 1), (site) => {
      room.memory.routines.construction.push(new Construction(site.id).serialize());
    });
  };

  console.log(`construction rs: ${JSON.stringify(room.memory.routines.construction)}`);
  room.memory.routines.construction = _.filter(room.memory.routines.construction, (memRoutine) => {
    return Game.getObjectById(memRoutine.constructionSiteId) != null;
  });

  console.log(`construction rs: ${JSON.stringify(room.memory.routines.construction)}`);

  let routines = {
    bootstrap: _.map(room.memory.routines.bootstrap, (memRoutine) => {
      let b = new Bootstrap(room.controller!.pos);
      b.deserialize(memRoutine);
      return b;
    }),
    energyMines: _.map(room.memory.routines.energyMines, (memRoutine) => {
      let m = new EnergyMining(room.controller!.pos);
      m.deserialize(memRoutine);
      return m;
    }),
    construction: _.map(room.memory.routines.construction, (memRoutine) => {

      let c = new Construction(memRoutine.constructionSiteId)
      c.deserialize(memRoutine);
      return c;
    })
  };

  console.log(`routines2: ${JSON.stringify(routines)}`);
  return routines;
}

function initEnergyMiningFromSource(source: Source): EnergyMining {
  let adjacentPositions = source.room.lookForAtArea(
    LOOK_TERRAIN,
    source.pos.y - 1,
    source.pos.x - 1,
    source.pos.y + 1,
    source.pos.x + 1, true);

  let harvestPositions: RoomPosition[] = [];

  forEach(adjacentPositions, (pos) => {
    if (pos.terrain == "plain" || pos.terrain == "swamp") {
      harvestPositions.push(new RoomPosition(pos.x, pos.y, source.room.name))
    }
  });

  let spawns = source.room.find(FIND_MY_SPAWNS);
  spawns = _.sortBy(spawns, s => s.pos.findPathTo(source.pos).length);

  let m = new EnergyMining(source.pos);
  m.setSourceMine({
    sourceId: source.id,
    HarvestPositions: sortBy(harvestPositions, (h) => {
      return h.getRangeTo(spawns[0]);
    }),
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

