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
import RoomHelper from "Helpers/RoomHelper";

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
                return "Intermediate";
            case ROOM_STATE_ADVANCED:
                return "Advanced";
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

    /**
     * get the amount of seconds in each tick (estimate)
     */
    public static getSecondsPerTick(): number {
        const TIME_BETWEEN_CHECKS: number = 50;
        if (!Memory.visual) {
            Memory.visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: []

            } as VisualMemory;
        }

        // Every 50 ticks, update the time and find the new seconds per tick
        if (RoomHelper.excecuteEveryTicks(TIME_BETWEEN_CHECKS)) {
            const updatedTime: number = Date.now();
            const oldTime: number = Memory.visual.time;
            const avgTimePerTick = ((updatedTime - oldTime) / TIME_BETWEEN_CHECKS) / 1000;
            Memory.visual.time = updatedTime;
            Memory.visual.secondsPerTick = Math.floor(avgTimePerTick * 10) / 10;
        }
        return Memory.visual.secondsPerTick;
    }

    /**
     * get the average controller progress over the last specified ticks
     * @param ticks the number of ticks we are wanting to collect
     * @param room the room we are getting the CPPT for
     */
    public static getAverageControlPointsPerTick(ticks: number, room: Room): number {
        if (!Memory.visual || !Memory.visual.controllerProgressArray) {
            Memory.visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: []
            } as VisualMemory;
        }

        const progressSampleSize: number = Memory.visual.controllerProgressArray.length;
        const newControllerProgress: number = room.controller!.progress;
        let progressSum: number = 0;

        if (progressSampleSize < ticks) {
            // Add this ticks value to the array if it isn't already too large
            Memory.visual.controllerProgressArray.push(newControllerProgress);
        }
        else {
            // Move everything left, then add new value to end
            for (let j = 0; j < progressSampleSize; ++j) {
                Memory.visual.controllerProgressArray[j] = Memory.visual.controllerProgressArray[j + 1];
            }
            Memory.visual.controllerProgressArray[progressSampleSize - 1] = newControllerProgress;
        }

        // Get the average control points per tick
        for (let i = 0; i < progressSampleSize - 1; ++i) {
            progressSum += (Memory.visual.controllerProgressArray[i + 1] - Memory.visual.controllerProgressArray[i]);
        }

        return Math.floor(progressSum / progressSampleSize);
    }

    /**
     * converts the value into something shorter so it can be displayed by the graph
     * ex converts 22,000 -> 22k
     */
    public static convertRangeToDisplayVal(rangeVal: number): string | number {
        return rangeVal > 999 ? (rangeVal / 1000).toFixed(1) + 'k' : rangeVal;
    }
}
