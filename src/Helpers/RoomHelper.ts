import {
    MemoryApi,
    WALL_LIMIT,
    ERROR_WARN,
    STIMULATE_FLAG,
    UserException,
    TOWER_ALLOWED_TO_REPAIR
} from "utils/internals";

// helper functions for rooms
export class RoomHelper {
    /**
     * check if a specified room is owned by you
     * @param room the room we want to check
     */
    public static isOwnedRoom(room: Room): boolean {
        if (room.controller !== undefined) {
            return room.controller.my;
        } else {
            return false;
        }
    }

    /**
     * check if a specified room is an ally room
     * @param room the room we want to check
     */
    public static isAllyRoom(room: Room): boolean {
        // returns true if a room has one of our names or is reserved by us
        if (room.controller === undefined) {
            return false;
        } else if (
            room.controller.owner !== undefined &&
            (room.controller.owner.username === "UhmBrock" || room.controller.owner.username === "Jakesboy2")
        ) {
            return true;
        } else if (
            room.controller.reservation !== undefined &&
            room.controller.reservation.username !== undefined &&
            (room.controller.reservation!.username === "UhmBrock" ||
                room.controller.reservation!.username === "Jakesboy2")
        ) {
            return true;
        }

        return false;
    }

    /**
     * check if a room is a source keeper room
     * @param room the room we want to check
     */
    public static isSourceKeeperRoom(room: Room): boolean {
        // Contains x pos in [1], y pos in [2]
        const parsedName: any = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room.name);
        const xOffset = parsedName[1] % 10;
        const yOffset = parsedName[2] % 10;
        // If x & y === 5 it's not SK, but both must be between 4 and 6
        const isSK =
            !(xOffset === 5 && xOffset === 5) && (xOffset >= 4 && xOffset <= 6) && (yOffset >= 4 && yOffset <= 6);
        return isSK;
    }

    /**
     * check if a room is a highway room
     * @param room the room we want to check
     */
    public static isHighwayRoom(room: Room): boolean {
        // Contains x pos in [1], y pos in [2]
        const parsedName: any = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room.name);
        // If x || y is divisible by 10, it's a highway
        if (parsedName[1] % 10 === 0 || parsedName[2] % 10 === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * check if a room is close enough to send a creep to
     * @param room the room we want to check
     */
    public static inTravelRange(homeRoom: string, targetRoom: string): boolean {
        const routeArray: Array<{ exit: ExitConstant; room: string }> = Game.map.findRoute(
            homeRoom,
            targetRoom
        ) as Array<{ exit: ExitConstant; room: string }>;
        return routeArray.length < 20;
    }

    /**
     * check if the object exists within a room
     * @param room the room we want to check
     * @param objectConst the object we want to check for
     */
    public static isExistInRoom(room: Room, objectConst: StructureConstant): boolean {
        return MemoryApi.getStructures(room.name, s => s.structureType === objectConst).length > 0;
    }

    /**
     * get the stored amount from the target
     * @param target the target we want to check the storage of
     * @param resourceType the resource we want to check the storage for
     */
    public static getStoredAmount(target: any, resourceType: ResourceConstant): number | undefined {
        if (target instanceof Creep) {
            return target.carry[resourceType];
        } else if (target.hasOwnProperty("store")) {
            return target.store[resourceType];
        } else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
            return target.energy;
        }
        // Throw an error to identify when this fail condition is met
        throw new UserException(
            "Failed to getStoredAmount of a target",
            "ID: " + target.id + "\n" + JSON.stringify(target),
            ERROR_ERROR
        );
    }

    /**
     * get the capacity from the target
     * @param target the target we want to check the capacity of
     */
    public static getStoredCapacity(target: any): number {
        if (target instanceof Creep) {
            return target.carryCapacity;
        } else if (target.hasOwnProperty("store")) {
            return target.storeCapacity;
        } else if (target.hasOwnProperty("energyCapacity")) {
            return target.energyCapacity;
        }

        return -1;
    }

    /**
     * get the amount of damage a tower will do at this distance
     * @param range the distance the target is from the tower
     */
    public static getTowerDamageAtRange(range: number) {
        if (range <= TOWER_OPTIMAL_RANGE) {
            return TOWER_POWER_ATTACK;
        }
        if (range >= TOWER_FALLOFF_RANGE) {
            range = TOWER_FALLOFF_RANGE;
        }
        return (
            TOWER_POWER_ATTACK -
            (TOWER_POWER_ATTACK * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE)) /
                (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE)
        );
    }

    /**
     * only returns true every ${parameter} number of ticks
     * @param ticks the number of ticks you want between executions
     */
    public static excecuteEveryTicks(ticks: number): boolean {
        return Game.time % ticks === 0;
    }

    /**
     * check if container mining is active in a room (each source has a container in range)
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    public static isContainerMining(
        room: Room,
        sources: Array<Source | null>,
        containers: Array<Structure<StructureConstant> | null>
    ): boolean {
        // Loop over sources and make sure theres at least one container in range to it
        let numMiningContainers: number = 0;

        _.forEach(sources, (source: Source) => {
            if (_.some(containers, (container: StructureContainer) => source.pos.inRangeTo(container.pos, 2))) {
                numMiningContainers++;
            }
        });

        return numMiningContainers === sources.length;
    }

    /**
     * check if the link is an upgrader link
     * @param room the room we are checking
     * @param sources the sources we are checking
     * @param containers the containers we are checking
     */
    public static getUpgraderLink(room: Room): Structure<StructureConstant> | null {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException(
                "Stimulate flag check on non-owned room",
                "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]",
                ERROR_WARN
            );
        }

        const links: Array<Structure<StructureConstant>> = MemoryApi.getStructureOfType(room.name, STRUCTURE_LINK);
        const controller: StructureController | undefined = room.controller;

        // Break early if we don't have 3 links yet
        if (links.length < 3) {
            return null;
        }

        // Make sure theres a controller in the room
        if (!controller) {
            throw new UserException(
                "Tried to getUpgraderLink of a room with no controller",
                "Get Upgrader Link was called for room [" +
                    room.name +
                    "]" +
                    ", but theres no controller in this room.",
                ERROR_WARN
            );
        }

        // Find the closest link to the controller, this is our upgrader link
        return controller!.pos.findClosestByRange(links);
    }

    /**
     * Check and see if an upgrader link exists
     * @param room the room we are checking for
     */
    public static isUpgraderLink(room: Room): boolean {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException(
                "Stimulate flag check on non-owned room",
                "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]",
                ERROR_WARN
            );
        }

        return this.getUpgraderLink(room) !== null;
    }

    /**
     * Check if the stimulate flag is present for a room
     * @param room the room we are checking for
     */
    public static isStimulateRoom(room: Room): boolean {
        // Throw warning if we do not own this room
        if (!this.isOwnedRoom(room)) {
            throw new UserException(
                "Stimulate flag check on non-owned room",
                "You attempted to check for a stimulate flag in a room we do not own. Room [" + room.name + "]",
                ERROR_WARN
            );
        }

        const terminal: StructureTerminal | undefined = room.terminal;
        // Check if we have a stimulate flag with the same room name as this flag
        return _.some(Memory.flags, (flag: FlagMemory) => {
            if (flag.flagType === STIMULATE_FLAG) {
                return Game.flags[flag.flagName].pos.roomName === room.name && terminal !== undefined;
            }
            return false;
        });
    }

    /**
     * choose an ideal target for the towers to attack
     * TODO actually choose an ideal target not just the first one lol
     * @param room the room we are in
     */
    public static chooseTowerTargetDefense(room: Room): Creep | null | undefined {
        // get the creep we will do the most damage to
        const hostileCreeps: Array<Creep | null> = MemoryApi.getHostileCreeps(room.name);
        const isHealers: boolean = _.some(hostileCreeps, (c: Creep) =>
            _.some(c.body, (b: BodyPartDefinition) => b.type === "heal")
        );
        const isAttackers: boolean = _.some(hostileCreeps, (c: Creep) =>
            _.some(c.body, (b: BodyPartDefinition) => b.type === "attack" || b.type === "ranged_attack")
        );
        const isWorkers: boolean = _.some(hostileCreeps, (c: Creep) =>
            _.some(c.body, (b: BodyPartDefinition) => b.type === "work")
        );
        const isCivilians: boolean = _.some(
            hostileCreeps,
            (creep: Creep) =>
                !_.some(creep.body, (b: BodyPartDefinition) => b.type === "heal") &&
                !_.some(creep.body, (b: BodyPartDefinition) => b.type === "attack" || b.type === "ranged_attack") &&
                !_.some(creep.body, (b: BodyPartDefinition) => b.type === "work")
        );

        // If healers are present with attackers, target healers
        if (isHealers && isAttackers && !isWorkers) {
            return _.find(hostileCreeps, (c: Creep) => _.some(c.body, (b: BodyPartDefinition) => b.type === "heal"));
        }

        // If workers are present, target worker
        if (isWorkers) {
            return _.find(hostileCreeps, (c: Creep) => _.some(c.body, (b: BodyPartDefinition) => b.type === "work"));
        }

        // If attackers are present, target them
        if (isAttackers) {
            return _.find(hostileCreeps, (c: Creep) => _.some(c.body, (b: BodyPartDefinition) => b.type === "attack"));
        }

        // If no combat related creeps, target civilians
        if (isCivilians) {
            _.find(
                hostileCreeps,
                (creep: Creep) =>
                    !_.some(creep.body, (b: BodyPartDefinition) => b.type === "heal") &&
                    !_.some(creep.body, (b: BodyPartDefinition) => b.type === "attack" || b.type === "ranged_attack") &&
                    !_.some(creep.body, (b: BodyPartDefinition) => b.type === "work")
            );
        }

        // If there are no hostile creeps, or we didn't find a valid target, return undefined
        return undefined;
    }

    /**
     * Search for the ideal repair target for the tower
     * @param room the room we are searching for repair targets in
     */
    public static chooseTowerTargetRepair(room: Room): Structure | undefined | null {
        // Check for priority repair job of an allowed type
        const priorityRepairJobs = MemoryApi.getPriorityRepairJobs(room);
        if (priorityRepairJobs.length > 0) {
            for (const job of priorityRepairJobs) {
                const target: Structure = Game.getObjectById(job.targetID) as Structure;
                if (this.isTowerAllowedToRepair(target.structureType)) {
                    return target;
                }
            }
        }

        // Check for non-priority repair jobs of an allowed type
        const repairJobs = MemoryApi.getRepairJobs(room, (job: WorkPartJob) => !job.isTaken);
        if (repairJobs.length > 0) {
            for (const job of priorityRepairJobs) {
                const target: Structure = Game.getObjectById(job.targetID) as Structure;
                if (this.isTowerAllowedToRepair(target.structureType)) {
                    return target;
                }
            }
        }

        return undefined;
    }

    /**
     * Decide if a structure type is allowed for the tower to repair
     * @param target the target we are checking for
     */
    public static isTowerAllowedToRepair(structureType: StructureConstant): boolean {
        for (const i in TOWER_ALLOWED_TO_REPAIR) {
            const currentStructureType = TOWER_ALLOWED_TO_REPAIR[i];
            if (currentStructureType === structureType) {
                return true;
            }
        }
        return false;
    }

    // Get the number of non-terrain-wall tiles around a RoomObject
    public static getNumAccessTilesForTarget(target: RoomObject): number {
        let accessibleTiles = 0;
        const roomTerrain: RoomTerrain = new Room.Terrain(target.pos.roomName);
        for (let y = target.pos.y - 1; y <= target.pos.y + 1; y++) {
            for (let x = target.pos.x - 1; x <= target.pos.x + 1; x++) {
                if (target.pos.x === x && target.pos.y === y) {
                    continue;
                }
                if (roomTerrain.get(x, y) !== TERRAIN_MASK_WALL) {
                    accessibleTiles++;
                }
            }
        }
        return accessibleTiles;
    }

    /**
     * Get the difference in Wall/Rampart HP between the current and previous RCL
     * @param controllerLevel the level of the controller in the room
     */
    public static getWallLevelDifference(controllerLevel: number): number {
        return WALL_LIMIT[controllerLevel] - WALL_LIMIT[controllerLevel - 1];
    }

    /**
     * Returns the number of hostile creeps recorded in the room
     * @param room The room to check
     */
    public static numHostileCreeps(room: Room): number {
        const hostiles = MemoryApi.getHostileCreeps(room.name);
        return hostiles.length;
    }
    /**
     * Return the number of remote rooms associated with the given room
     * @param room
     */
    public static numRemoteRooms(room: Room): number {
        const remoteRooms = MemoryApi.getRemoteRooms(room);
        return remoteRooms.length;
    }

    /**
     * get number of associated claim rooms
     * @param room
     */
    public static numClaimRooms(room: Room): number {
        const claimRooms = MemoryApi.getClaimRooms(room);
        return claimRooms.length;
    }

    /**
     * get number of associated attack rooms
     * @param room
     */
    public static numAttackRooms(room: Room): number {
        const attackRooms = MemoryApi.getAttackRooms(room);
        return attackRooms.length;
    }

    /**
     * Returns the number of sources in a room
     * @param room The room to check
     */
    public static numSources(room: Room): number {
        return Memory.rooms[room.name].sources.data.length;
    }
    /**
     * Returns the number of sources in all remoteRooms connected to room
     * @param room The room to check the remoteRooms of
     */
    public static numRemoteSources(room: Room): number {
        // TODO: Fix this to use remote room name memory which contains the actual source reference
        // TODO: remove sources and structures from the remote room dependent memory itself
        const remoteRooms: RemoteRoomMemory[] = Memory.rooms[room.name].remoteRooms!;
        let numSources: number = 0;

        _.forEach(remoteRooms, (rr: RemoteRoomMemory) => {
            if (!rr) {
                return;
            }

            let sourcesInRoom: number = 0;
            if (
                Memory.rooms[rr.roomName] &&
                Memory.rooms[rr.roomName].sources &&
                Memory.rooms[rr.roomName].sources.data
            ) {
                sourcesInRoom = Memory.rooms[rr.roomName].sources.data.length;
            } else {
                sourcesInRoom = rr.sources.data;
            }
            numSources += sourcesInRoom;
        });
        return numSources;
    }

    /**
     * get number of remote defenders we need
     * @param room The room to check the dependencies of
     */
    public static numRemoteDefenders(room: Room): number {
        const remoteRooms: RemoteRoomMemory[] = Memory.rooms[room.name].remoteRooms!;
        let numRemoteDefenders: number = 0;

        _.forEach(remoteRooms, (rr: RemoteRoomMemory) => {
            if (!rr) {
                return;
            }

            // If there are any hostile creeps, add one to remoteDefenderCount
            // Get hostile creeps in the remote room
            const defconLevel = Memory.rooms[rr.roomName].defcon;
            if (defconLevel >= 2) {
                numRemoteDefenders++;
            }
        });

        return numRemoteDefenders;
    }

    /**
     * get the number of claim rooms that have not yet been claimed
     * @param room the room we are checking for
     */
    public static numCurrentlyUnclaimedClaimRooms(room: Room): number {
        const allClaimRooms: Array<ClaimRoomMemory | undefined> = MemoryApi.getClaimRooms(room);
        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
        let sum: number = 0;

        // No existing claim rooms
        if (allClaimRooms[0] === undefined) {
            return 0;
        }

        for (const claimRoom of allClaimRooms) {
            if (
                !_.some(ownedRooms, ownedRoom => {
                    if (claimRoom) {
                        return room.name === claimRoom!.roomName;
                    }
                    return false;
                })
            ) {
                ++sum;
            }
        }

        return sum;
    }

    /**
     * get the number of domestic defenders by the defcon number
     * @param defcon the defcon level of the room
     * @param isTowers boolean representing if tower exists in room
     * @returns the number of defenders to spawn
     */
    public static getDomesticDefenderLimitByDefcon(defcon: number, isTowers: boolean): number {
        switch (defcon) {
            case 2:
                return isTowers === true ? 0 : 2;
            case 3:
                return isTowers === true ? 0 : 2;
            case 4:
                return isTowers === true ? 1 : 2;
        }
        return 0;
    }

    /**
     * convert a room object to a room position object
     * @param roomObj the room object we are converting
     */
    public static convertRoomObjToRoomPosition(roomObj: RoomObject): RoomPosition | null {
        if (roomObj.room === undefined) {
            return null;
        }
        const x: number = roomObj.pos.x;
        const y: number = roomObj.pos.y;
        const roomName: string = roomObj.room!.name;
        return new RoomPosition(x, y, roomName);
    }

    /**
     * check if the first room is a remote room of the second
     */
    public static isRemoteRoomOf(dependentRoomName: string, hostRoomName?: string): boolean {
        // early returns
        if (!hostRoomName) {
            const ownedRooms: Room[] = MemoryApi.getOwnedRooms();
            for (const room of ownedRooms) {
                const remoteRooms: RemoteRoomMemory[] = MemoryApi.getRemoteRooms(room);
                if (_.some(remoteRooms, (rr: RemoteRoomMemory) => rr.roomName === dependentRoomName)) {
                    return true;
                }
            }
            return false;
        }
        if (!Memory.rooms[hostRoomName]) {
            return false;
        }
        if (!Game.rooms[hostRoomName]) {
            return false;
        }

        const remoteRooms: RemoteRoomMemory[] = MemoryApi.getRemoteRooms(Game.rooms[hostRoomName]);
        return _.some(remoteRooms, (rr: RemoteRoomMemory) => rr.roomName === dependentRoomName);
    }

    /**
     * verify that the object exists in the game
     * @param id the id we are checking for
     * @returns if the object exists
     */
    public static verifyObjectByID(id: string): boolean {
        return Game.getObjectById(id) !== undefined;
    }
}
