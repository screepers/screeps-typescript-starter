export class ProcessDefaultRemoteRoom implements IFlagProcesser {

    public primaryColor: ColorConstant = COLOR_YELLOW;
    public secondaryColor: ColorConstant = COLOR_YELLOW;

    constructor() {
        const self = this;
        self.processFlag = self.processFlag.bind(self);
    }

    /**
     * Process the default remote room flag
     * @param flag
     */
    public processFlag(flag: Flag): void {

    }
}
