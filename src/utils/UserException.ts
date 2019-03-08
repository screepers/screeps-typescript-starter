import { COLORS } from "utils/constants";
/**
 * Custom error class
 */
class UserException extends Error {

    public title: string;
    public body: string;
    public severity: number;
    public titleColor: any;
    public bodyColor: string;

    constructor(title: string, body: string, severity: ErrorConstant, useTitleColor?: string, useBodyColor?: string) {
        super();
        Object.setPrototypeOf(this, UserException.prototype);

        this.title = title;
        this.body = body;
        this.severity = severity;
        // Custom color option
        this.titleColor = useTitleColor !== undefined ? useTitleColor : COLORS[severity];
        this.bodyColor = useBodyColor !== undefined ? useBodyColor : "#ff1113";
    }
}

export default UserException;
