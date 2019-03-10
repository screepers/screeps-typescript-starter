import MemoryHelper from "Helpers/MemoryHelper";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import RoomHelper from "Helpers/RoomHelper";
import { ERROR_ERROR, ROLE_MINER, ROOM_STATE_INTRO, WALL_LIMIT } from "utils/constants";
import UserException from "utils/UserException";
import MemoryApi from "./Memory.Api";

// an api used for functions related to the room
export default class RoomApi {
    /**
     * check if there are hostile creeps in the room
     * @param room the room we are checking
     */
    public static isHostilesInRoom(room: Room): boolean {
        const hostilesInRoom = MemoryApi.getHostileCreeps(room);
        return hostilesInRoom.length > 0;
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
        const containers: Array<Structure | null> = MemoryApi.getStructureOfType(room, STRUCTURE_EXTENSION);
        const links: Array<Structure | null> = MemoryApi.getStructureOfType(room, STRUCTURE_LINK);
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
        if (
            RoomHelper.isContainerMining(room, sources, containers) &&
            RoomHelper.isUpgraderLink(room, links) &&
            storage !== undefined
        ) {
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
        const towers = MemoryApi.getStructureOfType(room, STRUCTURE_TOWER);
        // --------

        // choose the most ideal target and have every tower attack it
        const idealTarget = RoomHelper.chooseTowerTarget(room);

        // have each tower attack this target
        towers.forEach((t: any) => {
            if (t !== null) {
                t.attack(idealTarget);
            }
        });
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
        const hostileBodyParts: number = _.sum(hostileCreeps, (c: any) => c.body.length);
        const boostedHostileBodyParts: number = _.filter(_.flatten(_.map(hostileCreeps, "body")), (p: any) => !!p.boost)
            .length;

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
        const REPAIR_THRESHOLD: number = 0.75;
        return MemoryApi.getStructures(room, (s: Structure<StructureConstant>) => {
            return s.hits < s.hitsMax * REPAIR_THRESHOLD;
        });
    }

    /**
     * get spawn/extensions that need to be filled for the room
     * @param room the room we are getting spawns/extensions to be filled from
     */
    public static getExtensionsNeedFilled(room: Room): Array<Structure<StructureConstant> | null> {
        const extensionsNeedFilled: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(
            room,
            (e: any) =>
                (e.structureType === STRUCTURE_SPAWN || e.structureType === STRUCTURE_EXTENSION) &&
                e.energy < e.energyCapacity
        );

        return extensionsNeedFilled;
    }

    /**
     * get towers that need to be filled for the room
     * TODO order by ascending
     * @param room the room we are getting towers that need to be filled from
     */
    public static getTowersNeedFilled(room: Room): Array<Structure<StructureConstant> | null> {
        const TOWER_THRESHOLD: number = 0.85;

        return MemoryApi.getStructureOfType(room, STRUCTURE_TOWER, (t: StructureTower) => {
            return t.energy < t.energyCapacity * TOWER_THRESHOLD;
        });
    }

    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * TODO limit by something, not sure yet.. room state possibly... controller level? open to input
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    public static getWallRepairTargets(room: Room): Array<Structure<StructureConstant> | null> | null {
        // returns all walls and ramparts under the current wall/rampart limit
        const hpLimit: number = this.getWallHpLimit(room);
        const walls: Array<Structure | null> = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_WALL,
            (s: StructureWall) => s.hits < hpLimit
        );
        const ramparts: Array<Structure | null> = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_RAMPART,
            (s: StructureRampart) => s.hits < hpLimit
        );

        return walls.concat(ramparts);
    }

    /**
     * get a list of open sources in the room (not saturated)
     * @param room the room we are checking
     */
    public static getOpenSources(room: Room): Array<Source | null> {
        const sources = MemoryApi.getSources(room);
        // ? this assumes that we are only using this for domestic rooms
        // ? if we use it on domestic rooms then I'll need to distinguish between ROLE_REMOTE_MINER
        const miners = MemoryHelper.getCreepOfRole(room, ROLE_MINER);
        const lowSources = _.filter(sources, (source: Source) => {
            let totalWorkParts = 0;
            // Count the number of work parts targeting the source
            _.remove(miners, (miner: Creep) => {
                if (miner.memory.workTarget === source.id) {
                    const workPartCount = miner.getActiveBodyparts(WORK);
                    totalWorkParts += workPartCount;
                    return true;
                }
                return false;
            });

            // filter out sources where the totalWorkParts < workPartsNeeded ( energyCap / ticksToReset / energyPerPart )
            return totalWorkParts < source.energyCapacity / 300 / 2;
        });

        return lowSources;
    }

    /**
     * gets the drop container next to the source
     * @param room the room we are checking in
     * @param source the source we are considering
     */
    public static getMiningContainer(room: Room, source: Source): Structure<StructureConstant> | null {
        const containers: any = MemoryApi.getStructureOfType(room, STRUCTURE_CONTAINER);

        return _.find(
            containers,
            (c: any) => Math.abs(c.pos.x - source.pos.x) <= 1 && Math.abs(c.pos.y - source.pos.y) <= 1
        );
    }

    /**
     * checks if a structure or creep store is full
     * @param target the structure or creep we are checking
     */
    public static isFull(target: any): boolean {
        if (target instanceof Creep) {
            return _.sum(target.carry) === target.carryCapacity;
        } else if (target.hasOwnProperty("store")) {
            return _.sum(target.store) === target.storeCapacity;
        }

        // if not one of these two, there was an error
        throw new UserException("Invalid Target", "isFull called on target with no capacity for storage.", ERROR_ERROR);
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
            // difference between this levels max and last levels max
            const wallLevelHpDiff: number = RoomHelper.getWallLevelDifference(room.controller.level);
            // Minimum hp chunk to increase limit
            const chunkSize: number = 10000;
            // The adjusted hp difference for controller progress and chunking
            const numOfChunks: number = Math.floor((wallLevelHpDiff * controllerProgress) / chunkSize);

            return WALL_LIMIT[room.controller.level] + chunkSize * numOfChunks;
        } else {
            throw new UserException(
                "Undefined Controller",
                "Error getting wall limit for room with undefined controller.",
                ERROR_ERROR
            );
        }
    }

    /**
     * calls helper functions to create the full job queue for the room
     * @param room the room we want to queue to be created for
     */
    public static createJobQueue(room: Room): void {
        // Call all the sub job queues
        if (RoomHelper.isOwnedRoom(room)) {
            this.createJobQueueWorker(room);
            this.createJobQueueLorry(room);
            this.createJobQueueHarvester(room);
            this.createEnergyQueue(room);
        } else {
            // throw error if we do not own this room
        }
    }

    /**
     * create a job queue for the room for worker creeps
     * @param room the room we want the queue to be created for
     */
    public static createJobQueueWorker(room: Room): void {
        // possibly a list of objects with 2 propeties, jobName and priority
        // so we have some way thats less fragile than array order to
        // figure out what jobs need to be tackled first.. idk just thinking
    }

    /**
     * create a job queue for the room for harvester creeps
     * @param room the room we want the queue to be created for
     */
    public static createJobQueueHarvester(room: Room): void {}

    /**
     * createa a job queue for the room for harvester creeps
     * @param room the room we want the queue to be created for
     */
    public static createJobQueueLorry(room: Room): void {
        //
    }

    /**
     * create a list of ways to get energy from the room
     * @param room the room we want the queue to be created for
     */
    public static createEnergyQueue(room: Room): void {
        // we can access this list from memory for simplicity sake
        // and creeps can decide which to pull from based on their creep options
        // in memory... for example in room state advanced we cut off workers from containers
        // but keep it open for harvesters.. creep options will make this simple i hope
    }

    /**
     * run links for the room
     * @param room the room we want to run links for
     */
    public static runLinks(room: Room): void {
        // we find a way to get an upgrader link (closest one to controller)
        // and make sure the other links keep this one full
        // possibly also if all links energy together is below the
        // carry cap of upgrader we could have workers fill it for them
        // we might want to let workers help with spawning IF NEEDED in
        // seige/military situation but im just rambling now
    }

    /**
     * run terminal for the room
     * @param room the room we want to run terminal for
     */
    public static runTerminal(room: Room): void {
        // here we can do market stuff, send resources from room to room
        // to each other, and make sure we have the ideal ratio of minerals
        // we decide that we want
    }

    /**
     * run labs for the room
     * @param room the room we want to run labs for
     */
    public static runLabs(room: Room): void {
        // i have no idea yet lol
    }
}
