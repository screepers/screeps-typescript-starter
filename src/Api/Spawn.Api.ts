import {
    SpawnHelper,
    domesticRolePriority,
    remoteRolePriority,
    ROLE_COLONIZER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_RESERVER,
    ROLE_LORRY,
    ROLE_HARVESTER,
    ROLE_MEDIC,
    ROLE_MINER,
    ROLE_POWER_UPGRADER,
    ROLE_REMOTE_DEFENDER,
    ROLE_REMOTE_HARVESTER,
    ROLE_DOMESTIC_DEFENDER,
    ROLE_CLAIMER,
    ROLE_STALKER,
    ROLE_WORKER,
    ROLE_ZEALOT,
    GROUPED,
    COLLATED,
    ROOM_STATE_INTRO,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
    ERROR_ERROR,
    ROLE_SCOUT,
    CREEP_BODY_OPT_HELPERS,
    ROOM_STATE_CREEP_LIMITS,
    MemoryHelper_Room,
    RoomHelper,
    MemoryApi,
    UserException,
    EventHelper
} from "utils/internals";

/**
 * The API used by the spawn manager
 */
export class SpawnApi {
    /**
     * set domestic creep limits
     * @param room the room we want limits for
     */
    private static generateDomesticCreepLimits(room: Room): DomesticCreepLimits {
        const roomState: RoomStateConstant = room.memory.roomState as RoomStateConstant;

        // This used to be the big switch statement for each room state
        // It is now seperated into a class per room state
        // This just searches the room states, follow the definition of room_state_creep_limits for the next portion
        // Generate the room state for the specified room state
        for (const index in ROOM_STATE_CREEP_LIMITS) {
            if (ROOM_STATE_CREEP_LIMITS[index].roomState === roomState) {
                return ROOM_STATE_CREEP_LIMITS[index].generateDomesticLimits(room);
            }
        }
        throw new UserException(
            "Failed to generate domestic limits",
            "The room state " + roomState + " doesn't have a implementation. [ " + room.name + " ].",
            ERROR_ERROR
        );
    }

    /**
     * set remote creep limits
     * (we got shooters on deck)
     * @param room the room we want limits for
     */
    private static generateRemoteCreepLimits(room: Room): RemoteCreepLimits {
        const roomState: RoomStateConstant = room.memory.roomState as RoomStateConstant;

        // Generate the room state for the specified room state
        for (const index in ROOM_STATE_CREEP_LIMITS) {
            if (ROOM_STATE_CREEP_LIMITS[index].roomState === roomState) {
                return ROOM_STATE_CREEP_LIMITS[index].generateRemoteLimits(room);
            }
        }
        throw new UserException(
            "Failed to generate domestic limits",
            "The room state " + roomState + " doesn't have a implementation. [ " + room.name + " ].",
            ERROR_ERROR
        );
    }

    /**
     * set military creep queue
     * ! lord this function is a mess upon revisiting
     * @param room the room we want queue for
     */
    private static generateMilitaryCreepQueue(room: Room): void {
        const rolesToAdd: RoleConstant[] = [];

        // Check for Domestic Defenders
        const defconLevel: number = MemoryApi.getDefconLevel(room);
        const isTowers: boolean = RoomHelper.isExistInRoom(room, STRUCTURE_TOWER);
        const limit: number = RoomHelper.getDomesticDefenderLimitByDefcon(defconLevel, isTowers);

        if (
            // Need to not spawn defenders at beginner roomstate
            defconLevel > 3 &&
            !SpawnHelper.isCreepCountSpawnedAndQueueAtLimit(room, ROLE_DOMESTIC_DEFENDER, limit)
        ) {
            rolesToAdd.push(ROLE_DOMESTIC_DEFENDER);
        }

        // Check for Military Creeps
        const attackRoomFlags: AttackFlagMemory[] = MemoryApi.getAllAttackFlagMemoryForHost(room.name);
        for (const attackRoomFlag of attackRoomFlags) {
            if (attackRoomFlag && Memory.flags[attackRoomFlag.flagName]) {
                if (Memory.flags[attackRoomFlag.flagName].spawnProcessed) {
                    continue;
                }
                const attackingRoles: RoleConstant[] = SpawnHelper.getRolesArrayFromAttackFlag(attackRoomFlag);
                for (const role of attackingRoles) {
                    rolesToAdd.push(role);
                }

                // Set the flag as processed, so it's only added to the queue once
                if (Memory.flags[attackRoomFlag.flagName] !== undefined) {
                    Memory.flags[attackRoomFlag.flagName].spawnProcessed = true;
                }
            }
        }

        // Add the constructed queue to the military queue
        if (!room.memory.creepLimit!.militaryLimits) {
            room.memory.creepLimit!.militaryLimits = [];
        }
        for (const role of rolesToAdd) {
            room.memory.creepLimit!.militaryLimits.push(role);
        }
    }

    /**
     * set creep limits for the room
     * @param room the room we are setting limits for
     */
    public static setCreepLimits(room: Room): void {
        // Ensure creep limits are set
        if (!room.memory.creepLimit) {
            MemoryApi.initCreepLimits(room);
        }

        // Set Domestic Limits to Memory
        MemoryHelper_Room.updateDomesticLimits(room, this.generateDomesticCreepLimits(room));

        // Set Remote Limits to Memory
        MemoryHelper_Room.updateRemoteLimits(room, this.generateRemoteCreepLimits(room));

        // Create the Military Queue
        this.generateMilitaryCreepQueue(room);
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): any {
        // Get all openSpawns, and return the first
        const openSpawns = MemoryApi.getStructureOfType(
            room.name,
            STRUCTURE_SPAWN,
            (spawn: StructureSpawn) => !spawn.spawning
        );

        if (openSpawns.length === 0) {
            return null;
        }

        return _.first(openSpawns);
    }

    /**
     * get next creep to spawn
     * @param room the room we want to spawn them in
     */
    public static getNextCreep(room: Room): RoleConstant | null {
        // Get Limits for each creep department
        const creepLimits: CreepLimits = MemoryApi.getCreepLimits(room);
        let militaryRole: RoleConstant | null;
        const creepCount: AllCreepCount = MemoryApi.getAllCreepCount(room);

        // Check for a priority harvester
        if (SpawnHelper.needPriorityHarvester(room)) {
            return ROLE_HARVESTER;
        }

        // Spawn High Priority military
        militaryRole = SpawnHelper.spawnMiliQueue(1, room);
        if (militaryRole !== null) {
            return militaryRole;
        }
        // Check if we need a domestic creep -- Return role if one is found
        for (const role of domesticRolePriority) {
            if (creepCount[role] < creepLimits.domesticLimits[role]) {
                return role;
            }
        }

        // Spawn Mid Priority military creeps
        militaryRole = SpawnHelper.spawnMiliQueue(2, room);
        if (militaryRole !== null) {
            return militaryRole;
        }
        // Check if we need a remote creep -- Return role if one is found
        for (const role of remoteRolePriority) {
            if (creepCount[role] < creepLimits.remoteLimits[role]) {
                return role;
            }
        }

        // Spawn Low Priority military creeps
        militaryRole = SpawnHelper.spawnMiliQueue(3, room);

        // Return null if we don't need to spawn anything
        return militaryRole;
    }

    /**
     * spawn the next creep
     * @param room the room we want to spawn them in
     * @param body BodyPartConstant[] the body array of the creep
     * @param creepOptions creep options we want to give to it
     * @param role RoleConstant the role of the creep
     * @param spawn spawn we are going to use to spawn the creep
     * @param name the name of the creep
     */
    public static spawnNextCreep(
        room: Room,
        body: BodyPartConstant[],
        creepOptions: CreepOptionsCiv | CreepOptionsMili,
        role: RoleConstant,
        spawn: StructureSpawn,
        homeRoom: string,
        targetRoom: string,
        name: string
    ): number {
        // Throw error if we don't have enough energy to spawn this creep
        if (this.getEnergyCostOfBody(body) > room.energyAvailable) {
            throw new UserException(
                "Creep failed to spawn.",
                'The role "' + role + '" was unable to spawn in room "' + room.name + '": Not enough energy .',
                ERROR_WARN
            );
        }

        const creepMemory = SpawnHelper.generateDefaultCreepMemory(role, homeRoom, targetRoom, creepOptions);
        return spawn.spawnCreep(body, name, { memory: creepMemory });
    }

    /**
     * get energy cost of creep body
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    public static getEnergyCostOfBody(body: BodyPartConstant[]): number {
        // Create the object with the costs of each body part
        let totalCost = 0;
        const bodyPartCost: StringMap = {
            work: 100,
            carry: 50,
            move: 50,
            attack: 80,
            ranged_attack: 150,
            heal: 250,
            claim: 600,
            tough: 10
        };

        // Loop over the creep body array summing the total cost of the body parts
        for (let i = 0; i < body.length; ++i) {
            const currBodyPart = body[i];
            totalCost += bodyPartCost[currBodyPart];
        }

        return totalCost;
    }

    /**
     * check what tier of this creep we are spawning
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     */
    public static getTier(room: Room, roleConst: RoleConstant | null): TierConstant {
        const energyAvailable: number = room.energyCapacityAvailable;

        // Check what tier we are in based on the amount of energy the room has
        if (room.memory.roomState === ROOM_STATE_INTRO) {
            return TIER_1;
        }
        if (energyAvailable === TIER_8) {
            return TIER_8;
        }

        if (energyAvailable >= TIER_7) {
            return TIER_7;
        }

        if (energyAvailable >= TIER_6) {
            return TIER_6;
        }

        if (energyAvailable >= TIER_5) {
            return TIER_5;
        }

        if (energyAvailable >= TIER_4) {
            return TIER_4;
        }

        if (energyAvailable >= TIER_3) {
            return TIER_3;
        }

        if (energyAvailable >= TIER_2) {
            return TIER_2;
        }

        // If we make it here, we are simply tier 1
        return TIER_1;
    }

    /**
     * get the memory options for this creep
     * @param room the room we are spawning it in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    public static generateCreepOptions(
        role: RoleConstant | null,
        roomState: RoomStateConstant,
        squadMemory: StringMap
    ): CreepOptionsCiv | CreepOptionsMili | undefined {
        // Set default values if military options aren't provided
        // If one of these aren't provided, then the entire purpose of them is nix,
        // So we just check if any of them aren't provided and set defaults for all in that case
        let squadSize: number = squadMemory["squadSize"];
        let squadUUID: number | null = squadMemory["squadUUID"];
        let rallyLocation: RoomPosition | null = squadMemory["rallyLocation"];
        if (!squadSize || !squadUUID || !rallyLocation) {
            squadSize = 0;
            squadUUID = null;
            rallyLocation = null;
        }

        // If no role provided, throw warning
        if (!role) {
            throw new UserException("Null role provided to generate creep options", "Api/SpawnApi", ERROR_ERROR);
        }

        // Call the appropriate class to generate the creep options for the specified role
        for (const index in CREEP_BODY_OPT_HELPERS) {
            if (CREEP_BODY_OPT_HELPERS[index].name === role) {
                return CREEP_BODY_OPT_HELPERS[index].generateCreepOptions(
                    roomState,
                    squadSize,
                    squadUUID,
                    rallyLocation
                );
            }
        }
        throw new UserException(
            "Couldn't find ICreepBodyOptsHelper implementation for the role",
            "role: " + role + "\nCreep Options",
            ERROR_ERROR
        );
    }

    /**
     * Generate the body for the creep based on the tier and role
     * @param tier the tier our room is at
     * @param role the role of the creep we want
     */
    public static generateCreepBody(tier: TierConstant, role: RoleConstant | null): BodyPartConstant[] {
        if (!role) {
            throw new UserException("Null role provided to generate creep options", "Api/SpawnApi", ERROR_ERROR);
        }
        for (const index in CREEP_BODY_OPT_HELPERS) {
            if (CREEP_BODY_OPT_HELPERS[index].name === role) {
                return CREEP_BODY_OPT_HELPERS[index].generateCreepBody(tier);
            }
        }
        throw new UserException(
            "Couldn't find ICreepBodyOptsHelper implementation for the role",
            "role: " + role + "\nCreep Options",
            ERROR_ERROR
        );
    }

    /**
     * Returns a creep body part array, or null if invalid parameters were passed in
     * @param bodyObject The object that describes the creep's body parts
     * @param opts The options for generating the creep body from the descriptor
     */
    public static createCreepBody(bodyObject: CreepBodyDescriptor, opts?: CreepBodyOptions): BodyPartConstant[] {
        let creepBody: BodyPartConstant[] = [];
        let numHealParts = 0;

        /**
         * If opts is undefined, use default options
         */
        if (opts === undefined) {
            opts = { mixType: GROUPED, toughFirst: false, healLast: false };
        }

        /**
         * Verify bodyObject - Return null if invalid
         */
        if (SpawnHelper.verifyDescriptor(bodyObject) === false) {
            throw new UserException(
                "Invalid Creep Body Descriptor",
                "Ensure that the object being passed to getCreepBody is in the format { BodyPartConstant: NumberParts } and that NumberParts is > 0.",
                ERROR_ERROR
            );
        }

        /**
         * Append tough parts on creepBody first - Delete tough property from bodyObject
         */
        if (opts.toughFirst && bodyObject.tough) {
            creepBody = SpawnHelper.generateParts("tough", bodyObject.tough);
            delete bodyObject.tough;
        }

        /**
         * Retain Heal Information to append on the end of creepBody - Delete heal property from bodyObject
         */
        if (opts.healLast && bodyObject.heal) {
            numHealParts = bodyObject.heal;
            delete bodyObject.heal;
        }

        /**
         * If mixType is grouped, add onto creepBody
         */
        if (opts.mixType === GROUPED) {
            const bodyParts = SpawnHelper.getBody_Grouped(bodyObject);
            for (let i = 0; i < bodyParts.length; i++) {
                creepBody.push(bodyParts[i]);
            }
        }

        /**
         * If mixType is collated, add onto creepBody
         */
        if (opts.mixType === COLLATED) {
            const bodyParts = SpawnHelper.getBody_Collated(bodyObject);
            for (let i = 0; i < bodyParts.length; i++) {
                creepBody.push(bodyParts[i]);
            }
        }

        /**
         * Append Heal Information that was retained at the beginning of the function
         */
        if (opts.healLast) {
            for (let i = 0; i < numHealParts; i++) {
                creepBody.push("heal");
            }
        }

        // If creepBody is empty, return undefined
        if (creepBody.length === 0) {
            return [];
        } else {
            return creepBody;
        }
    }

    /**
     * generates a UUID for a squad
     */
    public static generateSquadUUID(seed?: number) {
        return Math.random() * 10000000;
    }

    /**
     * generates options for spawning a squad based on the attack room's specifications
     * @param room the room we are spawning the squad in
     * @param roleConst the role we are checking for
     * @param creepName the name of the creep we are checking for
     */
    public static generateSquadOptions(room: Room, roleConst: RoleConstant, creepName: string): StringMap {
        // Set to this for clarity that we aren't expecting any squad options in some cases
        const squadOptions: StringMap = {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null
        };

        // Don't actually get anything of value if it isn't a military creep
        if (!SpawnHelper.isMilitaryRole(roleConst)) {
            return squadOptions;
        }

        const selectedFlagMemory: AttackFlagMemory | undefined = EventHelper.getMiliRequestingFlag(
            room,
            roleConst,
            creepName
        );
        // If we didn't find a squad based flag return the default squad options
        if (!selectedFlagMemory) {
            return squadOptions;
        } else {
            // Set squad options to the flags memory and return it
            squadOptions.squadSize = selectedFlagMemory.squadSize;
            squadOptions.squadUUID = selectedFlagMemory.squadUUID;
            squadOptions.rallyLocation = selectedFlagMemory.rallyLocation;
            return squadOptions;
        }
    }

    /**
     * get the target room for the creep
     * @param room the room we are spawning the creep in
     * @param roleConst the role we are getting room for
     * @param creepBody the body of the creep we are checking, so we know who to exclude from creep counts
     * @param creepName the name of the creep we are checking for
     */
    public static getCreepTargetRoom(
        room: Room,
        roleConst: RoleConstant,
        creepBody: BodyPartConstant[],
        creepName: string
    ): string {
        for (const index in CREEP_BODY_OPT_HELPERS) {
            if (CREEP_BODY_OPT_HELPERS[index].name === roleConst) {
                return CREEP_BODY_OPT_HELPERS[index].getTargetRoom(room, roleConst, creepBody, creepName);
            }
        }
        throw new UserException(
            "Couldn't find ICreepBodyOptsHelper implementation for the role",
            "role: " + roleConst + "\nCreep Target Room",
            ERROR_ERROR
        );
    }

    /**
     * get the home room for the creep
     * @param room the room the creep is spawning in
     * @param roleConst the role we are getting room for
     */
    public static getCreepHomeRoom(room: Room, roleConst: RoleConstant): string {
        for (const index in CREEP_BODY_OPT_HELPERS) {
            if (CREEP_BODY_OPT_HELPERS[index].name === roleConst) {
                return CREEP_BODY_OPT_HELPERS[index].getHomeRoom(room);
            }
        }
        throw new UserException(
            "Couldn't find ICreepBodyOptsHelper implementation for the role",
            "role: " + roleConst + "\nCreep HomeRoom",
            ERROR_ERROR
        );
    }

    /**
     * remove the spawned military creep from the military spawn queue
     * @param nextCreepRole the role we are trying to remove
     * @param room the room we are doing this for
     */
    public static removeSpawnedCreepFromMiliQueue(nextCreepRole: RoleConstant, room: Room): void {
        if (SpawnHelper.isMilitaryRole(nextCreepRole)) {
            for (let i = 0; i < room.memory.creepLimit!.militaryLimits.length; ++i) {
                if (room.memory.creepLimit!.militaryLimits[i] === nextCreepRole) {
                    room.memory.creepLimit!.militaryLimits.splice(i, 1);
                    break;
                }
            }
        }
    }
}
