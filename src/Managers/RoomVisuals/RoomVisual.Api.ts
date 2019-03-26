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
            lines.push("Spawning:       " + "None");
        }
        for (const creep of spawningCreep) {
            spawningRole = creep.memory.role;
            lines.push("Spawning:       " + spawningRole);
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
        const roomState: string = RoomVisualHelper.convertRoomStateToString(room.memory.roomState);
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
            lines.push("Storage:        " + room.storage.store.energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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

        const optionFlags = _.filter(Memory.flags, (flag: FlagMemory) =>
            flag.flagType ===
            (OVERRIDE_D_ROOM_FLAG || STIMULATE_FLAG) &&
            (Game.flags[flag.flagName].pos.roomName === room.name)
        );

        // Draw the text
        const lines: string[] = [];
        lines.push("");
        lines.push("Option Flags ")
        lines.push("");
        for (const of of optionFlags) {
            if (!of) {
                continue;
            }

            lines.push("Flag:   [ " + of.flagName + " ] ");
            lines.push("Type:   [ " + of.flagType + " ] ");
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

        const X_VALS = { '1': x + 3, '2': x + 6, '3': x + 9, '4': x + 12, '5': x + 15 };
        const secondsPerTick: number = RoomVisualHelper.getSecondsPerTick();
        const ticksPerHour: number = Math.floor(3600 / secondsPerTick);
        const avgControlPointsPerTick: number = RoomVisualHelper.getAverageControlPointsPerTick(10, room);
        const controlPointsPerHourEstimate: number = avgControlPointsPerTick * ticksPerHour;

        // Draw the Graph Lines
        new RoomVisual(room.name)
            .line(x, y, x, y - 7.5)    // bottom line
            .line(x, y, x + 15, y)   // left line
            .line(X_VALS['1'], y - .25, X_VALS['1'], y + .25) // tick marks
            .line(X_VALS['2'], y - .25, X_VALS['2'], y + .25)
            .line(X_VALS['3'], y - .25, X_VALS['3'], y + .25)
            .line(X_VALS['4'], y - .25, X_VALS['4'], y + .25)


        // Update the control points per hour estimate array
        if (!Memory.visual!.avgControlPointsPerHourArray) {
            Memory.visual!.avgControlPointsPerHourArray = [];
        }
        const avgControlPointsPerHourSize: number = Memory.visual.avgControlPointsPerHourArray.length;
        if (avgControlPointsPerHourSize < 5) {
            Memory.visual.avgControlPointsPerHourArray.push(controlPointsPerHourEstimate);
        }
        else {
            for (let i = 0; i < avgControlPointsPerHourSize - 1; ++i) {
                Memory.visual.avgControlPointsPerHourArray[i] = Memory.visual.avgControlPointsPerHourArray[i + 1]
            }
            Memory.visual.avgControlPointsPerHourArray[avgControlPointsPerHourSize - 1] = controlPointsPerHourEstimate;
        }

        // Get the current scale
        const maxVal: number = _.max(Memory.visual.avgControlPointsPerHourArray);
        const minVal: number = _.min(Memory.visual.avgControlPointsPerHourArray);
        const maxRange: number = 0;
        const minRange: number = 0;
        // Draw current scale on left side of graph
        // Delete the first line of the array
        // Move everything back one value, leaving the 5th slot open
        // Put the new value in the 5th slot
        // Adjust all Y values based on current scale
        // Draw all lines on graph
    }
}
