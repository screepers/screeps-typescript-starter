import {
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_SEIGE,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    STANDARD_SQUAD,
    ZEALOT_SOLO,
    STALKER_SOLO
} from "utils/constants";

const textColor = '#bab8ba';
const textSize = .8;
const charHeight = textSize * 1.1;

// Helper for room visuals
export default class RoomVisualManager {

    /**
     * display m
     * @param lines the array of text we want to display
     * @param x the x value we are starting it at
     * @param y the y value we are starting it at
     * @param roomName the room name its going in
     * @param isLeft if we are left aligning
     */
    public static multiLineText(lines: string[], x: number, y: number, roomName: string, isLeft: boolean): void {
        if (lines.length === 0) {
            return;
        }
        const vis = new RoomVisual(roomName);

        // Draw text
        let dy = 0;
        for (const line of lines) {

            if (isLeft) {
                vis.text(line, x, y + dy, {
                    align: 'left',
                    color: textColor,
                    opacity: .8,
                    font: ' .7 Trebuchet MS'
                });
            }
            else {
                vis.text(line, x, y + dy, {
                    align: 'right',
                    color: textColor,
                    opacity: .8,
                    font: ' .7 Trebuchet MS'
                });
            }

            dy += charHeight;
        }
    }

    /**
     * take the room state we are given and return the name of that room state
     * @param roomState the room state we are getting the string for
     */
    public static convertRoomStateToString(roomState: RoomStateConstant): string {

        switch (roomState) {
            case ROOM_STATE_INTRO:
                return "Intro";
            case ROOM_STATE_BEGINNER:
                return "Beginner";
            case ROOM_STATE_INTER:
                return "Advanced";
            case ROOM_STATE_ADVANCED:
                return "Beginner";
            case ROOM_STATE_NUKE_INBOUND:
                return "Nuke Incoming!";
            case ROOM_STATE_SEIGE:
                return "Seige!";
            case ROOM_STATE_STIMULATE:
                return "Stimulate";
            case ROOM_STATE_UPGRADER:
                return "Upgrader";
        }
    }

    /**
     * take the flag type we are given and return the string name of that flag type
     * @param flagType the type of flag we are getting the string for
     */
    public static convertFlagTypeToString(flagType: FlagTypeConstant | undefined): string {
        switch (flagType) {
            case STANDARD_SQUAD:
                return "Standard Squad";
            case STALKER_SOLO:
                return "Stalker Solo";
            case ZEALOT_SOLO:
                return "Zealot Solo";
            default:
                return "Not An Attack Flag"
        }
    }
}
