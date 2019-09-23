import {
    MemoryHelper,
    RoomHelper,
    ERROR_ERROR,
    ROLE_MINER,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    WALL_LIMIT,
    ERROR_WARN,
    UserException,
    MemoryApi,
    REPAIR_THRESHOLD,
    PRIORITY_REPAIR_THRESHOLD,
    RUN_RESERVE_TTL_TIMER,
    TOWER_THRESHOLD
} from "utils/internals";

// an api used for functions related to the room
export class RoomApi {
    /**
     * check if there are hostile creeps in the room
     * @param room the room we are checking
     */
    public static isHostilesInRoom(room: Room): boolean {
        const hostilesInRoom = MemoryApi.getHostileCreeps(room.name);
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
            throw new UserException(
                "Can't set room state for room with no controller!",
                "You attempted to call setRoomState on room [" + room.name + "]. Theres no controller here.",
                ERROR_WARN
            );
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

        // check if we are in intro room state
        // 3 or less creeps so we need to (re)start the room
        const creeps: Array<Creep | null> = MemoryApi.getMyCreeps(room.name);
        if (creeps.length < 3) {
            MemoryApi.updateRoomState(ROOM_STATE_INTRO, room);
            return;
        }
        // ----------

        const storage: StructureStorage | undefined = room.storage;
        const containers: Array<Structure | null> = MemoryApi.getStructureOfType(room.name, STRUCTURE_CONTAINER);
        const sources: Array<Source | null> = MemoryApi.getSources(room.name);
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
        if (creeps.length >= 3) {
            MemoryApi.updateRoomState(ROOM_STATE_BEGINNER, room);
            return;
        }
        // ----------
    }

    /**
     * run the towers in the room for the purpose of defense
     * @param room the room we are defending
     */
    public static runTowersDefense(room: Room): void {
        const towers: StructureTower[] = MemoryApi.getStructureOfType(room.name, STRUCTURE_TOWER) as StructureTower[];
        // choose the most ideal target and have every tower attack it
        const idealTarget: Creep | undefined | null = RoomHelper.chooseTowerTargetDefense(room);
        if (!idealTarget) {
            return;
        }

        // have each tower attack this target
        towers.forEach((t: StructureTower) => {
            if (t) {
                t.attack(idealTarget);
            }
        });
    }

    /**
     * run the towers in the room for the purpose of repairing
     * @param room the room we are repairing structures in
     */
    public static runTowersRepair(room: Room): void {
        const towers: StructureTower[] = MemoryApi.getStructureOfType(room.name, STRUCTURE_TOWER) as StructureTower[];
        // choose the most ideal target and have every tower attack it
        const idealTarget: Structure | undefined | null = RoomHelper.chooseTowerTargetRepair(room);
        if (!idealTarget) {
            return;
        }

        // have each tower attack this target
        towers.forEach((t: StructureTower) => {
            if (t) {
                t.repair(idealTarget);
            }
        });
    }

    /**
     * set the rooms defcon level
     * @param room the room we are setting defcon for
     */
    public static setDefconLevel(room: Room): void {
        const hostileCreeps = MemoryApi.getHostileCreeps(room.name);
        // check level 0 first to reduce cpu drain as it will be the most common scenario
        // level 0 -- no danger
        if (hostileCreeps.length === 0) {
            room.memory.defcon = 0;
            return;
        }

        // now define the variables we will need to check the other cases in the event
        // we are not dealing with a level 0 defcon scenario
        const hostileBodyParts: number = _.sum(hostileCreeps, (c: Creep) => c.body.length);
        const hostileDamageParts: number = _.sum(hostileCreeps, (c: Creep) => {
            return _.filter(c.body, (part: BodyPartDefinition) => {
                if (part.type === ATTACK || part.type === RANGED_ATTACK) {
                    return true;
                }
                return false;
            }).length;
        });
        const boostedHostileBodyParts: number = _.filter(_.flatten(_.map(hostileCreeps, "body")), (p: any) => !!p.boost)
            .length;

        // level 6 -- nuke inbound
        if (room.find(FIND_NUKES).length > 0) {
            room.memory.defcon = 6;
            return;
        }

        // level 5 full seige, 50+ boosted parts
        if (boostedHostileBodyParts >= 50) {
            room.memory.defcon = 5;
            return;
        }

        // level 4 -- 150+ body parts OR any boosted body parts
        if (boostedHostileBodyParts > 0 || hostileBodyParts >= 150) {
            room.memory.defcon = 4;
            return;
        }

        // level 3 -- 50 - 150 body parts
        if (hostileBodyParts < 150 && hostileBodyParts > 50) {
            room.memory.defcon = 3;
            return;
        }

        // level 2 -- Any damaging parts
        if (hostileDamageParts > 0) {
            room.memory.defcon = 2;
            return;
        }

        // level 1 -- less than 50 body parts, no attack parts
        room.memory.defcon = 1;
        return;
    }

    /**
     * get repair targets for the room (any structure under config:REPAIR_THRESHOLD% hp)
     * @param room the room we are checking for repair targets
     */
    public static getRepairTargets(room: Room): Array<Structure<StructureConstant>> {
        return MemoryApi.getStructures(room.name, (struct: Structure<StructureConstant>) => {
            if (struct.structureType !== STRUCTURE_RAMPART && struct.structureType !== STRUCTURE_WALL) {
                return struct.hits < struct.hitsMax * REPAIR_THRESHOLD;
            } else {
                return struct.hits < this.getWallHpLimit(room) * REPAIR_THRESHOLD;
            }
        });
    }

    /**
     * Get priority repair targets for the room (any structure under config:PRIORITY_REPAIR_THRESHOLD% hp)
     * @param room The room we are checking for repair targets
     */
    public static getPriorityRepairTargets(room: Room): Array<Structure<StructureConstant>> {
        return MemoryApi.getStructures(room.name, (struct: Structure<StructureConstant>) => {
            if (struct.structureType !== STRUCTURE_RAMPART && struct.structureType !== STRUCTURE_WALL) {
                return struct.hits < struct.hitsMax * PRIORITY_REPAIR_THRESHOLD;
            } else {
                return struct.hits < this.getWallHpLimit(room) * PRIORITY_REPAIR_THRESHOLD;
            }
        });
    }

    /**
     * get spawn/extensions that need to be filled for the room
     * @param room the room we are getting spawns/extensions to be filled from
     */
    public static getLowSpawnAndExtensions(room: Room): Array<StructureSpawn | StructureExtension> {
        const extensionsNeedFilled: StructureExtension[] = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_EXTENSION,
            (e: StructureExtension) => {
                return e.energy < e.energyCapacity;
            }
        ) as StructureExtension[];

        const spawnsNeedFilled: StructureSpawn[] = (MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_SPAWN,
            (e: StructureSpawn) => {
                return e.energy < e.energyCapacity;
            }
        ) as any) as StructureSpawn[];

        const extensionsAndSpawns: Array<StructureExtension | StructureSpawn> = [];
        _.forEach(extensionsNeedFilled, (ext: StructureExtension) => extensionsAndSpawns.push(ext));
        _.forEach(spawnsNeedFilled, (ext: StructureSpawn) => extensionsAndSpawns.push(ext));
        return extensionsAndSpawns;
    }

    /**
     * get towers that need to be filled for the room
     * @param room the room we are getting towers that need to be filled from
     */
    public static getTowersNeedFilled(room: Room): StructureTower[] {
        const unsortedTowerList: StructureTower[] = <StructureTower[]>MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_TOWER,
            (t: StructureTower) => {
                return t.energy < t.energyCapacity * TOWER_THRESHOLD;
            }
        );
        // Sort by lowest to highest towers, so the most needed gets filled first
        return _.sortBy(unsortedTowerList, (tower: StructureTower) => tower.energy);
    }

    /**
     * get ramparts, or ramparts and walls that need to be repaired
     * @param room the room we are getting ramparts/walls that need to be repaired from
     */
    public static getWallRepairTargets(room: Room): Array<Structure<StructureConstant>> {
        // returns all walls and ramparts under the current wall/rampart limit
        const hpLimit: number = this.getWallHpLimit(room);
        const walls = MemoryApi.getStructureOfType(room.name, STRUCTURE_WALL, (s: StructureWall) => s.hits < hpLimit);
        const ramparts = MemoryApi.getStructureOfType(
            room.name,
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
        const sources = MemoryApi.getSources(room.name);
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
        const containers: Array<Structure<StructureConstant>> = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_CONTAINER
        );

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
    public static getWallHpLimit(room: Room): number {
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
        const nonUpgraderLinks: StructureLink[] = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_LINK,
            (link: StructureLink) => link.id !== upgraderLink.id && link.energy >= 100
        ) as StructureLink[];
        for (const link of nonUpgraderLinks) {
            if (link.cooldown > 0) {
                continue;
            }

            // Get the amount of energy we are sending over
            const missingEnergy: number = upgraderLink.energyCapacity - upgraderLink.energy;
            let amountToTransfer: number = 0;
            if (missingEnergy > link.energy) {
                amountToTransfer = link.energy;
            } else {
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

    /**
     * simulate or update the reserve TTL for all remote rooms in that room
     * @param room the room we are updating the remote rooms for
     */
    public static simulateReserveTTL(room: Room): void {
        const remoteRooms = MemoryApi.getRemoteRooms(room);
        for (const remoteRoom of remoteRooms) {
            // Handle unreserved and undefined rooms
            if (!remoteRoom) {
                continue;
            }

            const currentRoom: Room = Game.rooms[remoteRoom.roomName];
            if (currentRoom === undefined) {
                continue;
            }

            if (currentRoom === undefined) {
                // Simulate the dropping of reserve timer by the number of ticks between checks
                remoteRoom.reserveTTL -= RUN_RESERVE_TTL_TIMER;
                if (remoteRoom.reserveTTL < 0) {
                    remoteRoom.reserveTTL = 0;
                }
            } else if (currentRoom.controller) {
                // Get the actual value of the reserve timer
                if (currentRoom.controller!.reservation) {
                    remoteRoom.reserveTTL = Game.rooms[remoteRoom.roomName].controller!.reservation!.ticksToEnd;
                } else {
                    remoteRoom.reserveTTL = 0;
                }
            }
        }
    }

    /**
     * sets the ramparts status in the room to public or private
     * @param room the room we are setting ramparts for
     */
    public static runSetRampartStatus(room: Room): void {
        // If defcon is on in the room, set to private, otherwise, public
        const rampartsInRoom: StructureRampart[] = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_RAMPART
        ) as StructureRampart[];
        const isPublic: boolean = MemoryApi.getDefconLevel(room) > 0;
        for (const i in rampartsInRoom) {
            const rampart: StructureRampart = rampartsInRoom[i];
            rampart.setPublic(!isPublic);
        }
    }

    /**
     * get the rampart the defender should stand on when defending the room
     * @param room the room we are looking for the rampart in
     * @param target the target creep we are defending against
     */
    public static getDefenseRampart(room: Room, target: Creep | null): StructureRampart | null {
        if (!target) {
            return null;
        }
        const rampartsInRoom: StructureRampart[] = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_RAMPART
        ) as StructureRampart[];
        const openRamparts: StructureRampart[] = _.filter(rampartsInRoom, (rampart: StructureRampart) => {
            const foundCreeps: Creep[] = rampart.pos.lookFor(LOOK_CREEPS);
            const foundStructures: Array<Structure<StructureConstant>> = rampart.pos.lookFor(LOOK_STRUCTURES);
            return !foundCreeps && !foundStructures;
        });
        return target!.pos.findClosestByRange(openRamparts);
    }

    /**
     * Activate safemode if we need to
     * @param room the room we are checking safemode for
     * @param defcon the defcon level of the room
     */
    public static runSafeMode(room: Room, defcon: number): void {
        // If we are under attack before we have a tower, trigger a safe mode
        if (defcon >= 2 && !RoomHelper.isExistInRoom(room, STRUCTURE_TOWER)) {
            if (room.controller!.safeModeAvailable) {
                room.controller!.activateSafeMode();
            }
        }

        // If we are under attack and our towers have no energy, trigger a safe mode
        const towerEnergy = _.sum(MemoryApi.getStructureOfType(room.name, STRUCTURE_TOWER), "energy");
        if (defcon >= 3 && towerEnergy === 0) {
            if (room.controller!.safeModeAvailable) {
                room.controller!.activateSafeMode();
            }
        }
    }
}
