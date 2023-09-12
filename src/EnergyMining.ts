import { RoomRoutine } from "RoomProgram";
import { HarvestPosition, SourceMine } from "SourceMine";
import { forEach, some, sortBy } from "lodash";

export class EnergyMining { //extends RoomRoutine {
    name = 'energy mining';

    //constructor() { super(); }

    routine(room: Room): void {
        console.log('energy mining');

        if (!room.memory.sourceMines) { findMines(room); }

        let mines = room.memory.sourceMines as SourceMine[];
        forEach(mines, (mine) => {
            let m = mine as SourceMine;
            let source = Game.getObjectById(m.sourceId);
            if (source == null) { return; }
            HarvestAssignedEnergySource(m);
        });

        room.memory.sourceMines = mines;
    }
}

function HarvestAssignedEnergySource(mine: SourceMine) {
    let source = Game.getObjectById(mine.sourceId);
    if (source == null) { return; }

    for (let p = 0; p < mine.HarvestPositions.length; p++) {
        let pos = mine.HarvestPositions[p];
        forEach(pos.Harvesters, (creepId) => {
            HarvestPosAssignedEnergySource(Game.getObjectById(pos.Harvesters[p]), source, pos.pos);
        });
    };
}

function HarvestPosAssignedEnergySource(creep: Creep | null, source: Source | null, destination: RoomPosition | null) {
    if (creep == null) { return; }
    if (source == null) { return; }
    if (destination == null) { return; }

    creep.say('harvest op');

    new RoomVisual(creep.room.name).line(creep.pos, destination);
    creep.moveTo(new RoomPosition(destination.x, destination.y, destination.roomName), { maxOps: 50 });

    creep.harvest(source);
}

function findMines(room: Room) {
    let energySources = room.find(FIND_SOURCES);
    let mines: SourceMine[] = [];

    forEach(energySources, (source) => {
        let s = initFromSource(source);
        mines.push(s);
    });

    room.memory.sourceMines = mines;
}

function initFromSource(source: Source): SourceMine {
    let adjacentPositions = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1, true);

    let harvestPositions: HarvestPosition[] = [];

    forEach(adjacentPositions, (pos) => {
        if (pos.terrain == "plain" || pos.terrain == "swamp") {
            harvestPositions.push({
                pos: new RoomPosition(pos.x, pos.y, source.room.name),
                Harvesters: []
            } as HarvestPosition);
        }
    });

    let spawns = source.room.find(FIND_MY_SPAWNS);
    spawns = _.sortBy(spawns, s => s.pos.findPathTo(source.pos).length);

    return {
        sourceId: source.id,
        HarvestPositions: sortBy(harvestPositions, (h) => {
            return h.pos.getRangeTo(spawns[0]);
        }),
        distanceToSpawn: spawns[0].pos.findPathTo(source.pos).length,
        flow: 10
    }
}
