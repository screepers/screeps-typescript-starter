import { MemoryApi } from "./Memory.Api";
import { O_NOFOLLOW, SSL_OP_CISCO_ANYCONNECT } from "constants";
import { RoomHelper } from "Helpers/RoomHelper";
import { ROOM_STATE_INTRO } from "utils/constants";
import { MemoryHelper_Room } from "Helpers/MemoryHelper_Room";

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

        // level 0 -- no danger
        // level 1 -- less than 50 body parts
        // level 2 -- 50 - 150 body parts
        // level 3 -- 150+ body parts OR any boosted body parts
        // level 4 -- full seige, 50+ boosted parts
        // level 5 -- nuke inbound
        // please review these and let me know what you think ^^

        /*
            This is how to find inbound nukes to your room..
            we probably want to put this behind a controller level so we
            aren't calling it every tick on low level rooms you know

            side note: should i stick with the function to update the memory or just do it directly?
        // level 5
        if (room.find(FIND_NUKES) !== undefined) {
            MemoryApi.updateDefcon(room, 5);
            return;
        }*/

        // level 4

        // level 3

        // level 2

        // level 1

        // level 0

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
    public static getExtensionsNeedFilled(room: Room): (Structure<StructureConstant> | null)[] {

        const extensionsNeedFilled: (Structure<StructureConstant> | null)[] = MemoryApi.getStructures(room,
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
        })
    }

    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * TODO limit by something, not sure yet.. room state possibly... controller level? open to input
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    public static getWallRepairTargets(room: Room): Array<Structure<StructureConstant> | null> | null {

        return null;
    }
}
