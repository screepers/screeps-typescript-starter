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
            if (BODYPARTS_ALL[part] === undefined) {
                // ! Technically invalid for testing atm - Need to fix
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
    public static generateMinerBody(tier: number): BodyPartConstant[] | undefined {
        let body: CreepBodyDescriptor | undefined;
        const opts: CreepBodyOptions = { mixType: GROUPED }; // Set any default values for the miner here

        switch (tier) {
            case TIER_1:
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;
            case TIER_2:
                body = { work: 5, move: 1 };
                break;
            case TIER_3 || TIER_4 || TIER_5 || TIER_6 || TIER_7 || TIER_8:
                body = { work: 5, move: 2 };
                break;
        }

        if (body !== undefined) {
            return SpawnApi.getCreepBody(body, opts);
        } else {
            UtilHelper.throwError(
                "Invalid Tier List",
                "Ensure that the tier being passed to the function is valid." +
                    "Ensure that there is a body descriptor created for that tier.",
                ERROR_ERROR
            );
            return undefined;
        }
    }

    /**
     * Generate body for harvester creep
     * @param tier the tier of the room
     */
    public static generateHarvesterBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
            // 1 work, 2 carry, 2 move - total cost: 300
            this.getBody_Grouped({ WORK: 1, CARRY: 2, MOVE: 2 });
        }

        // Tier 2
        if (tier === TIER_2) {
            // 2 work, 4 carry, 3 move - total cost: 550
            this.getBody_Grouped({ WORK: 2, CARRY: 5, MOVE: 3 });
        }

        // Tier 3
        if (tier === TIER_3) {
            // 2 work, 6 carry, 2 move - total cost: 800
            this.getBody_Grouped({ WORK: 2, CARRY: 6, MOVE: 6 });
        }

        // Tier 4
        if (tier === TIER_4) {
            // 2 work, 11 carry, 11 move - total cost: 1300
            this.getBody_Grouped({ WORK: 2, CARRY: 11, MOVE: 11 });
        }

        // Tier 5
        if (tier === TIER_5) {
            // 2 work, 16 carry, 16 move - total cost: 1800
            this.getBody_Grouped({ WORK: 2, CARRY: 16, MOVE: 16 });
        }

        // Tier 6
        if (tier === TIER_6 || tier === TIER_7 || tier === TIER_8) {
            // Largest harvester we want, potential to adjust later
            // 2 work, 21 carry, 21 move - total cost: 2200
            this.getBody_Grouped({ WORK: 2, CARRY: 20, MOVE: 20 });
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError("Invalid Tier List", "generateBody helper didn't find the tier requested", ERROR_ERROR);
        return undefined;
    }

    /**
     * Generate body for worker creep
     * @param tier the tier of the room
     */
    public static generateWorkerBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
            // 1 work, 2 carry, 2 move - total cost: 300
            this.getBody_Grouped({ WORK: 1, CARRY: 2, MOVE: 2 });
        }

        // Tier 2
        if (tier === TIER_2) {
            // 2 work, 4 carry, 3 move - total cost: 550
            this.getBody_Grouped({ WORK: 2, CARRY: 5, MOVE: 3 });
        }

        // Tier 3
        if (tier === TIER_3) {
            // 4 work, 4 carry, 4 move - total cost: 800
            this.getBody_Grouped({ WORK: 4, CARRY: 4, MOVE: 4 });
        }

        // Tier 4
        if (tier === TIER_4) {
            // 7 work, 6 carry, 6 move - total cost: 1300
            this.getBody_Grouped({ WORK: 7, CARRY: 6, MOVE: 6 });
        }

        // Tier 5
        if (tier === TIER_5 || tier === TIER_6 || tier === TIER_7 || tier === TIER_8) {
            // Want to cap workers at 400 ish energy so they don't monopolize the energy
            // And I think 10 work will suffice since they have been essentially
            // demoted to janitors and builders by tier 6, so no need to increase from here
            // 10 work, 8 carry, 8 move - total cost: 1800
            this.getBody_Grouped({ WORK: 10, CARRY: 8, MOVE: 8 });
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for lorry creep
     * @param tier the tier of the room
     */
    public static generateLorryBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for power upgrader creep
     * @param tier the tier of the room
     */
    public static generatePowerUpgraderBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
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
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for remote harvester creep
     * @param tier the tier of the room
     */
    public static generateRemoteHarvesterBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for remote reserver creep
     * @param tier the tier of the room
     */
    public static generateRemoteReserverBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for remote colonizer creep
     * @param tier the tier of the room
     */
    public static generateRemoteColonizerBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for remote defender creep
     * @param tier the tier of the room
     */
    public static generateRemoteDefenderBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
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
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for medic creep
     * @param tier the tier of the room
     */
    public static generateMedicBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }

    /**
     * Generate body for stalker creep
     * @param tier the tier of the room
     */
    public static generateStalkerBody(tier: number): BodyPartConstant[] | undefined {
        // Tier 1
        if (tier === TIER_1) {
        }

        // Tier 2
        if (tier === TIER_2) {
        }

        // Tier 3
        if (tier === TIER_3) {
        }

        // Tier 4
        if (tier === TIER_4) {
        }

        // Tier 5
        if (tier === TIER_5) {
        }

        // Tier 6
        if (tier === TIER_6) {
        }

        // Tier 7
        if (tier === TIER_7) {
        }

        // Tier 8
        if (tier === TIER_8) {
        }

        // Throw error if we didn't find a valid tier
        UtilHelper.throwError(
            "Invalid Tier List",
            "generate body helper didn't find the tier it was passed",
            ERROR_ERROR
        );
        return undefined;
    }
    // --------------
}
