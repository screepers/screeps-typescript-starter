import { UserException } from "utils/internals";

export class UtilHelper {
    /**
     * Display an error to the console
     * @param e Either a UserException or an Error
     */
    public static printError(e: UserException | Error): void {
        if (e instanceof UserException) {
            console.log('<font color="' + e.titleColor + '">' + e.title + "</font>");
            console.log('<font color="' + e.bodyColor + '">' + e.body + "</font>");
        } else {
            console.log("Unexpected error, see the details below: ");
            console.log(e.stack);
        }
    }
}
