export class ProcessDefaultAttackFlag implements IFlagProcesser {

    public primaryColor: ColorConstant = COLOR_RED;
    public secondaryColor: undefined = undefined;

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
