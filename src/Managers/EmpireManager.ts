import EmpireApi from "../Api/Empire.Api";
import MemoryApi from "../Api/Memory.Api";

// empire-wide manager
export default class EmpireManager {

    /**
     * run the empire for the AI
     */
    public static runEmpireManager(): void {

        // Get unprocessed flags and process them
        const unprocessedFlags: Flag[] = EmpireApi.getUnprocessedFlags();
        const ownedRooms: Room[] = MemoryApi.getOwnedRooms();

        if (unprocessedFlags.length > 0) {

            EmpireApi.processNewFlags(unprocessedFlags);
        }

        // Delete unused flags and flag memory
        EmpireApi.deleteCompleteFlags();
        EmpireApi.cleanDeadFlags();

        // Activate attack flags for every room
        _.forEach(ownedRooms, (room: Room) => EmpireApi.activateAttackFlags(room));

        // ! - [TODO] Empire Queue and Alliance/Public Memory Stuff
    }
}
