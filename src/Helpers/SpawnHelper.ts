import UtilHelper from "./UtilHelper";

/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    /**
     * Groups the body parts -- e.g. WORK, WORK, CARRY, CARRY, MOVE, MOVE
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Grouped(descriptor: StringMap): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        _.forEach(Object.keys(descriptor), (part: BodyPartConstant) => {
            for (let i = 0; i < descriptor[part]; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }

    /**
     * Collates the body parts -- e.g. WORK, CARRY, MOVE, WORK, CARRY, ...
     * TODO Test this method -- Hard to test in a code only environment
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Collated(descriptor: StringMap): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        const numParts = _.sum(descriptor);
        const partNames = Object.keys(descriptor);
        const counts: StringMap = {};
        // Initialize Counts
        for (const part in partNames) {
            counts[part] = 0;
        }

        while (creepBody.length < numParts) {

            for (const part in partNames) {
                if (counts[part] < descriptor[part]) {
                    creepBody.push(<BodyPartConstant>part);
                    counts[part]++;
                }
            }
        }

        return creepBody;
    }

    // Domestic ----
    /**
     * Generate body for miner creep
     * @param tier the tier of the room
     */
    public static generateMinerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for harvester creep
    * @param tier the tier of the room
    */
    public static generateHarvesterBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for worker creep
    * @param tier the tier of the room
    */
    public static generateWorkerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for lorry creep
    * @param tier the tier of the room
    */
    public static generateLorryBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for power upgrader creep
    * @param tier the tier of the room
    */
    public static generatePowerUpgraderBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }
    // ------------

    // Remote -----
    /**
    * Generate body for remote miner creep
    * @param tier the tier of the room
    */
    public static generateRemoteMinerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for remote harvester creep
    * @param tier the tier of the room
    */
    public static generateRemoteHarvesterBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for remote reserver creep
    * @param tier the tier of the room
    */
    public static generateRemoteReserverBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for remote colonizer creep
    * @param tier the tier of the room
    */
    public static generateRemoteColonizerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for remote defender creep
    * @param tier the tier of the room
    */
    public static generateRemoteDefenderBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }
    // ----------

    // Military -----
    /**
    * Generate body for zealot creep
    * @param tier the tier of the room
    */
    public static generateZealotBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }


    /**
    * Generate body for medic creep
    * @param tier the tier of the room
    */
    public static generateMedicBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }

    /**
    * Generate body for stalker creep
    * @param tier the tier of the room
    */
    public static generateStalkerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

        }

        // Tier 2
        if (tier == TIER_2) {

        }

        // Tier 3
        if (tier == TIER_3) {

        }

        // Tier 4
        if (tier == TIER_4) {

        }

        // Tier 5
        if (tier == TIER_5) {

        }

        // Tier 6
        if (tier == TIER_6) {

        }

        // Tier 7
        if (tier == TIER_7) {

        }

        // Tier 8
        if (tier == TIER_8) {

        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR);
        return undefined;
    }
    // --------------
}
