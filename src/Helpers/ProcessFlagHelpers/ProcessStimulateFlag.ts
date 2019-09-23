import { EmpireHelper, RoomVisualHelper, MemoryApi } from "utils/internals";

export class ProcessDefaultStimulateFlag implements IFlagProcesser {
    public primaryColor: ColorConstant = COLOR_GREEN;
    public secondaryColor: ColorConstant = COLOR_YELLOW;

    constructor() {
        const self = this;
        self.processFlag = self.processFlag.bind(self);
    }

    /**
     * Process the default stimulate flag
     * @param flag
     */
    public processFlag(flag: Flag): void {
        const flagTypeConst: FlagTypeConstant | undefined = EmpireHelper.getFlagType(flag);
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        MemoryApi.createEmpireAlertNode(
            "Option Flag [" +
                flag.name +
                "] processed. Flag Type: [" +
                RoomVisualHelper.convertFlagTypeToString(flagTypeConst) +
                "]",
            10
        );
    }
}
