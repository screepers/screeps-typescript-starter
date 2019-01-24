import UtilHelper from "./UtilHelper";
import SpawnApi from "Api/Spawn.Api";

/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    /**
     * Returns a boolean indicating if the object is a valid creepBody descriptor
     * TODO Complete this function - Might not be necessary since I defined a type for descriptor now
     * @param bodyObject The description of the creep body to verify
     */
    public static verifyDescriptor(bodyObject: object): boolean {
        const partNames = Object.keys(bodyObject);
        // Figure out how to verify the bodyObject here
        // Mostly just need to ensure that each key is a BodyPartConstant
        // and that the value is a number that is > 0
        return true;
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

    /**
     * Generates a creep name in the format role_tier_uniqueID
     * @param role The role of the creep being generated
     * @param tier The tier of the creep being generated
     */
    public static generateCreepName(role: RoleConstant, tier: TierConstant): string {
        const modifier: string = Game.time.toString().slice(4);
        const name = role + "_" + tier + "_" + modifier;
        return name;
    }
    // Domestic ----
    /**
     * Generate body for miner creep
     * @param tier the tier of the room
     */
    public static generateMinerBody(tier: number): BodyPartConstant[] | undefined {

        // Tier 1
        if (tier == TIER_1) {

            // Beginner miner, 2 work, 2 move - total cost: 300
            this.getBody_Grouped({ WORK: 2, MOVE: 2 });
        }

        // Tier 2
        if (tier == TIER_2) {

            // Almost standard miner, 5 work 1 move - total cost: 550
            this.getBody_Grouped({ WORK: 5, MOVE: 1 });
        }

        // Tier 3 - 8, Because miners stay constant from tier 3 and up
        if (tier == TIER_3 || tier == TIER_4 || tier == TIER_5 ||
            tier == TIER_6 || tier == TIER_7 || tier == TIER_8) {

            // We have a standard miner here, 5 work 2 move - total cost: 600
            this.getBody_Grouped({ WORK: 5, MOVE: 2 });
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
