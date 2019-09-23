import {
    ROLE_COLONIZER,
    ROLE_HARVESTER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_HARVESTER,
    ROLE_CLAIMER,
    ERROR_WARN,
    STALKER_SOLO,
    ZEALOT_SOLO,
    STANDARD_SQUAD,
    UserException,
    MemoryApi,
    RoomHelper,
    ZEALOT_SOLO_ARRAY,
    STANDARD_SQUAD_ARRAY,
    STALKER_SOLO_ARRAY,
    TIER_1_MILITARY_PRIORITY,
    TIER_2_MILITARY_PRIORITY,
    TIER_3_MILITARY_PRIORITY,
    ALL_MILITARY_ROLES,
    ALL_DEFENSIVE_ROLES,
    RESERVER_MIN_TTL
} from "utils/internals";

/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    /**
     * Returns a boolean indicating if the object is a valid creepBody descriptor
     * @param bodyObject The description of the creep body to verify
     */
    public static verifyDescriptor(bodyObject: CreepBodyDescriptor): boolean {
        const partNames = Object.keys(bodyObject);
        let valid: boolean = true;
        // Check that no body parts have a definition of 0 or negative
        for (const part in partNames) {
            if (bodyObject[part] <= 0) {
                valid = false;
            }
            if (!(part in BODYPARTS_ALL)) {
                valid = false;
            }
        }
        return valid;
    }

    /**
     * Helper function - Returns an array containing @numParts of @part
     * @part The part to create
     * @numParts The number of parts to create
     */
    public static generateParts(part: BodyPartConstant, numParts: number): BodyPartConstant[] {
        const returnArray: BodyPartConstant[] = [];
        for (let i = 0; i < numParts; i++) {
            returnArray.push(part);
        }
        return returnArray;
    }

    /**
     * Groups the body parts -- e.g. WORK, WORK, CARRY, CARRY, MOVE, MOVE
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Grouped(descriptor: CreepBodyDescriptor): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        _.forEach(Object.keys(descriptor), (part: BodyPartConstant) => {
            // Having ! after property removes 'null' and 'undefined'
            for (let i = 0; i < descriptor[part]!; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }

    /**
     * Collates the body parts -- e.g. WORK, CARRY, MOVE, WORK, CARRY, ...
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Collated(descriptor: CreepBodyDescriptor): BodyPartConstant[] {
        const returnParts: BodyPartConstant[] = [];
        const numParts: number = _.sum(_.values(descriptor));
        const partNames = <BodyPartConstant[]>Object.keys(descriptor);

        let i = 0;
        while (i < numParts) {
            for (let j = 0; j < partNames.length; j++) {
                const currPart: BodyPartConstant = partNames[j];
                if (descriptor[currPart]! >= 1) {
                    returnParts.push(currPart);
                    descriptor[currPart]!--;
                    i++;
                }
            }
        }
        return returnParts;
    }

    /**
     * Generates a creep name in the format role_tier_uniqueID
     * @param role The role of the creep being generated
     * @param tier The tier of the creep being generated
     */
    public static generateCreepName(role: RoleConstant, tier: TierConstant, room: Room): string {
        const modifier: string = Game.time.toString().slice(-4);
        const name = role + "_" + tier + "_" + room.name + "_" + modifier + "_" + Math.random() * 99;
        return name;
    }

    /**
     * returns a set of creep options with all default values
     */
    public static getDefaultCreepOptionsCiv(): CreepOptionsCiv {
        return {};
    }

    /**
     * returns set of mili creep options with all default values
     */
    public static getDefaultCreepOptionsMili(): CreepOptionsMili {
        return {
            squadSize: 0
        };
    }

    /**
     * generates a creep memory to give to a creep being spawned
     */
    public static generateDefaultCreepMemory(
        roleConst: RoleConstant,
        homeRoomNameParam: string,
        targetRoomParam: string,
        creepOptions: CreepOptionsCiv | CreepOptionsMili
    ): CreepMemory {
        return {
            role: roleConst,
            homeRoom: homeRoomNameParam,
            targetRoom: targetRoomParam,
            job: undefined,
            options: creepOptions,
            working: false
        };
    }

    /**
     * get number of active squad members for a given squad
     * @param flagMemory the attack flag memory
     * @param room the room they are coming from
     */
    public static getNumOfActiveSquadMembers(flagMemory: AttackFlagMemory, room: Room): number {
        // Please improve this if possible lol. Had to get around type guards as we don't actually know what a creeps memory has in it unless we explicitly know the type i think
        // We're going to run into this everytime we use creep memory so we need to find a nicer way around it if possible but if not casting it as a memory type
        // Isn't the worst solution in the world
        const militaryCreeps: Array<Creep | null> = MemoryApi.getMyCreeps(room.name, creep =>
            this.isMilitaryRole(creep.memory.role)
        );
        return _.filter(militaryCreeps, creep => {
            const creepOptions = creep!.memory.options as CreepOptionsMili;
            return creepOptions.squadUUID === flagMemory.squadUUID;
        }).length;
    }

    /**
     * get if the creep is a military type creep or not
     * @param roleConst the role of the creep
     */
    public static isMilitaryRole(roleConst: RoleConstant): boolean {
        for (const role in ALL_MILITARY_ROLES) {
            if (roleConst === ALL_MILITARY_ROLES[role]) {
                return true;
            }
        }
        return false;
    }

    /**
     * check if the creep is a defenive military creep
     * @param creepRole the creep we are checking
     */
    public static isDefenseCreep(creepRole: RoleConstant): boolean {
        return ALL_DEFENSIVE_ROLES.includes(creepRole);
    }

    /**
     * gets the ClaimRoomMemory with lowest number creeps of the specified role with it as their target room
     * Must also be less than the max amount of that role allowed for the room
     * @param room the room spawning the creep
     * @param roleConst the specified role we are checking for
     * @param creepBody the body of the creep we are checking, so we know who to exclude from creep count
     */
    public static getLowestNumRoleAssignedClaimRoom(
        room: Room,
        roleConst: RoleConstant,
        creepBody: BodyPartConstant[]
    ): ClaimRoomMemory | undefined {
        const allClaimRooms: Array<ClaimRoomMemory | undefined> = MemoryApi.getClaimRooms(room);
        const tickLimit: number = creepBody.length * 3;
        // Get all claim rooms in which the specified role does not yet have
        const unfulfilledClaimRooms: Array<ClaimRoomMemory | undefined> = _.filter(
            allClaimRooms,
            claimRoom =>
                this.getNumCreepAssignedAsTargetRoom(room, roleConst, claimRoom, tickLimit) <
                this.getLimitPerClaimRoomForRole(roleConst)
        );

        let nextClaimRoom: ClaimRoomMemory | undefined;

        // Find the unfulfilled with the lowest amount of creeps assigned to it
        for (const claimRoom of unfulfilledClaimRooms) {
            if (!nextClaimRoom) {
                nextClaimRoom = claimRoom;
                continue;
            }

            const lowestCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(
                room,
                roleConst,
                nextClaimRoom,
                tickLimit
            );
            const currentCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, claimRoom, tickLimit);

            if (currentCreepsAssigned < lowestCreepsAssigned) {
                nextClaimRoom = claimRoom;
            }
        }

        return nextClaimRoom;
    }

    /**
     * gets the RemoteRoomMemory with lowest number creeps of the specified role with it as their target room
     * @param room the room spawning the creep
     * @param roleConst the specified role we are checking for
     * @param creepBody the creep body so we know what creeps to exclude from rolecall
     */
    public static getLowestNumRoleAssignedRemoteRoom(
        room: Room,
        roleConst: RoleConstant,
        creepBody: BodyPartConstant[]
    ): RemoteRoomMemory | undefined {
        const allRemoteRooms: Array<RemoteRoomMemory | undefined> = MemoryApi.getRemoteRooms(room);
        const tickLimit = creepBody.length * 3;
        // Get all claim rooms in which the specified role does not yet have
        const unfulfilledRemoteRooms: Array<RemoteRoomMemory | undefined> = _.filter(allRemoteRooms, remoteRoom => {
            const numSources: number =
                !Memory.rooms[remoteRoom!.roomName] || !Memory.rooms[remoteRoom!.roomName].sources.data
                    ? 1
                    : Memory.rooms[remoteRoom!.roomName].sources.data.length;
            return (
                this.getNumCreepAssignedAsTargetRoom(room, roleConst, remoteRoom, tickLimit) <
                this.getLimitPerRemoteRoomForRolePerSource(roleConst, numSources)
            );
        });

        let nextRemoteRoom: RemoteRoomMemory | undefined;
        let lowestCreepsAssigned = Number.MAX_VALUE;
        // Find the unfulfilled with the lowest amount of creeps assigned to it
        for (const remoteRoom of unfulfilledRemoteRooms) {
            if (remoteRoom && !nextRemoteRoom) {
                nextRemoteRoom = remoteRoom;
                continue;
            }

            const currentCreepsAssigned = this.getNumCreepAssignedAsTargetRoom(room, roleConst, remoteRoom, tickLimit);

            if (currentCreepsAssigned < lowestCreepsAssigned) {
                nextRemoteRoom = remoteRoom;
                lowestCreepsAssigned = currentCreepsAssigned;
            }
        }

        return nextRemoteRoom;
    }

    /**
     * get number of creeps of role with target room assigned to a specified room
     * @param room the room spawning the creep
     * @param roleConst the role of the creep
     * @param roomMemory the room memory we are checking
     * @param ticksToLiveLimit the limit in ticks that the new creep will be spawned in the old creeps place
     */
    public static getNumCreepAssignedAsTargetRoom(
        room: Room,
        roleConst: RoleConstant,
        roomMemory: ClaimRoomMemory | AttackRoomMemory | RemoteRoomMemory | undefined,
        ticksToLiveLimit: number
    ): number {
        // Get all creeps above the ticks to live limit with the specified role
        const allCreepsOfRole: Array<Creep | null> = MemoryApi.getMyCreeps(
            room.name,
            creep =>
                creep.memory.role === roleConst && (creep.ticksToLive ? creep.ticksToLive : 1600) > ticksToLiveLimit
            // Find the creep w/ ticks to live higher than the limit (1600 if no ticks to live ie a spawning creep to ensure they're counted)
        );
        let sum = 0;

        for (const creep of allCreepsOfRole) {
            if (creep!.memory.targetRoom === roomMemory!.roomName) {
                ++sum;
            }
        }

        return sum;
    }

    /**
     * gets the number of each claim room creep that is meant to be assigned to a room
     * @param roleConst the role we are checking the limit for
     */
    public static getLimitPerClaimRoomForRole(roleConst: RoleConstant): number {
        let creepNum: number = 0;

        switch (roleConst) {
            case ROLE_CLAIMER || ROLE_COLONIZER:
                creepNum = 1;
                break;
        }

        return creepNum;
    }

    /**
     * gets the number of each remote room creep that is meant to be assigned to a room
     * @param roleConst the role we are checking the limit for
     * @param numSources the number of sources in the remote room
     */
    public static getLimitPerRemoteRoomForRolePerSource(roleConst: RoleConstant, numSources: number): number {
        let creepNum: number = 0;

        switch (roleConst) {
            case ROLE_REMOTE_HARVESTER:
                creepNum = Math.ceil(1.5 * numSources);
                break;
            case ROLE_REMOTE_MINER:
                creepNum = 1 * numSources;
                break;
        }

        return creepNum;
    }

    /**
     * gets the number of lorries for the room based on room state
     * @param room the room we are doing limits for
     * @param roomState the room state of the room we are checking limit for
     */
    public static getLorryLimitForRoom(room: Room, roomState: RoomStateConstant) {
        // ! Some ideas for finding lorry limits for a room
        // ! Turned in to insane ramblings though
        /*
            Potentially, we could check that the room state is within a certain value range
            like advanced, stimulate, seige, maybe? (same values its changed on anyway, so just extra saftey)
            And we could like check if any empire jobs exist... still not sure the route we're going to take
            to make sure terminals and labs get filled exactly, but we do know that those will create room jobs
            for creeps to follow, we could also have it fill another memory structure and we check that and
            decide how many lorries we need to do this set of jobs, it also has the benifit of slowly going down
            as the job is more and more complete ie if we spawn 1 lorry per 25k energy we want to move to a terminal,
            then as the amount of energy needing to be moved remaining goes down, naturally the number of lorries needed
            will as well.

            I'm having a flash of an idea about empire job queues. Each room can check empire job queues and decide if they
            need to create any jobs in the room, and this function for example will check how many lorries need to exist in the room
            etc, etc, etc. We can see what way we wanna go there, we still are a little bit off from that since we need to finish
            the more pertinant parts of job queues and set up the flag system and make sure the room structures run themselves (thats
                when we actually start running into it, since terminals will presumably check this emprie job queue and decide if it needs
                to sell energy, move to another room)

            It would also be interesting to set up a system to supply each other with energy as needed. Like if you're being seiged and in real trouble
            and you're running dry (lets say they've knocked out a couple of your other rooms too) i could send energy and help keep your
            last room alive... possibly military support to would be really cool (that would be as simple as detecting and auto placing a flag
                in your room and the system will handle itself)

            Even more off-topic, but we make sure creep.attack() and tower.attack() is never called on an ally creep (maybe even override the functions)
            (to ensure extra saftey in the case of abug)
        */
        return 0;
    }

    /**
     * get the number of accesssible tiles for the sources in a room
     * @param room the room we are checking for
     */
    public static getNumAccessTilesToSources(room: Room): number {
        const sources: Source[] = MemoryApi.getSources(room.name);
        let accessibleTiles: number = 0;
        const roomTerrain: RoomTerrain = new Room.Terrain(room.name);
        _.forEach(sources, (source: Source) => {
            accessibleTiles += RoomHelper.getNumAccessTilesForTarget(source);
        });
        return accessibleTiles;
    }

    /**
     * get the array of roles based on the attack flag type
     * @param attackFlag the flag memory of the attack flag
     */
    public static getRolesArrayFromAttackFlag(attackFlag: ParentFlagMemory): RoleConstant[] {
        // check the flag type and return the array
        switch (attackFlag.flagType) {
            case ZEALOT_SOLO:
                return ZEALOT_SOLO_ARRAY;

            case STANDARD_SQUAD:
                return STANDARD_SQUAD_ARRAY;

            case STALKER_SOLO:
                return STALKER_SOLO_ARRAY;
        }
        return [];
    }

    /**
     * check if the creep role exists in the room's queue
     * @param room the room we are checking for
     * @param roleConst the role we are checking for
     * @param limit the limit we are checking for
     */
    public static isCreepCountSpawnedAndQueueAtLimit(room: Room, roleConst: RoleConstant, limit: number): boolean {
        const roleArray: RoleConstant[] = room.memory.creepLimit!["militaryLimits"];
        const creepsInRoom: Creep[] = MemoryApi.getMyCreeps(room.name, (c: Creep) => c.memory.role === roleConst);
        let sum = 0;

        // Get all the defenders in queue to be spawned
        for (const role in roleArray) {
            if (roleArray[role] === roleConst) {
                sum++;
            }
        }

        // Get all defenders currently spawned
        sum += creepsInRoom.length;
        return sum >= limit;
    }

    /**
     * spawn the next creep in the military queue for that tier
     * @param tier the priority tier of the military creep we are attempting to spawn
     * @param room the room we are spawning for
     */
    public static spawnMiliQueue(tier: number, room: Room): RoleConstant | null {
        // Look for the correspondings tier's within the military queue for the room, return it if we find one
        const militaryQueue: RoleConstant[] = room.memory.creepLimit!.militaryLimits;
        switch (tier) {
            case 1:
                for (const queueRole in militaryQueue) {
                    for (const tierRole of TIER_1_MILITARY_PRIORITY) {
                        if (militaryQueue[queueRole] === tierRole) {
                            return militaryQueue[queueRole];
                        }
                    }
                }
                return null;
            case 2:
                for (const queueRole in militaryQueue) {
                    for (const tierRole of TIER_2_MILITARY_PRIORITY) {
                        if (militaryQueue[queueRole] === tierRole) {
                            return militaryQueue[queueRole];
                        }
                    }
                }
                return null;
            case 3:
                for (const queueRole in militaryQueue) {
                    for (const tierRole of TIER_3_MILITARY_PRIORITY) {
                        if (militaryQueue[queueRole] === tierRole) {
                            return militaryQueue[queueRole];
                        }
                    }
                }
                return null;
            default:
                throw new UserException("Invalid tier number", "spawnHelper/spawnMiliQueue", ERROR_WARN);
        }
    }

    /**
     * get the number of remote rooms that need a reserver
     * @param room the room we are checking the remote rooms for
     */
    public static getRemoteReserverLimitForRoom(room: Room): number {
        const remoteRooms: Array<RemoteRoomMemory | undefined> = MemoryApi.getRemoteRooms(room);
        let numReserversNeeded: number = 0;
        for (const remoteRoom of remoteRooms) {
            // Handle undefined rooms
            if (!remoteRoom) {
                continue;
            }

            // If the TTL is below the limit set in config, we need a reserver
            if (remoteRoom.reserveTTL <= RESERVER_MIN_TTL) {
                numReserversNeeded++;
            }
        }

        return numReserversNeeded;
    }

    /**
     * get a remote room that needs a remote reserver
     */
    public static getRemoteRoomNeedingRemoteReserver(room: Room): RemoteRoomMemory | undefined {
        return _.first(MemoryApi.getRemoteRooms(room, (rr: RemoteRoomMemory) => rr.reserveTTL < RESERVER_MIN_TTL));
    }

    /**
     * get a remote room that needs a remote reserver
     */
    public static getRemoteRoomNeedingRemoteDefender(room: Room): RemoteRoomMemory | undefined {
        return _.first(
            MemoryApi.getRemoteRooms(room, (rr: RemoteRoomMemory) => {
                if (Memory.rooms[rr.roomName]) {
                    return Memory.rooms[rr.roomName].defcon > 1;
                }
                return false;
            })
        );
    }

    /**
     * check if we need a harvester as the highest priority
     * @param room the room we are in
     * @returns boolean that represents if we need a harvester as priority
     */
    public static needPriorityHarvester(room: Room): boolean {
        if (
            room.memory.creepLimit !== undefined &&
            room.memory.creepLimit.domesticLimits !== undefined &&
            room.memory.creepLimit.domesticLimits.harvester === 1
        ) {
            const harvester: Creep | undefined = _.find(
                MemoryApi.getMyCreeps(room.name, (c: Creep) => c.memory.role === ROLE_HARVESTER)
            );

            // If theres no harvester then we def need one
            if (!harvester) {
                return true;
            }
            return harvester.ticksToLive !== undefined && harvester.ticksToLive <= harvester.body.length * 3;
        }
        return false;
    }
}
