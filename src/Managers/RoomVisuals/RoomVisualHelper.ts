import {
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    STANDARD_SQUAD,
    ZEALOT_SOLO,
    STALKER_SOLO,
    CLAIM_FLAG,
    REMOTE_FLAG,
    OVERRIDE_D_ROOM_FLAG,
    STIMULATE_FLAG,
    RoomHelper,
    STUCK_COUNT_LIMIT,
    STUCK_VISUAL_COLORS,
    RoomManager
} from "utils/internals";

const textColor = "#bab8ba";
const textSize = 0.8;
const charHeight = textSize * 1.1;

// Helper for room visuals
export class RoomVisualHelper {
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
                    align: "left",
                    color: textColor,
                    opacity: 0.8,
                    font: " .7 Trebuchet MS"
                });
            } else {
                vis.text(line, x, y + dy, {
                    align: "right",
                    color: textColor,
                    opacity: 0.8,
                    font: " .7 Trebuchet MS"
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
            case CLAIM_FLAG:
                return "Claim";
            case REMOTE_FLAG:
                return "Remote";
            case OVERRIDE_D_ROOM_FLAG:
                return "Override";
            case STIMULATE_FLAG:
                return "Stimulate";
            default:
                return "Not a valid flag type (roomVisualHelper/convertFlagTypeToString).";
        }
    }

    /**
     * get the amount of seconds in each tick (estimate)
     */
    public static getSecondsPerTick(room: Room): number {
        const TIME_BETWEEN_CHECKS: number = 50;
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller!.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            } as VisualMemory;
        }

        // Every 50 ticks, update the time and find the new seconds per tick
        if (RoomHelper.excecuteEveryTicks(TIME_BETWEEN_CHECKS)) {
            const updatedTime: number = Date.now();
            const oldTime: number = Memory.rooms[room.name].visual!.time;
            const avgTimePerTick = (updatedTime - oldTime) / TIME_BETWEEN_CHECKS / 1000;
            Memory.rooms[room.name].visual!.time = updatedTime;
            Memory.rooms[room.name].visual!.secondsPerTick = Math.floor(avgTimePerTick * 10) / 10;
        }
        return Memory.rooms[room.name].visual!.secondsPerTick;
    }

    /**
     * get the average controller progress over the last specified ticks
     * @param ticks the number of ticks we are wanting to collect
     * @param room the room we are getting the CPPT for
     */
    public static getAverageControlPointsPerTick(ticks: number, room: Room): number {
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller!.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            } as VisualMemory;
        }

        const progressSampleSize: number = Memory.rooms[room.name].visual!.controllerProgressArray.length;
        const newControllerProgress: number = room.controller!.progress;
        let progressSum: number = 0;

        if (progressSampleSize < ticks) {
            // Add this ticks value to the array if it isn't already too large
            Memory.rooms[room.name].visual!.controllerProgressArray.push(newControllerProgress);
        } else {
            // Move everything left, then add new value to end
            for (let j = 0; j < progressSampleSize; ++j) {
                Memory.rooms[room.name].visual!.controllerProgressArray[j] = Memory.rooms[
                    room.name
                ].visual!.controllerProgressArray[j + 1];
            }
            Memory.rooms[room.name].visual!.controllerProgressArray[progressSampleSize - 1] = newControllerProgress;
        }

        // Get the average control points per tick
        for (let i = 0; i < progressSampleSize - 1; ++i) {
            progressSum +=
                Memory.rooms[room.name].visual!.controllerProgressArray[i + 1] -
                Memory.rooms[room.name].visual!.controllerProgressArray[i];
        }

        return Math.floor(progressSum / progressSampleSize);
    }

    /**
     * converts the value into something shorter so it can be displayed by the graph
     * ex converts 22,000 -> 22k
     * @param rangeVal the value we are converting
     */
    public static convertRangeToDisplayVal(rangeVal: number): string | number {
        return rangeVal > 999 ? (rangeVal / 1000).toFixed(1) + "k" : rangeVal;
    }

    /**
     * Converts seconds to days hours minutes seconds
     * @param seconds The seconds to convert to larger units
     */
    public static convertSecondsToTime(seconds: number): string {
        const days = Math.floor(seconds / 86400);
        seconds = seconds % 86400;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        let timeString = "";
        if (days > 0) {
            timeString = timeString.concat(days + "d ");
        }
        if (hours > 0) {
            timeString = timeString.concat(hours + "h ");
        }
        if (minutes > 0) {
            timeString = timeString.concat(minutes + "m ");
        }
        // Only show seconds if it's all there is
        if (seconds > 0 && timeString.length === 0) {
            timeString = timeString.concat(seconds + "s");
        }

        if (timeString === "") {
            return "NaN";
        }

        return timeString;
    }

    /**
     * Updates a rolling average for the controller level
     * @param room
     */
    public static updateRollingAverage(newValue: number, room: Room) {
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller!.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            } as VisualMemory;
        }

        const etaMemory = Memory.rooms[room.name].visual!.etaMemory;

        // Reset rolling average so that values remain significant instead of being watered down over time
        if (etaMemory.rcl !== room.controller!.level) {
            etaMemory.avgPointsPerTick = 0;
            etaMemory.ticksMeasured = 0;
            etaMemory.rcl = room.controller!.level;
        }

        // Increment Tick Count
        etaMemory.ticksMeasured++;

        // ! TEMPORARY - NEEDS MOVED TO CONFIG
        let ticksConsidered = 1000; // should be about 1 hour of activity

        // newAvg = oldAvg + (newValue - oldAvg) / min(counter, FACTOR)
        const oldAvg = etaMemory.avgPointsPerTick;
        const newAvg = oldAvg + (newValue - oldAvg) / Math.min(ticksConsidered, etaMemory.ticksMeasured);

        etaMemory.avgPointsPerTick = newAvg;
    }

    /**
     * gets the estimated time in days, hours, minutes to the next rcl based on current average
     * @param room the room we are gettign this value for
     */
    public static getEstimatedTimeToNextLevel(room: Room): string {
        if (room.controller === undefined) {
            return "No rcl";
        }

        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                time: Date.now(),
                secondsPerTick: 0,
                controllerProgressArray: [],
                avgControlPointsPerHourArray: [],
                room: {},
                etaMemory: { rcl: room.controller!.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            } as VisualMemory;
        }

        // Get the most recent cp/hour from memory
        const ticksTracked = Memory.rooms[room.name].visual!.controllerProgressArray.length;

        if (ticksTracked < 2) {
            return "No Data";
        }

        const lastTickControllerProgress = Memory.rooms[room.name].visual!.controllerProgressArray[ticksTracked - 2];
        const currTickControllerProgress = Memory.rooms[room.name].visual!.controllerProgressArray[ticksTracked - 1];
        let pointsThisTick;

        // If lastTick > thisTick then we know that we have rolled over to the next level
        if (lastTickControllerProgress > currTickControllerProgress) {
            pointsThisTick = currTickControllerProgress;
        } else {
            pointsThisTick = currTickControllerProgress - lastTickControllerProgress;
        }

        // Calculate the rolling average and store it back in memory
        this.updateRollingAverage(pointsThisTick, room);

        // Get the number of points to next level
        const pointsToNextLevel = room.controller!.progressTotal - room.controller!.progress;

        // Get the number of ticks to next level
        const ticksToNextLevel = pointsToNextLevel / Memory.rooms[room.name].visual!.etaMemory.avgPointsPerTick;

        // Get the number of seconds to next level
        const secondsToNextLevel = ticksToNextLevel * Memory.rooms[room.name].visual!.secondsPerTick;

        // Get the formatted version of secondsToNextLevel
        return this.convertSecondsToTime(secondsToNextLevel);
    }

    /**
     * Visualize the creep stuck counter
     * @param creep Creep The creep to visualize
     */
    public static visualizeStuckCreep(creep: Creep): void {
        if (creep.memory._move === undefined || creep.memory._move.stuckCount === undefined) {
            return; // Do nothing if no stuck count
        }

        const percentStuck = creep.memory._move.stuckCount / STUCK_COUNT_LIMIT;

        let circleColor;

        if (percentStuck >= 1) {
            // Creep is stuck
            circleColor = STUCK_VISUAL_COLORS[0];
        } else if (percentStuck >= 0.75) {
            // Almost stuck
            circleColor = STUCK_VISUAL_COLORS[1];
        } else if (percentStuck >= 0.5) {
            // Halfway to stuck
            circleColor = STUCK_VISUAL_COLORS[2];
        } else if (percentStuck >= 0.25) {
            // Starting to get stuck
            circleColor = STUCK_VISUAL_COLORS[3];
        } else {
            // Not very stuck - don't draw
            return;
        }

        creep.room.visual.circle(creep.pos, { radius: 0.55, fill: circleColor, opacity: 0.1 });
    }
}
