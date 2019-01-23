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
    public static generateMinerBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for harvester creep
    * @param tier the tier of the room
    */
    public static generateHarvesterBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for worker creep
    * @param tier the tier of the room
    */
    public static generateWorkerBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for lorry creep
    * @param tier the tier of the room
    */
    public static generateLorryBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for power upgrader creep
    * @param tier the tier of the room
    */
    public static generatePowerUpgraderBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }
    // ------------

    // Remote -----
    /**
    * Generate body for remote miner creep
    * @param tier the tier of the room
    */
    public static generateRemoteMinerBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for remote harvester creep
    * @param tier the tier of the room
    */
    public static generateRemoteHarvesterBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for remote reserver creep
    * @param tier the tier of the room
    */
    public static generateRemoteReserverBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for remote colonizer creep
    * @param tier the tier of the room
    */
    public static generateRemoteColonizerBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for remote defender creep
    * @param tier the tier of the room
    */
    public static generateRemoteDefenderBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }
    // ----------

    // Military -----
    /**
    * Generate body for zealot creep
    * @param tier the tier of the room
    */
    public static generateZealotBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }


    /**
    * Generate body for medic creep
    * @param tier the tier of the room
    */
    public static generateMedicBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }

    /**
    * Generate body for stalker creep
    * @param tier the tier of the room
    */
    public static generateStalkerBody(tier: TierConstant): BodyPartConstant[] {
        return [WORK];
    }
    // --------------
}
