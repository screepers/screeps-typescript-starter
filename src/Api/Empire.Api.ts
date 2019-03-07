import EmpireHelper from "../Helpers/EmpireHelper";
import MemoryApi from "./Memory.Api";

export default class Empire {

    /**
     * get new flags that need to be processed
     * @returns Flag[] an array of flags that need to be processed (empty if none)
     */
    public static getUnprocessedFlags(): Flag[] {

        // Create an array of all flags
        const allFlags: Flag[] = MemoryApi.getAllFlags();
        const newFlags: Flag[] = [];

        // Create an array of all unprocessed flags
        for (const flag of allFlags) {
            if (!flag.memory.processed) {
                newFlags.push(flag);
            }
        }

        // Returns all unprocessed flags, empty array if there are none
        return newFlags;
    }
    /**
     * search for new flags and properly commit them
     * @param newFlags StringMap of new flags we need to process
     */
    public static processNewFlags(newFlags: Flag[]): void {

        // Don't run the function if theres no new flags
        if (newFlags.length === 0) {
            return;
        }

        // Loop over all new flags and call the proper helper
        for (const flag of newFlags) {

            switch (flag.color) {

                // Remote Flags
                case COLOR_YELLOW:

                    EmpireHelper.processNewRemoteFlag(flag);
                    break;

                // Attack Flags
                case COLOR_RED:

                    EmpireHelper.processNewAttackFlag(flag);
                    break;

                // Claim Flags
                case COLOR_WHITE:

                    EmpireHelper.processNewClaimFlag(flag);
                    break;

                // Unhandled Flag, print warning to console
                // Set to processed to prevent the flag from attempting processization every tick
                default:

                    console.log("Attempted to process flag of an unhandled type.")
                    flag.memory.processed = true;
                    break;
            }
        }
    }

    /**
     * look for dead flags (memory with no associated flag existing) and remove them
     */
    public static cleanDeadFlags(): void {

        // Get all action memory structures
        const allRooms = MemoryApi.getOwnedRooms();
        const claimRoomsPreFlattened: Array<Array<ClaimRoomMemory | undefined> | undefined> = _.map(allRooms,
            room => MemoryApi.getClaimRooms(room));
        const remoteRoomsPreFlattened: Array<Array<RemoteRoomMemory | undefined> | undefined> = _.map(allRooms,
            room => MemoryApi.getRemoteRooms(room));;
        const attackRoomsPreFlattened: Array<Array<AttackRoomMemory | undefined> | undefined> = _.map(allRooms,
            room => MemoryApi.getAttackRooms(room));;

        const claimRooms: Array<ClaimRoomMemory | undefined>;
        const remoteRooms: Array<RemoteRoomMemory | undefined>;
        const attackRooms: Array<AttackRoomMemory | undefined>;


        // Loop over claim rooms, remote rooms, and attack rooms, and make sure the flag they're referencing actually exists
    }

    /**
     * get if the flag is considered a one time use flag
     */
    public static isAttackFlagOneTimeUse(flagMemory: AttackFlagMemory) {
        // Currently all flags are one time use, add the flag constant here if its like a tower draining for example
        return true;
    }
};
