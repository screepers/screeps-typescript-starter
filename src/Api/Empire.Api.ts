import EmpireHelper from "../Helpers/EmpireHelper";
import MemoryApi from "./Memory.Api";
import { } from "utils/Constants";

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
            if (!flag.memory.processed || flag.memory.processed === undefined) {
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

                // Option flags
                case COLOR_GREEN:

                    // Dependent Room override flag
                    if (flag.secondaryColor === COLOR_WHITE) {
                        EmpireHelper.processNewDependentRoomOverrideFlag(flag);
                    }
                    else if (flag.secondaryColor === COLOR_YELLOW) {
                        EmpireHelper.processNewStimulateFlag(flag);
                    }

                // Unhandled Flag, print warning to console
                // Set to processed to prevent the flag from attempting processization every tick
                default:

                    console.log("Attempted to process flag of an unhandled type.")
                    flag.memory.processed = true;
                    break;
            }

            // Set up the memory for the room if it doesn't already exist
            const roomName = flag.pos.roomName;
            if (!Memory.rooms[roomName]) {
                MemoryApi.initRoomMemory(roomName);
            }
        }
    }

    /**
     * deletes all flags marked as complete
     */
    public static deleteCompleteFlags(): void {

        const completeFlags = MemoryApi.getAllFlags((flag: Flag) => flag.memory.complete);

        // Loop over all flags, removing them and their direct memory from the game
        for (const flag of completeFlags) {
            console.log("Removing flag [" + flag.name + "]");
            flag.remove();
            delete Memory.flags[flag.name];
        }
    }

    /**
     * look for dead flags (memory with no associated flag existing) and remove them
     */
    public static cleanDeadFlags(): void {

        // Get all flag based action memory structures (Remote, Claim, and Attack Room Memory)
        const allRooms = MemoryApi.getOwnedRooms();
        const claimRooms: Array<ClaimRoomMemory | undefined> = _.flatten(_.map(allRooms,
            room => MemoryApi.getClaimRooms(room)));
        const remoteRooms: Array<RemoteRoomMemory | undefined> = _.flatten(_.map(allRooms,
            room => MemoryApi.getRemoteRooms(room)));
        const attackRooms: Array<AttackRoomMemory | undefined> = _.flatten(_.map(allRooms,
            room => MemoryApi.getAttackRooms(room)));


        // Clean dead flags from memory structures
        EmpireHelper.cleanDeadClaimRoomFlags(claimRooms);
        EmpireHelper.cleanDeadRemoteRoomsFlags(remoteRooms);
        EmpireHelper.cleanDeadAttackRoomFlags(attackRooms);

        // Clean the memory of each type of dependent room memory structure with no existing flags associated
        EmpireHelper.cleanDeadClaimRooms(claimRooms);
        EmpireHelper.cleanDeadRemoteRooms(remoteRooms);
        EmpireHelper.cleanDeadAttackRooms(attackRooms);
    }

    /**
     * get if the flag is considered a one time use flag
     */
    public static isAttackFlagOneTimeUse(flagMemory: AttackFlagMemory) {
        // Currently all flags are one time use, add the flag constant here if its like a tower draining for example
        return true;
    }

    /**
     * if there are no active attack flags for a specific room, active one
     */
    public static activateAttackFlags(room: Room): void {

        const attackRooms: Array<AttackRoomMemory | undefined> = MemoryApi.getAttackRooms(room);
        const attackRoomWithNoActiveFlag: AttackRoomMemory | undefined = _.find(attackRooms, (attackRoom: AttackRoomMemory) => {
            if (attackRoom) {
                return !_.some(attackRoom!.flags, (flag: AttackFlagMemory) => flag.active);
            }
            return false;
        });

        // Break early if there are none
        if (!attackRoomWithNoActiveFlag) {
            return;
        }

        // Break early if no attack flags on this room (possible to happen from an error with cleaning)
        if (!attackRoomWithNoActiveFlag!.flags) {
            return;
        }

        // Activate the first one we see, possible to change later for another standard
        for (const arf in attackRoomWithNoActiveFlag!.flags) {
            if (attackRoomWithNoActiveFlag!.flags[arf]) {
                attackRoomWithNoActiveFlag!.flags[arf]!.active = true;
                break;
            }
        }
    }
};
