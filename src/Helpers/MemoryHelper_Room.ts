import { spawn } from "child_process";

/**
 * Contains all functions for initializing and updating room memory
 */
export class MemoryHelper_Room {

    /**
     * get all hostiles creeps in the room
     * @param room the room we are checking in
     */
    public static updateHostileCreeps(room: Room): void {

        // find hostile creeps in the room and save them to the rooms memory
        Memory.rooms[room.name].hostiles = room.find(FIND_HOSTILE_CREEPS);
    }

    /**
     * get all friendly creeps in the room
     * @param room the room we are checking in
     */
    public static updateMyCreeps(room: Room): void {

        // find friendly creeps in the room and save them to the rooms memory
        Memory.rooms[room.name].creeps = room.find(FIND_MY_CREEPS);
    }

    /**
     * get all my structures in the room
     * @param room the room we are checking in
     */
    public static updateMyStructures(room: Room): void {

        const allStructures: StringMap = room.find(FIND_MY_STRUCTURES);

        // save each one of these into their spot in the memory
        let structureMemory: StringMap = Memory.rooms[room.name].structures;

        // get a string map of the id's of each structure
        const extensions: StringMap = _.map(allStructures[STRUCTURE_EXTENSION], (extension: StructureExtension) => extension.id);
        const extractors: StringMap = _.map(allStructures[STRUCTURE_EXTRACTOR], (extractor: StructureExtractor) => extractor.id);
        const labs: StringMap = _.map(allStructures[STRUCTURE_LAB], (lab: StructureLab) => lab.id);
        const links: StringMap = _.map(allStructures[STRUCTURE_LINK], (link: StructureLab) => link.id);
        const nukers: StringMap = _.map(allStructures[STRUCTURE_NUKER], (nuker: StructureLab) => nuker.id);
        const observers: StringMap = _.map(allStructures[STRUCTURE_OBSERVER], (observer: StructureLab) => observer.id);
        const ramparts: StringMap = _.map(allStructures[STRUCTURE_RAMPART], (rampart: StructureLab) => rampart.id);
        const spawns: StringMap = _.map(allStructures[STRUCTURE_SPAWN], (spawn: StructureLab) => spawn.id);
        const towers: StringMap = _.map(allStructures[STRUCTURE_TOWER], (tower: StructureLab) => tower.id);

        // save the string map of id's into the room's memory
        structureMemory[STRUCTURE_EXTENSION] = extensions;
        structureMemory[STRUCTURE_EXTRACTOR] = extractors;
        structureMemory[STRUCTURE_LAB] = labs;
        structureMemory[STRUCTURE_LINK] = links;
        structureMemory[STRUCTURE_NUKER] = nukers;
        structureMemory[STRUCTURE_OBSERVER] = observers;
        structureMemory[STRUCTURE_RAMPART] = ramparts;
        structureMemory[STRUCTURE_SPAWN] = spawns;
        structureMemory[STRUCTURE_TOWER] = towers;
    }


    /**
     * get all neutral structures in the room
     * @param room the room we are checking in
     */
    public static updateNeutralStructures(room: Room): void {

        const allStructures: StringMap = room.find(FIND_STRUCTURES);

        // save each one of these into their spot in the memory
        let structureMemory: StringMap = Memory.rooms[room.name].structures;

        // get a string map of the id's of each structure
        const roads: StringMap = _.map(allStructures[STRUCTURE_ROAD], (road: StructureRoad) => road.id);
        const containers: StringMap = _.map(allStructures[STRUCTURE_CONTAINER], (container: StructureContainer) => container.id);
        const walls: StringMap = _.map(allStructures[STRUCTURE_WALL], (wall: StructureWall) => wall.id);

        // save the string map of id's into the room's memory
        structureMemory[STRUCTURE_ROAD] = roads;
        structureMemory[STRUCTURE_CONTAINER] = containers;
        structureMemory[STRUCTURE_WALL] = walls;
    }

    /**
     * get all construction sites in the room
     * @param room the room we are checking in
     */
    public static updateConstructionSites(room: Room): void {

        // find construction sites and save into the memory
        const constructionSites: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES);

        // get a string map of the construction sites
        const sites = _.map(constructionSites, (c: ConstructionSite) => c.id);

        // save the map into the room's memory
        Memory.rooms[room.name].constructionSites = sites;
    }
}
