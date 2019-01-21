import { ERROR_FATAL, ERROR_ERROR, ERROR_WARN, COLORS } from "utils/Constants";

export default class UtilHelper {
    /**
     * Display an error to the console
     * @param title The title line to display above the error message
     * @param body The error message to be displayed
     * @param severity An ErrorConstant (Constants.ts) denoting the severity of the error
     * @param useTitleColor [Optional] A hex color value to override the title line's color
     * @param useBodyColor [Optional] A hex color value to override the body's color
     */
    public static throwError(
        title: string,
        body: string,
        severity: ErrorConstant,
        useTitleColor?: string,
        useBodyColor?: string
    ): void {
        // For now we trust that we are passing a proper hex color
        const titleColor: string = useTitleColor !== undefined ? useTitleColor : COLORS[severity];
        const bodyColor: string = useBodyColor !== undefined ? useBodyColor : "#ff1113";

        console.log('<font color="' + titleColor + '">' + title + "</font>");
        if( severity > ERROR_WARN) {
            throw new Error(body);
        }
        else{
            console.log('<font color="' + bodyColor + '">' + body + "</font>");
        }
    }
}
