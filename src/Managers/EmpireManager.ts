import EmpireApi from "../Api/Empire.Api";

// empire-wide manager
export default class EmpireManager {

    /**
     * run the empire for the AI
     */
    public static runEmpireManager(): void {

        // Delete unused flags and flag memory
        EmpireApi.deleteCompleteFlags();
        EmpireApi.cleanDeadFlags();

        // Get unprocessed flags and process them
        const unprocessedFlags: Flag[] = EmpireApi.getUnprocessedFlags();

        if (unprocessedFlags.length > 0) {

            EmpireApi.processNewFlags(unprocessedFlags);
        }

        // ! - [TODO] Empire Queue and Alliance/Public Memory Stuff
    }
}
