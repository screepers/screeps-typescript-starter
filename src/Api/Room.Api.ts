import MemoryHelper from "Helpers/MemoryHelper";
import MemoryHelper_Room from "Helpers/MemoryHelper_Room";
import RoomHelper from "Helpers/RoomHelper";
import {
    ERROR_ERROR,
    ROLE_MINER,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_SEIGE,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    WALL_LIMIT,
    ERROR_WARN
} from "utils/constants";
import UserException from "utils/UserException";
import MemoryApi from "./Memory.Api";
import { REPAIR_THRESHOLD } from "utils/config";

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
     * @param room the room we are setting state for
     */
    public static setRoomState(room: Room): void {

        // If theres no controller, throw an error
        if (!room.controller) {
            throw new UserException("Can't set room state for room with no controller!",
                "You attempted to call setRoomState on room [" + room.name + "]. Theres no controller here.",
                ERROR_WARN);
        }
        // ----------


        // check if we are in nuke inbound room state
        // nuke is coming in and we need to gtfo, but they take like 20k ticks, so only check every 1000 or so
        if (RoomHelper.excecuteEveryTicks(1000)) {
            const incomingNukes = room.find(FIND_NUKES);
            if (incomingNukes.length > 0) {
                MemoryApi.updateRoomState(ROOM_STATE_NUKE_INBOUND, room);
                return;
            }
        }
        // ----------


        // check if we are siege room state
        // defcon is level 3+ and hostiles activity in the room is high
        const defconLevel: number = MemoryApi.getDefconLevel(room);
        if (defconLevel >= 3) {
            MemoryApi.updateRoomState(ROOM_STATE_SEIGE, room);
            return;
        }
        // ----------

        const storage: StructureStorage | undefined = room.storage;
        const containers: Array<Structure | null> = MemoryApi.getStructureOfType(room, STRUCTURE_EXTENSION);
        const sources: Array<Source | null> = MemoryApi.getSources(room);
        if (room.controller!.level >= 6) {

            // check if we are in upgrader room state
            // container mining and storage set up, and we got links online
            if (
                RoomHelper.isContainerMining(room, sources, containers) &&
                RoomHelper.isUpgraderLink(room) &&
                storage !== undefined
            ) {

                if (RoomHelper.isStimulateRoom(room)) {
                    MemoryApi.updateRoomState(ROOM_STATE_STIMULATE, room);
                    return;
                }
                // otherwise, just upgrader room state
                MemoryApi.updateRoomState(ROOM_STATE_UPGRADER, room);
                return;
            }
        }
        // ----------


        if (room.controller!.level >= 4) {
            // check if we are in advanced room state
            // container mining and storage set up
            // then check if we are flagged for sitmulate state
            if (RoomHelper.isContainerMining(room, sources, containers) && storage !== undefined) {

                if (RoomHelper.isStimulateRoom(room)) {
                    MemoryApi.updateRoomState(ROOM_STATE_STIMULATE, room);
                    return;
                }
                // otherwise, just advanced room state
                MemoryApi.updateRoomState(ROOM_STATE_ADVANCED, room);
                return;
            }
        }
        // ----------


        if (room.controller!.level >= 3) {
            // check if we are in intermediate room state
            // container mining set up, but no storage
            if (RoomHelper.isContainerMining(room, sources, containers) && storage === undefined) {
                MemoryApi.updateRoomState(ROOM_STATE_INTER, room);
                return;
            }
        }
        // ----------


        // check if we are in beginner room state
        // no containers set up at sources so we are just running a bare knuckle room
        const creeps: Array<Creep | null> = MemoryApi.getMyCreeps(room);
        if (creeps.length >= 3) {
            MemoryApi.updateRoomState(ROOM_STATE_BEGINNER, room);
            return;
        }
        // ----------


        // check if we are in intro room state
        // 3 or less creeps so we need to (re)start the room
        MemoryApi.updateRoomState(ROOM_STATE_INTRO, room);
    }

    /**
     * run the towers in the room
     * @param room the room we are defending
     */
    public static runTowers(room: Room): void {

        const towers = MemoryApi.getStructureOfType(room, STRUCTURE_TOWER);
        // choose the most ideal target and have every tower attack it
        const idealTarget: Creep | undefined | null = RoomHelper.chooseTowerTarget(room);

        // have each tower attack this target
        towers.forEach((t: any) => {
            if (t) {
                t.attack(idealTarget);
            }
        });
    }

    /**
     * set the rooms defcon level
     * @param room the room we are setting defcon for
     */
    public static setDefconLevel(room: Room): number {

        const hostileCreeps: Array<Creep | null> = MemoryApi.getHostileCreeps(room);
        // check level 0 first to reduce cpu drain as it will be the most common scenario
        // level 0 -- no danger
        if (hostileCreeps.length === 0) {
            return 0;
        }

        // now define the variables we will need to check the other cases in the event
        // we are not dealing with a level 0 defcon scenario
        const hostileBodyParts: number = _.sum(hostileCreeps, (c: any) => c.body.length);
        const boostedHostileBodyParts: number = _.filter(_.flatten(_.map(hostileCreeps, "body")), (p: any) => !!p.boost)
            .length;

        // level 5 -- nuke inbound
        if (room.find(FIND_NUKES) !== undefined) {
            return 5;
        }

        // level 4 full seige, 50+ boosted parts
        if (boostedHostileBodyParts >= 50) {
            return 4;
        }

        // level 3 -- 150+ body parts OR any boosted body parts
        if (boostedHostileBodyParts > 0 || hostileBodyParts >= 150) {
            return 3;
        }

        // level 2 -- 50 - 150 body parts
        if (hostileBodyParts < 150 && hostileBodyParts >= 50) {
            return 2;
        }

        // level 1 -- less than 50 body parts
        return 1;
    }

    /**
     * get repair targets for the room (any structure under 75% hp)
     * @param room the room we are checking for repair targets
     */
    public static getRepairTargets(room: Room): Array<Structure<StructureConstant>> {
        return MemoryApi.getStructures(room, (s: Structure<StructureConstant>) => {
            if (s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART) {
                return s.hits < s.hitsMax * REPAIR_THRESHOLD;
            } else {
                return s.hits < this.getWallHpLimit(room) * REPAIR_THRESHOLD;
            }
        });
    }

    /**
     * get spawn/extensions that need to be filled for the room
     * @param room the room we are getting spawns/extensions to be filled from
     */
    public static getLowSpawnAndExtensions(room: Room): Array<StructureSpawn | StructureExtension> {
        const extensionsNeedFilled = <Array<StructureSpawn | StructureExtension>>MemoryApi.getStructures(
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
    public static getTowersNeedFilled(room: Room): StructureTower[] {
        const TOWER_THRESHOLD: number = 0.85;

        return <StructureTower[]>MemoryApi.getStructureOfType(room, STRUCTURE_TOWER, (t: StructureTower) => {
            return t.energy < t.energyCapacity * TOWER_THRESHOLD;
        });
    }

    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    public static getWallRepairTargets(room: Room): Array<Structure<StructureConstant>> {
        // returns all walls and ramparts under the current wall/rampart limit
        const hpLimit: number = this.getWallHpLimit(room);
        const walls = MemoryApi.getStructureOfType(room, STRUCTURE_WALL, (s: StructureWall) => s.hits < hpLimit);
        const ramparts = MemoryApi.getStructureOfType(
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
                if (!miner.memory.job) {
                    return false;
                }
                if (miner.memory.job!.targetID === source.id) {
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
    public static getMiningContainer(room: Room, source: Source): Structure<StructureConstant> | undefined {
        const containers: Array<Structure<StructureConstant>> = MemoryApi.getStructureOfType(room, STRUCTURE_CONTAINER);

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
     * run links for the room
     * @param room the room we want to run links for
     */
    public static runLinks(room: Room): void {

        // If we don't have an upgrader link, cancel early
        const upgraderLink: StructureLink | null = MemoryApi.getUpgraderLink(room);
        if (!upgraderLink || upgraderLink.energy <= 400) {
            return;
        }

        // Get non-upgrader links above 100 energy to fill the upgrader link
        const nonUpgraderLinks: StructureLink[] = MemoryApi.getStructureOfType(room, STRUCTURE_LINK,
            (link: StructureLink) => link.id !== upgraderLink.id && link.energy >= 100) as StructureLink[];
        for (const link of nonUpgraderLinks) {
            if (link.cooldown > 0) {
                continue;
            }

            // Get the amount of energy we are sending over
            const missingEnergy: number = upgraderLink.energyCapacity - upgraderLink.energy;
            let amountToTransfer: number = 0;
            if (missingEnergy > link.energy) {
                amountToTransfer = link.energy;
            }
            else {
                amountToTransfer = missingEnergy;
            }

            link.transferEnergy(upgraderLink, amountToTransfer);
        }
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
