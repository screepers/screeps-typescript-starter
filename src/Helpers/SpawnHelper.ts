import UtilHelper from "./UtilHelper";
import SpawnApi from "Api/Spawn.Api";
import { GROUPED, COLLATED } from "utils/Constants";

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
    public static generateCreepName(role: RoleConstant, tier: TierConstant): string {
        const modifier: string = Game.time.toString().slice(4);
        const name = role + "_" + tier + "_" + modifier;
        return name;
    }

    // Domestic ----
    /**
     * Generate body for miner creep
     * @param tier The tier of the room
     */
    public static generateMinerBody(tier: number): BodyPartConstant[] | null {

        // Default values for miner
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Work, 2 Move - Total Cost: 300
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;

            case TIER_2:    // 5 Work, 1 Move - Total Cost: 550
                body = { work: 5, move: 1 };
                break;

            case TIER_3 || TIER_4 || TIER_5 || TIER_6 || TIER_7 || TIER_8:  // 5 Work, 2 Move - Total Cost: 600
                body = { work: 5, move: 2 };
                break;
        }

        // Generate the creep body based on the body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for Harvester creep
     * @param tier the tier of the room
     */
    public static generateHarvesterBody(tier: number): BodyPartConstant[] | null {

        // Default Values for harvester
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2:    // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;

            case TIER_3:    // 2 Work, 6 Carry, 6 Move - Total Cost: 800
                body = { work: 2, carry: 6, move: 6 };
                break;

            case TIER_4:    // 2 Work, 11 Carry, 11 Move - Total Cost: 1300
                body = { work: 2, carry: 11, move: 11 };
                break;

            case TIER_5:    // 2 Work, 16 Carry, 16 Move - Total Cost: 1800
                body = { work: 2, carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 2 Work, 20 Carry, 20 Move - Total Cost: 2200
                body = { work: 2, carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for worker creep
     * @param tier the tier of the room
     */
    public static generateWorkerBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Worker
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2:    // 2 Work, 5 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 5, move: 3 };
                break;

            case TIER_3:    // 4 Work, 4 Carry, 4 Move - Total Cost: 800
                body = { work: 4, carry: 4, move: 4 };
                break;

            case TIER_4:    // 7 Work, 6 Carry, 6 Move - Total Cost: 1300
                body = { work: 7, carry: 6, move: 6 };
                break;

            case TIER_5 || TIER_6 || TIER_7 || TIER_8:  // 10 Work, 8 Carry, 8 Move - Total Cost: 1800
                body = { work: 10, carry: 8, move: 8 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for lorry creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateLorryBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Lorry
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for power upgrader creep
     * extra for commit
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generatePowerUpgraderBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Power Upgrader
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }
    // ------------

    // Remote -----
    /**
     * Generate body for remote miner creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateRemoteMinerBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Remote Miner
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for remote harvester creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateRemoteHarvesterBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Remote Harvester
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for remote reserver creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateRemoteReserverBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Remote Reserver
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for remote colonizer creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateRemoteColonizerBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Remote Colonizer
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for remote defender creep
     * TODO Complete this
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateRemoteDefenderBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Remote Defender
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }
    // ----------

    // Military -----
    /**
     * Generate body for zealot creep
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateZealotBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Zealot
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for medic creep
     * TODO Complete this
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateMedicBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Medic
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }

    /**
     * Generate body for stalker creep
     * TODO Complete this
     * TODO Complete this
     * @param tier the tier of the room
     */
    public static generateStalkerBody(tier: number): BodyPartConstant[] | null {

        // Default Values for Stalker
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1:    // 2 Carry, 2 Move - Total Cost: 300
                body = { carry: 2, move: 2 };
                break;

            case TIER_2:    // 5 Carry, 3 Move - Total Cost: 550
                body = { carry: 5, move: 3 };
                break;

            case TIER_3:    // 6 Carry, 6 Move - Total Cost: 800
                body = { carry: 6, move: 6 };
                break;

            case TIER_4:    // 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 11, move: 11 };
                break;

            case TIER_5:    // 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 16, move: 16 };
                break;

            case TIER_6 || TIER_7 || TIER_8:  // 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        }
        else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return null;
        }
    }
    // --------------
}
