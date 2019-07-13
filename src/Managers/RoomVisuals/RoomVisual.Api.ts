import RoomVisualHelper from "./RoomVisualHelper";
import MemoryApi from "Api/Memory.Api";
import {
    ROLE_MINER,
    ROLE_CLAIMER,
    ROLE_COLONIZER,
    ROLE_HARVESTER,
    ROLE_LORRY,
    ROLE_REMOTE_HARVESTER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_RESERVER,
    ROLE_WORKER,
    ROLE_POWER_UPGRADER,
    OVERRIDE_D_ROOM_FLAG,
    STIMULATE_FLAG
} from "utils/constants";
import { ROOM_OVERLAY_GRAPH_ON } from "utils/config";

// Api for room visuals
export default class RoomVisualApi {

    /**
     * draws the information that is empire wide (will be same for every room)
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createEmpireInfoVisual(room: Room, x: number, y: number): number {

        // Get all the information we will need to display in the box
        const usedCpu: number = Game.cpu.getUsed();
        const cpuLimit: number = Game.cpu['limit'];
        const bucket: number = Game.cpu['bucket'];
        const BUCKET_LIMIT: number = 10000;
        const gclProgress: number = Game.gcl['progress'];
        const gclTotal: number = Game.gcl['progressTotal'];

        const cpuPercent = Math.floor((usedCpu / cpuLimit * 100) * 10) / 10;
        const bucketPercent = Math.floor((bucket / BUCKET_LIMIT * 100) * 10) / 10;
        const gclPercent = Math.floor((gclProgress / gclTotal * 100) * 10) / 10;

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Empire Info")
        lines.push("");
        lines.push("CPU:   " + cpuPercent + "%");
        lines.push("BKT:   " + bucketPercent + "%");
        lines.push("GCL:   " + gclPercent + "%");
        lines.push("LVL:    " + Game.gcl['level']);
        lines.push("");
        lines.push("Viewing:  [ " + room.name + " ]");
        RoomVisualHelper.multiLineText(lines, x, y, room.name, true);

        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 7.5, y + lines.length - 1)    // bottom line
            .line(x - 1, y - 1, x + 7.5, y - 1)                  // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1)   // left line
            .line(x + 7.5, y - 1, x + 7.5, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     * draws the information of creep limits and currently living members
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createCreepCountVisual(room: Room, x: number, y: number): number {

        // Get the info we need to display
        const creepsInRoom = MemoryApi.getMyCreeps(room.name);
        const creepLimits = MemoryApi.getCreepLimits(room);
        const roles: StringMap = {
            miner: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_MINER).length,
            harvester: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_HARVESTER).length,
            worker: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_WORKER).length,
            lorry: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_LORRY).length,
            powerUpgrader: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_POWER_UPGRADER).length,
            remoteMiner: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_REMOTE_MINER).length,
            remoteReserver: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_REMOTE_RESERVER).length,
            remoteHarvester: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_REMOTE_HARVESTER).length,
            claimer: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_CLAIMER).length,
            colonizer: _.filter(creepsInRoom, (c: Creep) => c.memory.role === ROLE_COLONIZER).length
        };
        const spawningCreep: Creep[] = _.filter(MemoryApi.getMyCreeps(room.name), (c: Creep) => c.spawning);
        let spawningRole: string;
        const lines: string[] = [];
        lines.push("");
        lines.push("Creep Info");
        lines.push("");
        if (spawningCreep.length === 0) {
            lines.push("Spawning: " + "None");
        }
        for (const creep of spawningCreep) {
            spawningRole = creep.memory.role;
            lines.push("Spawning: [ " + spawningRole + " ]");
        }
        lines.push("Creeps in Room:     " + MemoryApi.getCreepCount(room));

        if (creepLimits['domesticLimits']) {

            // Add creeps to the lines array
            if (creepLimits.domesticLimits.miner > 0) {
                lines.push("Miners:     " + roles[ROLE_MINER] + " / " + creepLimits.domesticLimits.miner);
            }
            if (creepLimits.domesticLimits.harvester > 0) {
                lines.push("Harvesters:     " + roles[ROLE_HARVESTER] + " / " + creepLimits.domesticLimits.harvester);
            }
            if (creepLimits.domesticLimits.worker > 0) {
                lines.push("Workers:     " + roles[ROLE_WORKER] + " / " + creepLimits.domesticLimits.worker);
            }
            if (creepLimits.domesticLimits.lorry > 0) {
                lines.push("Lorries:    " + roles[ROLE_LORRY] + " / " + creepLimits.domesticLimits.lorry);
            }
            if (creepLimits.domesticLimits.powerUpgrader > 0) {
                lines.push("Power Upgraders:    " + roles[ROLE_POWER_UPGRADER] + " / " + creepLimits.domesticLimits.powerUpgrader);
            }
        }

        if (creepLimits['remoteLimits']) {

            if (creepLimits.remoteLimits.remoteMiner > 0) {
                lines.push("Remote Miners:      " + roles[ROLE_REMOTE_MINER] + " / " + creepLimits.remoteLimits.remoteMiner);
            }
            if (creepLimits.remoteLimits.remoteHarvester > 0) {
                lines.push("Remote Harvesters:    " + roles[ROLE_REMOTE_HARVESTER] + " / " + creepLimits.remoteLimits.remoteHarvester);
            }
            if (creepLimits.remoteLimits.remoteReserver > 0) {
                lines.push("Remote Reservers:    " + roles[ROLE_REMOTE_RESERVER] + " / " + creepLimits.remoteLimits.remoteReserver);
            }
            if (creepLimits.remoteLimits.remoteColonizer > 0) {
                lines.push("Remote Colonizers:    " + roles[ROLE_COLONIZER] + " / " + creepLimits.remoteLimits.remoteColonizer);
            }
            if (creepLimits.remoteLimits.claimer > 0) {
                lines.push("Claimers:       " + roles[ROLE_CLAIMER] + " / " + creepLimits.remoteLimits.claimer);
            }
        }

        lines.push("");
        RoomVisualHelper.multiLineText(lines, x, y, room.name, true);

        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 10, y + lines.length - 1)    // bottom line
            .line(x - 1, y - 1, x + 10, y - 1)                  // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1)   // left line
            .line(x + 10, y - 1, x + 10, y + lines.length - 1);  // right line

        // Return the end of this box
        return y + lines.length;
    }

    /**
     * draws the information of the room state
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createRoomInfoVisual(room: Room, x: number, y: number): number {

        // Get the info we need
        const roomState: string = RoomVisualHelper.convertRoomStateToString(room.memory.roomState!);
        const level: number = room.controller!.level;
        const controllerProgress: number = room.controller!.progress;
        const controllerTotal: number = room.controller!.progressTotal;
        const controllerPercent: number = Math.floor((controllerProgress / controllerTotal * 100) * 10) / 10;
        const defconLevel: number = room.memory.defcon;

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Room Info");
        lines.push("");
        lines.push("Room State:     " + roomState);
        lines.push("Room Level:     " + level);
        lines.push("Progress:         " + controllerPercent + "%");
        lines.push("DEFCON:         " + defconLevel);
        if (room.storage) {
            // Regex adds commas
            lines.push("Storage:         " + room.storage.store.energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        if (room.terminal) {
            // Regex adds commas
            lines.push("Terminal:       " + room.terminal.store.energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        // Adding this disclaimer, beacuse some of the information you need is actually calculated in the graph function
        // Consider decoupling these so you could use them independently
        if (ROOM_OVERLAY_GRAPH_ON) {
            // ! Disabled due to error in calculations.
            // TODO Fix this function
            // lines.push("Est TTL:        " + RoomVisualHelper.getEstimatedTimeToNextLevel(room));
        }
        lines.push("");
        RoomVisualHelper.multiLineText(lines, x, y, room.name, true);

        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 1, y + lines.length - 1, x + 10, y + lines.length - 1)    // bottom line
            .line(x - 1, y - 1, x + 10, y - 1)                  // top line
            .line(x - 1, y - 1, x - 1, y + lines.length - 1)   // left line
            .line(x + 10, y - 1, x + 10, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     * draws the information for remote flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createRemoteFlagVisual(room: Room, x: number, y: number): number {

        const dependentRemoteRooms: Array<RemoteRoomMemory | undefined> = MemoryApi.getRemoteRooms(room);

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Remote Rooms ")
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }

            lines.push("Room:   [ " + dr!.roomName + " ] ");
            lines.push("Flag:   [ " + dr!.flags[0].flagName + " ] ");
            lines.push("");
        }

        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Remote Rooms ");
            lines.push("");
        }
        RoomVisualHelper.multiLineText(lines, x, y, room.name, false);

        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1)    // bottom line
            .line(x - 10, y - 1, x + .25, y - 1)                  // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1)   // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     * draws the information for claim flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createClaimFlagVisual(room: Room, x: number, y: number): number {

        const dependentRemoteRooms: Array<ClaimRoomMemory | undefined> = MemoryApi.getClaimRooms(room);

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Claim Rooms ")
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }

            lines.push("Room:   [ " + dr!.roomName + " ] ");
            lines.push("Flag:   [ " + dr!.flags[0].flagName + " ] ");
            lines.push("");
        }

        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Claim Rooms ");
            lines.push("");
        }
        RoomVisualHelper.multiLineText(lines, x, y, room.name, false);

        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1)    // bottom line
            .line(x - 10, y - 1, x + .25, y - 1)                  // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1)   // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     * draws the information for attack flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createAttackFlagVisual(room: Room, x: number, y: number): number {

        const dependentRemoteRooms: Array<AttackRoomMemory | undefined> = MemoryApi.getAttackRooms(room);
        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Attack Rooms ")
        lines.push("");
        for (const dr of dependentRemoteRooms) {
            if (!dr) {
                continue;
            }

            lines.push("Room:   [ " + dr!.roomName + " ] ");
            for (const flag of dr!.flags) {
                if (!flag) {
                    continue;
                }
                lines.push("Flag:   [ " + flag.flagName + " ] ");
                lines.push("Type:   [ " + RoomVisualHelper.convertFlagTypeToString(flag.flagType) + " ]");
            }
            lines.push("");
        }

        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Attack Rooms ");
            lines.push("");
        }
        RoomVisualHelper.multiLineText(lines, x, y, room.name, false);

        // Draw the box around the text
        // Draw a box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1)    // bottom line
            .line(x - 10, y - 1, x + .25, y - 1)                  // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1)   // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     * draws the information for option flags
     * @param room the room we are displaying it in
     * @param x the x coord for the visual
     * @param y the y coord for the visual
     */
    public static createOptionFlagVisual(room: Room, x: number, y: number): number {

        const allFlagsMemory: FlagMemory[] = _.map(Game.flags, (flag: Flag) => flag.memory);
        const optionFlags: FlagMemory[] = _.filter(allFlagsMemory,
            (flag: FlagMemory) => (flag.flagType === OVERRIDE_D_ROOM_FLAG) || flag.flagType === STIMULATE_FLAG
        );

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Option Flags ")
        lines.push("");
        for (const optionFlag in optionFlags) {
            if (!optionFlags[optionFlag]) {
                continue;
            }

            lines.push("Flag:   [ " + optionFlags[optionFlag].flagName + " ] ");
            lines.push("Type:   [ " + RoomVisualHelper.convertFlagTypeToString(optionFlags[optionFlag].flagType) + " ] ");
            lines.push("");
        }

        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Option Flags ");
            lines.push("");
        }
        RoomVisualHelper.multiLineText(lines, x, y, room.name, false);

        // Draw the box around the text
        new RoomVisual(room.name)
            .line(x - 10, y + lines.length - 1, x + .25, y + lines.length - 1)    // bottom line
            .line(x - 10, y - 1, x + .25, y - 1)                  // top line
            .line(x - 10, y - 1, x - 10, y + lines.length - 1)   // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }

    /**
     *
     * @param room the room we are creating the visual for
     * @param x the x value for the starting point of the graph
     * @param y the y value for the starting point of the graph
     */
    public static createUpgradeGraphVisual(room: Room, x: number, y: number): void {

        const textColor = '#bab8ba';
        const X_VALS: GraphTickMarkMemory[] = [
            { 'start': x, 'end': x + 3 },       // 0
            { 'start': x + 3, 'end': x + 6 },   // 1
            { 'start': x + 6, 'end': x + 9 },   // 2
            { 'start': x + 9, 'end': x + 12 },  // 3
            { 'start': x + 12, 'end': x + 15 }, // 4
        ];
        const Y_SCALE = 7.5;
        const X_SCALE = 15;
        const secondsPerTick: number = RoomVisualHelper.getSecondsPerTick(room);
        const ticksPerHour: number = Math.floor(3600 / secondsPerTick);
        const avgControlPointsPerTick: number = RoomVisualHelper.getAverageControlPointsPerTick(25, room);
        const controlPointsPerHourEstimate: number = avgControlPointsPerTick * ticksPerHour;

        // Make sure visual memory exists
        if (!Memory.rooms[room.name].visual) {
            Memory.rooms[room.name].visual = {
                avgControlPointsPerHourArray: [],
                controllerProgressArray: [],
                time: 0,
                secondsPerTick: 0,
                room: {},
                etaMemory: { rcl: room.controller!.level, avgPointsPerTick: 0, ticksMeasured: 0 }
            }
        }

        const avgControlPointsPerHourSize: number = Memory.rooms[room.name].visual!.avgControlPointsPerHourArray.length;
        if (avgControlPointsPerHourSize < 5) {
            Memory.rooms[room.name].visual!.avgControlPointsPerHourArray.push(controlPointsPerHourEstimate);
        }
        else {
            for (let i = 0; i < avgControlPointsPerHourSize - 1; ++i) {
                Memory.rooms[room.name].visual!.avgControlPointsPerHourArray[i] = Memory.rooms[room.name].visual!.avgControlPointsPerHourArray[i + 1]
            }
            Memory.rooms[room.name].visual!.avgControlPointsPerHourArray[avgControlPointsPerHourSize - 1] = controlPointsPerHourEstimate;
        }

        // Collect values and functions needed to draw the lines on the graph
        const minVal: number = _.min(Memory.rooms[room.name].visual!.avgControlPointsPerHourArray);
        const maxVal: number = _.max(Memory.rooms[room.name].visual!.avgControlPointsPerHourArray);
        const minRange: number = minVal * .75;
        const maxRange: number = maxVal * 1.25;
        const getY2Coord = (raw: number) => {
            const range: number = maxRange - minRange;
            const offset: number = raw - minRange;
            const percentage: number = offset / range;
            return percentage * Y_SCALE;
        };

        // Get the scale for the graph
        const displayMinRange: string = RoomVisualHelper.convertRangeToDisplayVal(minRange).toString();
        const displayMaxRange: string = RoomVisualHelper.convertRangeToDisplayVal(maxRange).toString();

        // Draw the graph outline and the scale text
        new RoomVisual(room.name)
            .line(x, y, x, y - Y_SCALE)    // bottom line
            .line(x, y, x + X_SCALE, y)   // left line
            .line(X_VALS[1].start, y - .25, X_VALS[1].start, y + .25) // tick marks
            .line(X_VALS[2].start, y - .25, X_VALS[2].start, y + .25)
            .line(X_VALS[3].start, y - .25, X_VALS[3].start, y + .25)
            .line(X_VALS[4].start, y - .25, X_VALS[4].start, y + .25)
            .text(displayMaxRange, x - 2.2, y - Y_SCALE + .5, {
                align: 'left',
                color: textColor,
                opacity: .8,
                font: ' .7 Trebuchet MS'
            })
            .text(displayMinRange, x - 2.2, y, {
                align: 'left',
                color: textColor,
                opacity: .8,
                font: ' .7 Trebuchet MS'
            });

        // Draw the lines for the graph
        let startCoord: number = 0;
        let endCoord: number = 0;
        for (let i = 0; i < avgControlPointsPerHourSize; ++i) {
            // Set the initial previous and next coordinate (first line will always be flat)
            if (i === 0) {
                startCoord = getY2Coord(Memory.rooms[room.name].visual!.avgControlPointsPerHourArray[i]);
                endCoord = startCoord;
            }
            endCoord = getY2Coord(Memory.rooms[room.name].visual!.avgControlPointsPerHourArray[i]);
            new RoomVisual(room.name)
                .line(X_VALS[i].start, y - startCoord, X_VALS[i].end, y - endCoord)
                .circle(X_VALS[i].end, y - endCoord);

            startCoord = endCoord;
        }
    }

    /**
     * display messages and handle managing the data structure that holds him
     * @param room the room we are creating the visual for
     * @param x the x value for the visual
     * @param y the y value for the visual
     */
    public static createMessageBoxVisual(room: Room, x: number, y: number): number {

        // Make sure the message structure exists in memory
        if (!Memory.empire.alertMessages) {
            Memory.empire.alertMessages = [];
        }

        // Draw the title
        const lines: string[] = [];
        lines.push("");
        lines.push("Alerts ")
        lines.push("");

        // Remove expired messages and add valid messages to the lines array
        const newArray: AlertMessageNode[] = [];
        let largestMessage: number = 0;
        for (const i in Memory.empire.alertMessages) {
            const messageNode: AlertMessageNode = Memory.empire.alertMessages[i];
            const currentTick: number = Game.time;

            if (!(currentTick - messageNode.tickCreated >= messageNode.expirationLimit)) {
                newArray.push(messageNode);
                lines.push(messageNode.message);
                lines.push("");
                largestMessage = largestMessage < messageNode.message.length ? messageNode.message.length : largestMessage;
            }
        }
        Memory.empire.alertMessages = newArray;

        // If no remote rooms, print none
        if (lines.length === 3) {
            lines.push("No Current Alerts ");
            lines.push("");
        }
        RoomVisualHelper.multiLineText(lines, x, y, room.name, false);

        // Draw the box around the text
        largestMessage = (largestMessage / 2.5) < 10 ? 10 : (largestMessage / 2.5);
        new RoomVisual(room.name)
            .line(x - largestMessage, y + lines.length - 1, x + .25, y + lines.length - 1)    // bottom line
            .line(x - largestMessage, y - 1, x + .25, y - 1)                  // top line
            .line(x - largestMessage, y - 1, x - largestMessage, y + lines.length - 1)   // left line
            .line(x + .25, y - 1, x + .25, y + lines.length - 1);  // right line

        // Return where the next box should start
        return y + lines.length;
    }
}
