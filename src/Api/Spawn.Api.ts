import { SpawnHelper } from "Helpers/SpawnHelper";
import UtilHelper from "Helpers/UtilHelper";
import {
    domesticRolePriority,
    militaryRolePriority,
    remoteRolePriority,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_RESERVER,
    GROUPED,
    COLLATED
} from "utils/Constants";
import MemoryHelperRoom from "../Helpers/MemoryHelper_Room";
import RoomHelper from "../Helpers/RoomHelper";
import MemoryApi from "./Memory.Api";
import MemoryHelper from "Helpers/MemoryHelper";

/**
 * The API used by the spawn manager
 */
export default class SpawnApi {
    /**
     * Get count of all creeps, or of one if creepConst is specified
     * @param room the room we are getting the count for
     * @param creepConst [Optional] Count only one role
     */
    public static getCreepCount(room: Room, creepConst?: RoleConstant): number {
        const filterFunction = creepConst === undefined ? undefined : (c: Creep) => c.memory.role === creepConst;
        return MemoryApi.getMyCreeps(room, filterFunction).length;
    }

    /**
     * get creep limits
     * @param room the room we want the limits for
     */
    public static getCreepLimits(room: Room): CreepLimits {
        const creepLimits: CreepLimits = {
            domesticLimits: Memory.rooms[room.name].creepLimit["remoteLimits"],
            remoteLimits: Memory.rooms[room.name].creepLimit["remoteLimits"],
            militaryLimits: Memory.rooms[room.name].creepLimit["militaryLimits"]
        };

        return creepLimits;
    }

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
                domesticLimits[ROLE_LORRY] = 0;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 1;

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 3;
                domesticLimits[ROLE_POWER_UPGRADER] = 2;
                domesticLimits[ROLE_LORRY] = 2;

                break;

            // Seige
            case ROOM_STATE_SEIGE:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_LORRY] = 1;

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
            remoteDefender: 0
        };

        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const numClaimRooms: number = RoomHelper.numClaimRooms(room);

        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0 && numClaimRooms <= 0) {
            return remoteLimits;
        }

        // Gather the rest of the data only if we have a remote room or a claim room
        const numRemoteDefenders = RoomHelper.numRemoteDefenders(room);
        const numRemoteSources: number = RoomHelper.numRemoteSources(room);

        // check what room state we are in
        switch (room.memory.roomState) {
            // Advanced
            case ROOM_STATE_ADVANCED:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

                break;
        }

        // Return the limits
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
            medic: 0
        };

        // Check for attack flags and adjust accordingly

        // Check if we need defenders and adjust accordingly

        // Return the limits
        return militaryLimits;
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
    public static getOpenSpawn(room: Room): Structure<StructureConstant> | null {
        // Get all openSpawns, and return the first
        const openSpawns = MemoryApi.getStructureOfType(
            room,
            STRUCTURE_SPAWN,
            (spawn: StructureSpawn) => !spawn.spawning
        );
        return _.first(openSpawns);
    }

    /**
     * get next creep to spawn
     * @param room the room we want to spawn them in
     */
    public static getNextCreep(room: Room): string | null {
        // Get Limits for each creep department
        const creepLimits: CreepLimits = this.getCreepLimits(room);

        // Check if we need a domestic creep -- Return role if one is found
        for (const role of domesticRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.domesticLimits[role]) {
                return role;
            }
        }
        // Check if we need a military creep -- Return role if one is found
        for (const role of militaryRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.militaryLimits[role]) {
                return role;
            }
        }
        // Check if we need a remote creep -- Return role if one is found
        for (const role of remoteRolePriority) {
            if (this.getCreepCount(room, role) < creepLimits.remoteLimits[role]) {
                return role;
            }
        }

        // Return null if we don't need to spawn anything
        return null;
    }

    /**
     * spawn the next creep
     * TODO Complete this
     * @param room the room we want to spawn them in
     * @param BodyPartConstant[] the body array of the creep
     * @param RoleConstant the role of the creep
     */
    public static spawnNextCreep(room: Room): void {
        // brock hates empty blocks
    }

    /**
     * get energy cost of creep body
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    public static getEnergyCostOfBody(room: Room, body: BodyPartConstant[]): number {
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
    public static getTier(room: Room, roleConst: RoleConstant): TierConstant {
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
    private static generateCreepOptions(
        room: Room,
        role: RoleConstant,
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
            default:
                UtilHelper.throwError(
                    "Creep body failed generating.",
                    'The role "' + role + '" was invalid for generating the creep body.',
                    ERROR_ERROR
                );
                return undefined;
        }
    }

    /**
     * Generate the body for the creep based on the tier and role
     * @param tier the tier our room is at
     * @param role the role of the creep we want
     */
    public static generateCreepBody(tier: TierConstant, role: RoleConstant): BodyPartConstant[] | undefined {
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
            default:
                UtilHelper.throwError(
                    "Creep body failed generating.",
                    'The role "' + role + '" was invalid for generating the creep body.',
                    ERROR_ERROR
                );
                return undefined;
        }
    }

    /**
     * Returns a creep body part array, or null if invalid parameters were passed in
     * @param bodyObject The object that describes the creep's body parts
     * @param opts The options for generating the creep body from the descriptor
     */
    public static getCreepBody(
        bodyObject: CreepBodyDescriptor,
        opts?: CreepBodyOptions
    ): BodyPartConstant[] | undefined {
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
            UtilHelper.throwError(
                "Invalid Creep Body Descriptor",
                "Ensure that the object being passed to getCreepBody is in the format { BodyPartConstant: NumberParts } and that NumberParts is > 0.",
                ERROR_ERROR
            );
            return undefined;
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
            return undefined;
        } else {
            return creepBody;
        }
    }

    /**
     * Returns the number of miners that are not spawning, and have > 50 ticksToLive
     * @param room the room we are checking in
     */
    private static getActiveMiners(room: Room): number {
        let miners = MemoryHelper.getCreepOfRole(room, ROLE_MINER);
        miners = _.filter(miners, (creep: Creep) => {
            // False if miner is spawning or has less than 50 ticks to live
            return !creep.spawning && creep.ticksToLive! > 50;
        });
        return miners.length;
    }

    /**
     * generates a UUID for a squad
     */
    public static generateSquadUUID(seed?: number) {
        return Math.random() * 10000000;
    }
}
