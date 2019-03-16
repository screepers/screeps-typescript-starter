import { SpawnHelper } from "Helpers/SpawnHelper";
import UtilHelper from "Helpers/UtilHelper";
import {
    domesticRolePriority,
    militaryRolePriority,
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
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_SEIGE,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
    STANDARD_SQUAD,
    ZEALOT_SOLO,
    STALKER_SOLO
} from "utils/Constants";
import MemoryHelperRoom from "../Helpers/MemoryHelper_Room";
import RoomHelper from "../Helpers/RoomHelper";
import RoomApi from "./Room.Api";
import MemoryApi from "./Memory.Api";
import MemoryHelper from "Helpers/MemoryHelper";
import UserException from "utils/UserException";
import EmpireApi from "./Empire.Api";

/**
 * The API used by the spawn manager
 */
export default class SpawnApi {
    /**
     * set domestic creep limits
     * @param room the room we want limits for
     */
    public static generateDomesticCreepLimits(room: Room): DomesticCreepLimits {
        const domesticLimits: DomesticCreepLimits = {
            miner: 0,
            harvester: 0,
            worker: 0,
            powerUpgrader: 0,
            lorry: 0
        };

        const numLorries = SpawnHelper.getLorryLimitForRoom(room, room.memory.roomState);

        // check what room state we are in
        switch (room.memory.roomState) {
            // Intro
            case ROOM_STATE_INTRO:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 1;
                domesticLimits[ROLE_HARVESTER] = 1;
                domesticLimits[ROLE_WORKER] = 1;

                break;

            // Beginner
            case ROOM_STATE_BEGINNER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 4;
                domesticLimits[ROLE_HARVESTER] = 4;
                domesticLimits[ROLE_WORKER] = 4;

                break;

            // Intermediate
            case ROOM_STATE_INTER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 5;

                break;

            // Advanced
            case ROOM_STATE_ADVANCED:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 4;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = numLorries;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 1;
                domesticLimits[ROLE_LORRY] = numLorries;

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 3;
                domesticLimits[ROLE_POWER_UPGRADER] = 2;
                domesticLimits[ROLE_LORRY] = numLorries;

                break;

            // Seige
            case ROOM_STATE_SEIGE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_LORRY] = numLorries;

                break;
        }

        // Return the limits
        return domesticLimits;
    }

    /**
     * set remote creep limits
     * (we got shooters on deck)
     * @param room the room we want limits for
     */
    public static generateRemoteCreepLimits(room: Room): RemoteCreepLimits {
        const remoteLimits: RemoteCreepLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0,
            claimer: 0
        };

        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const numClaimRooms: number = RoomHelper.numClaimRooms(room);

        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0 && numClaimRooms <= 0) {
            return remoteLimits;
        }

        // Gather the rest of the data only if we have a remote room or a claim room
        const numRemoteDefenders: number = RoomHelper.numRemoteDefenders(room);
        const numRemoteSources: number = RoomHelper.numRemoteSources(room);
        const numCurrentlyUnclaimedClaimRooms: number = RoomHelper.numCurrentlyUnclaimedClaimRooms(room);

        // check what room state we are in
        switch (room.memory.roomState) {
            // Advanced, Upgrader, and Stimulate are the only allowed states for remote mining and claiming operations currently
            // Might change for earlier room states to allow claimers and colonizers, up for debate
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(
                    ROLE_REMOTE_MINER,
                    numRemoteSources
                );
                remoteLimits[ROLE_REMOTE_HARVESTER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(
                    ROLE_REMOTE_HARVESTER,
                    numRemoteSources
                );
                remoteLimits[ROLE_REMOTE_RESERVER] =
                    numRemoteRooms * SpawnHelper.getLimitPerRemoteRoomForRolePerSource(ROLE_REMOTE_RESERVER, 1);
                remoteLimits[ROLE_COLONIZER] = numClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_CLAIMER);
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
                remoteLimits[ROLE_CLAIMER] =
                    numCurrentlyUnclaimedClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_CLAIMER);

                break;
        }

        return remoteLimits;
    }

    /**
     * set military creep limits
     * @param room the room we want limits for
     */
    public static generateMilitaryCreepLimits(room: Room): MilitaryCreepLimits {
        const militaryLimits: MilitaryCreepLimits = {
            zealot: 0,
            stalker: 0,
            medic: 0,
            domesticDefender: 0
        };

        // Get the active flag associated with this room (should only be one active attack flag, so finding first one is extra saftey)
        const targetRoomMemoryArray: Array<AttackRoomMemory | undefined> = MemoryApi.getAttackRooms(room);
        let activeAttackRoomFlag: ParentFlagMemory | undefined;
        for (const attackRoom of targetRoomMemoryArray) {
            if (!attackRoom) {
                continue;
            }
            activeAttackRoomFlag = _.find(attackRoom!["flags"], flagMem => {
                if (!flagMem) {
                    return false;
                }
                return flagMem.active;
            });
            if (activeAttackRoomFlag) {
                break;
            }
        }

        // Riase the miltary limits according to the active attack room flag
        this.raiseMilitaryCreepLimits(activeAttackRoomFlag as AttackFlagMemory, room);

        // Check if we need domestic defenders and adjust accordingly
        const defcon: number = MemoryApi.getDefconLevel(room);
        if (defcon >= 2) {
            this.raiseDomesticDefenderCreepLimits(room, defcon);
        }

        return militaryLimits;
    }

    /**
     * raises the military creep limits based on the flag type
     * @param flagMemory the memory associated with the attack flag
     * @param room the room we are raising limits for
     */
    public static raiseMilitaryCreepLimits(flagMemory: AttackFlagMemory | undefined, room: Room): void {
        // If flag memory is undefined, don't waste cpu
        if (!flagMemory) {
            return;
        }

        switch (flagMemory!.flagType) {
            case ZEALOT_SOLO:
                MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", "zealot", 1);

                break;

            case STALKER_SOLO:
                MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", "stalker", 1);

                break;

            case STANDARD_SQUAD:
                MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", "zealot", 1);
                MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", "stalker", 1);
                MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", "medic", 1);

                break;
        }
    }

    /**
     * raises the domestic defender limit based on the defcon state of the room
     * @param room the room we are in
     * @param defcon the defcon of said room
     */
    public static raiseDomesticDefenderCreepLimits(room: Room, defcon: number): void {
        // For now, just raise by one, later we can decide what certain defcons means for what we want to spawn
        // just wanted it in a function so we have the foundation for that in place
        MemoryApi.adjustCreepLimitByDelta(room, "militaryLimits", ROLE_DOMESTIC_DEFENDER, 1);
    }

    /**
     * set creep limits for the room
     * @param room the room we are setting limits for
     */
    public static setCreepLimits(room: Room): void {
        // Set Domestic Limits to Memory
        MemoryHelperRoom.updateDomesticLimits(room, this.generateDomesticCreepLimits(room));

        // Set Remote Limits to Memory
        MemoryHelperRoom.updateRemoteLimits(room, this.generateRemoteCreepLimits(room));

        // Set Military Limits to Memory
        MemoryHelperRoom.updateMilitaryLimits(room, this.generateMilitaryCreepLimits(room));
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): any {
        // Get all openSpawns, and return the first
        const openSpawns = MemoryApi.getStructureOfType(
            room,
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

        // Check if we need a domestic creep -- Return role if one is found
        for (const role of domesticRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.domesticLimits[role]) {
                return role;
            }
        }
        // Check if we need a military creep -- Return role if one is found
        for (const role of militaryRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.militaryLimits[role]) {
                return role;
            }
        }
        // Check if we need a remote creep -- Return role if one is found
        for (const role of remoteRolePriority) {
            if (MemoryApi.getCreepCount(room, role) < creepLimits.remoteLimits[role]) {
                return role;
            }
        }

        // Return null if we don't need to spawn anything
        return null;
    }

    /**
     * spawn the next creep
     * @param room the room we want to spawn them in
     * @param body BodyPartConstant[] the body array of the creep
     * @param creepOptions creep options we want to give to it
     * @param role RoleConstant the role of the creep
     * @param spawn spawn we are going to use to spawn the creep
     */
    public static spawnNextCreep(
        room: Room,
        body: BodyPartConstant[],
        creepOptions: CreepOptionsCiv | CreepOptionsMili,
        role: RoleConstant,
        spawn: StructureSpawn,
        homeRoom: string,
        targetRoom: string
    ): void {
        // Throw error if we don't have enough energy to spawn this creep
        if (this.getEnergyCostOfBody(body) > room.energyAvailable) {
            throw new UserException(
                "Creep failed to spawn.",
                'The role "' + role + '" was unable to spawn in room "' + room.name + '": Not enough energy .',
                ERROR_WARN
            );
        }

        const name: string = SpawnHelper.generateCreepName(role, this.getTier(room, role), room);
        const creepMemory = SpawnHelper.generateDefaultCreepMemory(role, homeRoom, targetRoom, creepOptions);

        spawn.spawnCreep(body, name, { memory: creepMemory });
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
        const energyAvailable: number = room.energyAvailable;

        // Check what tier we are in based on the amount of energy the room has
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
        room: Room,
        role: RoleConstant | null,
        roomState: RoomStateConstant,
        squadSize?: number,
        squadUUID?: number | null,
        rallyLocation?: RoomPosition | null
    ): CreepOptionsCiv | CreepOptionsMili | undefined {
        // Set default values if military options aren't provided
        // If one of these aren't provided, then the entire purpose of them is nix,
        // So we just check if any of them aren't provided and set defaults for all in that case
        if (!squadSize || !squadUUID || !rallyLocation) {
            squadSize = 0;
            squadUUID = null;
            rallyLocation = null;
        }

        // Call the correct helper function based on creep role
        switch (role) {
            case ROLE_MINER:
                return SpawnHelper.generateMinerOptions(roomState);
            case ROLE_HARVESTER:
                return SpawnHelper.generateHarvesterOptions(roomState);
            case ROLE_WORKER:
                return SpawnHelper.generateWorkerOptions(roomState);
            case ROLE_LORRY:
                return SpawnHelper.generateLorryOptions(roomState);
            case ROLE_POWER_UPGRADER:
                return SpawnHelper.generatePowerUpgraderOptions(roomState);
            case ROLE_REMOTE_MINER:
                return SpawnHelper.generateRemoteMinerOptions(roomState);
            case ROLE_REMOTE_HARVESTER:
                return SpawnHelper.generateRemoteHarvesterOptions(roomState);
            case ROLE_COLONIZER:
                return SpawnHelper.generateRemoteColonizerOptions(roomState);
            case ROLE_CLAIMER:
                return SpawnHelper.generateClaimerOptions(roomState);
            case ROLE_REMOTE_DEFENDER:
                return SpawnHelper.generateRemoteDefenderOptions(roomState);
            case ROLE_REMOTE_RESERVER:
                return SpawnHelper.generateRemoteReserverOptions(roomState);
            case ROLE_ZEALOT:
                return SpawnHelper.generateZealotOptions(roomState, squadSize, squadUUID, rallyLocation);
            case ROLE_MEDIC:
                return SpawnHelper.generateMedicOptions(roomState, squadSize, squadUUID, rallyLocation);
            case ROLE_STALKER:
                return SpawnHelper.generateStalkerOptions(roomState, squadSize, squadUUID, rallyLocation);
            case ROLE_DOMESTIC_DEFENDER:
                return SpawnHelper.generateDomesticDefenderOptions(roomState);
            default:
                throw new UserException(
                    "Creep body failed generating.",
                    'The role "' + role + '" was invalid for generating the creep body.',
                    ERROR_ERROR
                );
        }
    }

    /**
     * Generate the body for the creep based on the tier and role
     * @param tier the tier our room is at
     * @param role the role of the creep we want
     */
    public static generateCreepBody(tier: TierConstant, role: RoleConstant | null): BodyPartConstant[] {
        // Call the correct helper function based on creep role
        switch (role) {
            case ROLE_MINER:
                return SpawnHelper.generateMinerBody(tier);
            case ROLE_HARVESTER:
                return SpawnHelper.generateHarvesterBody(tier);
            case ROLE_WORKER:
                return SpawnHelper.generateWorkerBody(tier);
            case ROLE_LORRY:
                return SpawnHelper.generateLorryBody(tier);
            case ROLE_POWER_UPGRADER:
                return SpawnHelper.generatePowerUpgraderBody(tier);
            case ROLE_REMOTE_MINER:
                return SpawnHelper.generateRemoteMinerBody(tier);
            case ROLE_REMOTE_HARVESTER:
                return SpawnHelper.generateRemoteHarvesterBody(tier);
            case ROLE_COLONIZER:
                return SpawnHelper.generateRemoteColonizerBody(tier);
            case ROLE_CLAIMER:
                return SpawnHelper.generateClaimerBody(tier);
            case ROLE_REMOTE_DEFENDER:
                return SpawnHelper.generateRemoteDefenderBody(tier);
            case ROLE_REMOTE_RESERVER:
                return SpawnHelper.generateRemoteReserverBody(tier);
            case ROLE_ZEALOT:
                return SpawnHelper.generateZealotBody(tier);
            case ROLE_MEDIC:
                return SpawnHelper.generateMedicBody(tier);
            case ROLE_STALKER:
                return SpawnHelper.generateStalkerBody(tier);
            case ROLE_DOMESTIC_DEFENDER:
                return SpawnHelper.generateDomesticDefenderBody(tier);
            default:
                throw new UserException(
                    "Creep body failed generating.",
                    'The role "' + role + '" was invalid for generating the creep body.',
                    ERROR_ERROR
                );
        }
    }

    /**
     * Returns a creep body part array, or null if invalid parameters were passed in
     * @param bodyObject The object that describes the creep's body parts
     * @param opts The options for generating the creep body from the descriptor
     */
    public static getCreepBody(bodyObject: CreepBodyDescriptor, opts?: CreepBodyOptions): BodyPartConstant[] {
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
     */
    public static generateSquadOptions(room: Room, targetRoom: string, roleConst: RoleConstant): StringMap {
        // Set to this for clarity that we aren't expecting any squad options in some cases
        const squadOptions: StringMap = {
            squadSize: 0,
            squadUUID: null,
            rallyLocation: null
        };

        // Don't actually get anything of value if it isn't a military creep. No point
        if (!SpawnHelper.isMilitaryRole(roleConst)) {
            return squadOptions;
        }

        // Get an appropirate attack flag for the creep
        const targetRoomMemoryArray: Array<AttackRoomMemory | undefined> = MemoryApi.getAttackRooms(room, targetRoom);
        // Only going to be one room returned, but had to be an array, so just grab it
        const roomMemory: AttackRoomMemory | undefined = _.first(targetRoomMemoryArray);

        // Drop out early if there are no attack rooms
        if (roomMemory === undefined) {
            return squadOptions;
        }

        const flagMemoryArray: AttackFlagMemory[] = roomMemory!["flags"] as AttackFlagMemory[];
        let selectedFlagMemory: AttackFlagMemory | undefined;
        let currentHighestSquadCount: number = 0;
        let selectedFlagActiveSquadMembers: number = 0;

        // Loop over the flag memory and attach the creep to the first flag that does not have its squad size fully satisfied
        for (const flagMemory of flagMemoryArray) {
            // Skip non-squad based attack flags
            if (flagMemory.squadSize === 0) {
                continue;
            }

            const numActiveSquadMembers: number = SpawnHelper.getNumOfActiveSquadMembers(flagMemory, room);
            const numRequestedSquadMembers: number = flagMemory.squadSize;

            // If we find an active flag that doesn't have its squad requirements met and is currently the flag closest to being met
            if (
                numActiveSquadMembers < numRequestedSquadMembers &&
                numActiveSquadMembers > currentHighestSquadCount &&
                flagMemory.active
            ) {
                selectedFlagMemory = flagMemory;
                currentHighestSquadCount = numActiveSquadMembers;
                selectedFlagActiveSquadMembers = numActiveSquadMembers;
            }
        }

        // If we didn't find a squad based flag return the default squad options
        if (selectedFlagMemory === undefined) {
            return squadOptions;
        } else {
            // if this flag has met its requirements, deactivate it
            if (selectedFlagActiveSquadMembers === selectedFlagMemory.squadSize) {
                // Deactivate either way
                selectedFlagMemory.active = false;

                // If its a one time use, complete it as well
                if (EmpireApi.isAttackFlagOneTimeUse(selectedFlagMemory)) {
                    Game.flags[selectedFlagMemory.flagName].memory.complete = true;
                }
            }

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
     */
    public static getCreepTargetRoom(room: Room, roleConst: RoleConstant): string {
        let roomMemory: RemoteRoomMemory | ClaimRoomMemory | AttackRoomMemory | undefined;

        switch (roleConst) {
            // Colonizing creeps going to their claim rooms
            case ROLE_COLONIZER:
            case ROLE_CLAIMER:
                roomMemory = SpawnHelper.getLowestNumRoleAssignedClaimRoom(room, roleConst);

                break;

            // Remote creeps going to their remote rooms
            case ROLE_REMOTE_DEFENDER:
            case ROLE_REMOTE_HARVESTER:
            case ROLE_REMOTE_MINER:
            case ROLE_REMOTE_RESERVER:
                roomMemory = SpawnHelper.getLowestNumRoleAssignedRemoteRoom(room, roleConst);

                break;

            // Military creeps going to their attack rooms
            case ROLE_STALKER:
            case ROLE_MEDIC:
            case ROLE_ZEALOT:
            case ROLE_DOMESTIC_DEFENDER:
                roomMemory = SpawnHelper.getAttackRoomWithActiveFlag(room);

                break;

            // Domestic creeps keep their target room as their home room
            // Reason we're using case over default is to increase fail-first paradigm (idk what the word means)
            // If an non-existing role then an error will occur here
            case ROLE_MINER:
            case ROLE_HARVESTER:
            case ROLE_WORKER:
            case ROLE_LORRY:
            case ROLE_POWER_UPGRADER:
                return room.name;
        }

        return "";
    }

    /**
     * get the home room for the creep
     * @param room the room the creep is spawning in
     * @param roleConst the role we are getting room for
     */
    public static getCreepHomeRoom(room: Room, roleConst: RoleConstant, targetRoom?: string): string {
        // Okay so this might not even be needed, but I took out colonizer home room setting because
        // That would actually take them out of the creep count for this room, spawning them in an infinite loop
        // We will just set their target room as the claim room and it will have the desired effect
        return room.name;
    }
}
