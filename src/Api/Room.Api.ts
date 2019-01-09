import { MemoryApi } from "./Memory.Api";
import { RoomHelper } from "Helpers/RoomHelper";
import { ROOM_STATE_INTRO } from "utils/constants";
import { MemoryHelper_Room } from "Helpers/MemoryHelper_Room";
import { MemoryHelper } from "Helpers/MemoryHelper";

// an api used for functions related to the room
export class RoomApi {

    /**
     * check if there are hostile creeps in the room
     * @param room the room we are checking
     */
    public static isHostilesInRoom(room: Room): boolean {

        const hostilesInRoom = MemoryApi.getHostileCreeps(room);
        return (hostilesInRoom.length > 0);
    }


    /**
     * set the room's state
     * Essentially backbone of the room, decides what flow
     * of action will be taken at the beginning of each tick
     * (note: assumes defcon already being found for simplicity sake)
     *
     * @param room the room we are setting state for
     */
    public static setRoomState(room: Room): void {

        // get the structures and creeps we need from memory
        const containers: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (s) => s.structureType === STRUCTURE_CONTAINER);
        const links: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (s) => s.structureType === STRUCTURE_LINK);
        const terminal: StructureTerminal | undefined = room.terminal;
        const storage: StructureStorage | undefined = room.storage;
        const incomingNukes: Nuke[] = room.find(FIND_NUKES);
        const defconLevel: number = Memory.rooms[room.name].defcon;
        const sources: Array<Source | null> = MemoryApi.getSources(room);
        const creeps: Array<Creep | null> = MemoryApi.getMyCreeps(room);
        // ---------


        // check if we are in nuke inbound room state
        // nuke is coming in and we need to gtfo
        if (incomingNukes.length > 0) {
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_NUKE_INBOUND);
            return;
        }

        // check if we are siege room state
        // defcon is level 3+ and hostiles activity in the room is high
        if (defconLevel >= 3) {
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_SEIGE);
            return;
        }

        // check if we are in upgrader room state
        // container mining and storage set up, and we got links online
        if (RoomHelper.isContainerMining(room, sources, containers) && RoomHelper.isUpgraderLink(room, links) && storage !== undefined) {

            // if(stimulate flag is up)
            // MemoryApi.updateRoomState(room, ROOM_STATE_STIMULATE);
            // return;

            // otherwise, just upgrader room state
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_UPGRADER);
            return;
        }

        // check if we are in advanced room state
        // container mining and storage set up
        // then check if we are flagged for sitmulate state
        if (RoomHelper.isContainerMining(room, sources, containers) && storage !== undefined) {

            // if(stimulate flag is up)
            // MemoryApi.updateRoomState(room, ROOM_STATE_STIMULATE);
            // return;

            // otherwise, just advanced room state
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_ADVANCED);
            return;
        }

        // check if we are in intermediate room state
        // container mining set up, but no storage
        if (RoomHelper.isContainerMining(room, sources, containers) && storage === undefined) {
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_INTER);
            return;
        }

        // check if we are in beginner room state
        // no containers set up at sources so we are just running a bare knuckle room
        if (creeps.length > 3) {
            MemoryHelper_Room.updateRoomState(room, ROOM_STATE_BEGINNER);
            return;
        }

        // check if we are in intro room state
        // 3 or less creeps so we need to (re)start the room
        MemoryHelper_Room.updateRoomState(room, ROOM_STATE_INTRO);
        return;
    }

    /**
     * run the towers in the room
     * @param room the room we are defending
     */
    public static runTowers(room: Room): void {

        const towers = MemoryApi.getStructures(room,
            (t: Structure<StructureConstant>) => {
                return t.structureType === STRUCTURE_TOWER;
            });
        // --------

        // choose the most ideal target and have every tower attack it
        const idealTarget = RoomHelper.chooseTowerTarget(room);

        // have each tower attack this target
        towers.forEach((t: any) => t.attack(idealTarget));
    }

    /**
     * set the rooms defcon level
     * @param room the room we are setting defcon for
     */
    public static setDefconLevel(room: Room): void {

        const hostileCreeps: Array<Creep | null> = MemoryApi.getHostileCreeps(room);

        // check level 0 first to reduce cpu drain as it will be the most common scenario
        // level 0 -- no danger
        if (hostileCreeps.length === 0) {
            MemoryHelper_Room.updateDefcon(room, 0);
            return;
        }

        // now define the variables we will need to check the other cases in the event
        // we are not dealing with a level 0 defcon scenario
        const hostileBodyParts: number = _.sum(hostileCreeps,
            (c: any) => c.body.length);
        const boostedHostileBodyParts: number = _.filter(_.flatten(_.map(hostileCreeps, 'body')),
            (p: any) => !!p.boost).length;

        // level 5 -- nuke inbound
        if (room.find(FIND_NUKES) !== undefined) {
            MemoryHelper_Room.updateDefcon(room, 5);
            return;
        }

        // level 4 full seige, 50+ boosted parts
        if (boostedHostileBodyParts >= 50) {
            MemoryHelper_Room.updateDefcon(room, 4);
            return;
        }

        // level 3 -- 150+ body parts OR any boosted body parts
        if (boostedHostileBodyParts > 0 || hostileBodyParts >= 150) {
            MemoryHelper_Room.updateDefcon(room, 3);
            return;
        }

        // level 2 -- 50 - 150 body parts
        if (hostileBodyParts < 150 && hostileBodyParts >= 50) {
            MemoryHelper_Room.updateDefcon(room, 2);
            return;
        }

        // level 1 -- less than 50 body parts
        if (hostileBodyParts > 0) {
            MemoryHelper_Room.updateDefcon(room, 1);
            return;
        }

    }

    /**
     * get repair targets for the room (any structure under 75% hp)
     * TODO order by priority (fresh ramparts, towers, containers, roads, etc)
     * @param room the room we are checking for repair targets
     */
    public static getRepairTargets(room: Room): Array<Structure<StructureConstant> | null> {

        const REPAIR_THRESHOLD: number = .75;
        return MemoryApi.getStructures(room, (s: Structure<StructureConstant>) => {
            return s.hits < (s.hitsMax * REPAIR_THRESHOLD);
        });
    }

    /**
     * get spawn/extensions that need to be filled for the room
     * @param room the room we are getting spawns/extensions to be filled from
     */
    public static getExtensionsNeedFilled(room: Room): Array<Structure<StructureConstant> | null> {

        const extensionsNeedFilled: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (e: any) => (e.structureType === STRUCTURE_SPAWN || e.structureType === STRUCTURE_EXTENSION)
                && (e.energy < e.energyCapacity));

        return extensionsNeedFilled;
    }


    /**
     * get towers that need to be filled for the room
     * TODO order by ascending
     * @param room the room we are getting towers that need to be filled from
     */
    public static getTowersNeedFilled(room: Room): Array<Structure<StructureConstant> | null> {

        const TOWER_THRESHOLD: number = .85;
        return MemoryApi.getStructures(room, (t: any) => {
            return (t.structureType === STRUCTURE_TOWER && t.energy < (t.energyCapacity * TOWER_THRESHOLD));
        });
    }

    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * TODO limit by something, not sure yet.. room state possibly... controller level? open to input
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    public static getWallRepairTargets(room: Room): Array<Structure<StructureConstant> | null> | null {

        // returns all walls and ramparts under the current wall/rampart limit
        return MemoryApi.getStructures(room,
            (s: any) => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
                && s.hits < this.getWallHpLimit(room));
    }

    /**
     * get a list of open sources in the room (not saturated)
     * @param room the room we are checking
     */
    public static getOpenSources(room: Room): void {
        // lint installed again.. jake hates empty blocks
    }


    /**
     * gets the drop container next to the source
     * @param room the room we are checking in
     * @param source the source we are considering
     */
    public static getMiningContainer(room: Room, source: Source): (Structure<StructureConstant> | null) {

        const containers: any = MemoryApi.getStructures(room,
            (s: any) => s.structureType === STRUCTURE_CONTAINER);


        return _.find(containers,
            (c: any) => Math.abs(c.pos.x - source.pos.x) <= 1 && Math.abs(c.pos.y - source.pos.y) <= 1);
    }

    /**
     * checks if a structure or creep store is full
     * @param target the structure or creep we are checking
     */
    public static isFull(target: any): boolean {
        return false;
    }

    /**
     * get the current hp limit for walls/ramparts
     * @param room the current room
     */
    private static getWallHpLimit(room: Room): number {

        // only do so if the room has a controller otherwise we have an exception
        if (room.controller !== undefined) {

            // % of way to next level
            const controllerProgress: number = room.controller.progress / room.controller.progressTotal;
            const controllerLevel: number = room.controller.level;
            // difference between this levels max and last levels max
            const wallLevelHpDiff: number = RoomHelper.getWallLevelDifference(controllerLevel);
            // last levels max
            const previousHpLimit: number = RoomHelper.calcPreviousWallHpLimit(controllerLevel)

            return previousHpLimit + (wallLevelHpDiff * controllerProgress);
        }
        else {
            throw new Error("Error getting wall limit for room with undefined controller.");
        }
    }
}
