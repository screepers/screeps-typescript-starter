import MemoryApi from "../Api/Memory.Api";
import UserException from "utils/UserException";
import SpawnApi from "../Api/Spawn.Api";
import {
    ZEALOT_SOLO,
    STALKER_SOLO,
    STANDARD_SQUAD,
    CLAIM_FLAG,
    REMOTE_FLAG,
    OVERRIDE_D_ROOM_FLAG,
    ERROR_WARN,
    STIMULATE_FLAG
} from "utils/Constants";
import RoomVisualHelper from "Managers/RoomVisuals/RoomVisualHelper";

export default class EmpireHelper {

    /**
     * commit a remote flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewRemoteFlag(flag: Flag): void {

        // Get the host room and set the flags memory
        const dependentRoom: Room = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst: FlagTypeConstant | undefined = this.getFlagType(flag);
        const roomName: string = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        // Create the RemoteFlagMemory object for this flag
        const remoteFlagMemory: RemoteFlagMemory = {
            active: true,
            flagName: flag.name,
            flagType: flagTypeConst
        };


        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentRemoteRoomMem: RemoteRoomMemory | undefined = _.find(MemoryApi.getRemoteRooms(dependentRoom),
            (rr: RemoteRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            });

        if (existingDepedentRemoteRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException(
                "Already working this dependent room!",
                "The room you placed the remote flag in is already being worked by " + existingDepedentRemoteRoomMem.roomName,
                ERROR_WARN);
        }

        // Otherwise, add a brand new memory structure onto it
        const remoteRoomMemory: RemoteRoomMemory = {
            sources: { cache: Game.time, data: 1 },
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [remoteFlagMemory],
            reserveTTL: 0,
        };

        MemoryApi.createEmpireAlertNode("Remote Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]", 10);
        dependentRoom.memory.remoteRooms!.push(remoteRoomMemory);
    }

    /**
     * commit a attack flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewAttackFlag(flag: Flag): void {

        // Get the host room and set the flags memory
        const dependentRoom: Room = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst: FlagTypeConstant | undefined = this.getFlagType(flag);
        const roomName: string = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        // Create the RemoteFlagMemory object for this flag
        const attackFlagMemory: AttackFlagMemory = this.generateAttackFlagOptions(flag, flagTypeConst, dependentRoom.name);


        // If the dependent room already has this room covered, just push this flag onto the existing structure
        const existingDepedentAttackRoomMem: AttackRoomMemory | undefined = _.find(MemoryApi.getAttackRooms(dependentRoom),
            (rr: AttackRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            });

        if (existingDepedentAttackRoomMem) {
            MemoryApi.createEmpireAlertNode("Attack Flag [" + flag.name + "] processed. Added to existing Host Room: [" + existingDepedentAttackRoomMem.roomName + "]", 10);
            existingDepedentAttackRoomMem.flags.push(attackFlagMemory);
            return;
        }

        // Otherwise, add a brand new memory structure onto it
        const attackRoomMemory: AttackRoomMemory = {
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [attackFlagMemory],
        };

        MemoryApi.createEmpireAlertNode("Attack Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]", 10);
        dependentRoom.memory.attackRooms!.push(attackRoomMemory);
    }

    /**
     * commit a claim flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewClaimFlag(flag: Flag): void {

        // Get the host room and set the flags memory
        const dependentRoom: Room = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst: FlagTypeConstant | undefined = this.getFlagType(flag);
        const roomName: string = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        // Create the ClaimFlagMemory object for this flag
        const claimFlagMemory: ClaimFlagMemory = {
            active: true,
            flagName: flag.name,
            flagType: flagTypeConst
        };


        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentClaimRoomMem: ClaimRoomMemory | undefined = _.find(MemoryApi.getClaimRooms(dependentRoom),
            (rr: ClaimRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            });

        if (existingDepedentClaimRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException(
                "Already working this dependent room!",
                "The room you placed the claim flag in is already being worked by " + existingDepedentClaimRoomMem.roomName,
                ERROR_WARN);
        }

        // Otherwise, add a brand new memory structure onto it
        const claimRoomMemory: ClaimRoomMemory = {
            roomName: flag.pos.roomName,
            flags: [claimFlagMemory],
        };

        MemoryApi.createEmpireAlertNode("Claim Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]", 10);
        dependentRoom.memory.claimRooms!.push(claimRoomMemory);
    }

    /**
     * commit a depedent room over-ride flag to memory
     * @param flag the flag we are commiting to memory
     */
    public static processNewDependentRoomOverrideFlag(flag: Flag): void {

        // Set all the memory values for the flag
        const flagTypeConst: FlagTypeConstant | undefined = this.getFlagType(flag);
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        MemoryApi.createEmpireAlertNode("Option Flag [" + flag.name + "] processed. Flag Type: [" + RoomVisualHelper.convertFlagTypeToString(flagTypeConst) + "]", 10);
    }

    /**
     * commit a stimulate flag to an owned room
     * @param flag the flag we are commiting to memory
     */
    public static processNewStimulateFlag(flag: Flag): void {

        // Set all the memory values for the flag
        const flagTypeConst: FlagTypeConstant | undefined = this.getFlagType(flag);
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        MemoryApi.createEmpireAlertNode("Option Flag [" + flag.name + "] processed. Flag Type: [" + RoomVisualHelper.convertFlagTypeToString(flagTypeConst) + "]", 10);
    }

    /**
     * finds the closest colonized room to support a
     * Remote/Attack/Claim room
     * Calls helper functions to decide auto or over-ride
     * @param targetRoom the room we want to support
     */
    public static findDependentRoom(targetRoom: string): string {

        // Green & White flags are considered override flags, get those and find the one that was placed most recently
        // ! - Idea for here... going to add a constant to describe each flag type, then we can make an empire api function
        // that returns the flag type, so this next line could be replaced with (flag: Flag) => this.getFlagType === OVERRIDE_FLAG
        const allOverrideFlags = MemoryApi.getAllFlags((flag: Flag) => flag.color === COLOR_GREEN && flag.secondaryColor === COLOR_WHITE);
        let overrideFlag: Flag | undefined;

        // If we don't have any d-room override flags, we don't need to worry about it and will use auto room detection
        if (allOverrideFlags.length > 0) {
            for (const flag of allOverrideFlags) {
                if (!overrideFlag) {
                    overrideFlag = flag;
                }
                else {
                    if (flag.memory.timePlaced > overrideFlag.memory.timePlaced) {
                        overrideFlag = flag;
                    }
                }
            }

            // Set the override flag as complete and call the helper to find the override room
            Memory.flags[overrideFlag!.name].complete = true;
            return this.findDependentRoomManual(overrideFlag!);
        }

        // If no override flag was found, automatically find closest dependent room
        return this.findDependentRoomAuto(targetRoom);
    }

    /**
     * Automatically come up with a dependent room
     * @param targetRoom the room we want to support
     */
    public static findDependentRoomAuto(targetRoom: string): string {

        const ownedRooms = MemoryApi.getOwnedRooms();
        let shortestPathRoom: Room | undefined;

        // Loop over owned rooms, finding the shortest path
        for (const currentRoom of ownedRooms) {

            if (!shortestPathRoom) {
                shortestPathRoom = currentRoom;
                continue;
            }


            const shortestPath = Game.map.findRoute(shortestPathRoom.name, targetRoom) as Array<{ exit: ExitConstant; room: string; }>;
            const currentPath = Game.map.findRoute(currentRoom.name, targetRoom) as Array<{ exit: ExitConstant; room: string; }>;

            // If the path is shorter, its the new canidate room
            if (currentPath.length < shortestPath.length) {
                shortestPathRoom = currentRoom;
            }
        }

        // Throw exception if no rooms were found
        if (!shortestPathRoom) {
            throw new UserException(
                "Auto-Dependent Room Finder Error",
                "No room with shortest path found to the target room.",
                ERROR_WARN
            );
        }

        return shortestPathRoom!.name;
    }

    /**
     * Manually get the dependent room based on flags
     * @param targetRoom the room we want to support
     * @param overrideFlag the flag for the selected override flag
     */
    public static findDependentRoomManual(overrideFlag: Flag): string {

        // Throw error if we have no vision in the override flag room
        // (Shouldn't happen, but user error can allow it to occur)
        if (!Game.flags[overrideFlag.name].room) {
            throw new UserException(
                "Manual Dependent Room Finding Error",
                "Flag [" + overrideFlag.name + "]. We have no vision in the room you attempted to manually set as override dependent room.",
                ERROR_ERROR
            );
        }
        return Game.flags[overrideFlag.name].room!.name;
    }

    /**
     * get the rally location for the room we are attacking
     * @param homeRoom the room we are spawning from
     * @param targetRoom the room we are attacking
     */
    public static findRallyLocation(homeRoom: string, targetRoom: string): RoomPosition {

        const fullPath = Game.map.findRoute(homeRoom, targetRoom) as Array<{ exit: ExitConstant; room: string; }>;

        // To prevent out of bounds, only allow room paths that have as least 2 elements (should literally never occur unless we
        // are attacking our own room (??? maybe an active defender strategy, so i won't throw an error for it tbh)
        if (fullPath.length <= 2) {
            return new RoomPosition(25, 25, homeRoom);
        }

        // Return the room right BEFORE the room we are attacking. This is the rally room (location is just in middle of room)
        return new RoomPosition(25, 25, fullPath[fullPath.length - 2].room);
    }

    /**
     * if a claim room has no flags associated with it, delete the claim room memory structure
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    public static cleanDeadClaimRooms(claimRooms: Array<ClaimRoomMemory | undefined>): void {

        // Loop over claim rooms, and if we find one with no associated flag, remove it
        for (const claimRoom in claimRooms) {
            if (!claimRooms[claimRoom]) {
                continue;
            }
            const claimRoomName: string = claimRooms[claimRoom]!.roomName;

            if (!claimRooms[claimRoom]!.flags[0]) {
                MemoryApi.createEmpireAlertNode("Removing Claim Room [" + claimRooms[claimRoom]!.roomName + "]", 10);

                // Get the dependent room for the attack room we are removing from memory
                const dependentRoom: Room | undefined = _.find(MemoryApi.getOwnedRooms(),
                    (room: Room) => {
                        const rr = room.memory.claimRooms;
                        return _.some(rr!, (innerRR: ClaimRoomMemory) => {
                            if (innerRR) {
                                return innerRR.roomName === claimRoomName;
                            }
                            return false;
                        });
                    });

                delete Memory.rooms[dependentRoom!.name].claimRooms![claimRoom];
            }
        }
    }

    /**
     * removes all claim room memory structures that do not have an existing flag associated with them
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    public static cleanDeadClaimRoomFlags(claimRooms: Array<ClaimRoomMemory | undefined>): void {

        // Loop over claim rooms, remote rooms, and attack rooms, and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const claimRoom of claimRooms) {
            if (!claimRoom) {
                continue;
            }

            for (const flag in claimRoom!.flags) {
                if (!claimRoom!.flags[flag]) {
                    continue;
                }

                // Tell typescript that these are claim flag memory structures
                const currentFlag: ClaimFlagMemory = claimRoom!.flags[flag] as ClaimFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    MemoryApi.createEmpireAlertNode("Removing [" + flag + "] from Claim Room [" + claimRoom!.roomName + "]", 10);
                    delete claimRoom!.flags[flag];
                }
            }
        }
    }

    /**
     * if an attack room has no flags associated with it, delete the attack room memory structure
     * @param attackRooms an array of all the attack room memory structures in the empire
     */
    public static cleanDeadAttackRooms(attackRooms: Array<AttackRoomMemory | undefined>): void {

        // Loop over remote rooms, and if we find one with no associated flag, remove it
        for (const attackRoom in attackRooms) {
            if (!attackRooms[attackRoom]) {
                continue;
            }
            const attackRoomName: string = attackRooms[attackRoom]!.roomName;

            if (!attackRooms[attackRoom]!.flags[0]) {
                MemoryApi.createEmpireAlertNode("Removing Attack Room [" + attackRooms[attackRoom]!.roomName + "]", 10);

                // Get the dependent room for the attack room we are removing from memory
                const dependentRoom: Room | undefined = _.find(MemoryApi.getOwnedRooms(),
                    (room: Room) => {
                        const rr = room.memory.attackRooms;
                        return _.some(rr!, (innerRR: AttackRoomMemory) => {
                            if (innerRR) {
                                return innerRR.roomName === attackRoomName;
                            }
                            return false;
                        });
                    });

                delete Memory.rooms[dependentRoom!.name].attackRooms![attackRoom];
            }
        }
    }

    /**
     * clean dead attack room flags from a live attack room
     */
    public static cleanDeadAttackRoomFlags(attackRooms: Array<AttackRoomMemory | undefined>): void {

        // Loop over attack rooms, and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const attackRoom of attackRooms) {
            if (!attackRoom) {
                continue;
            }

            for (const flag in attackRoom!.flags) {
                if (!attackRoom!.flags[flag]) {
                    continue;
                }

                // Tell typescript that these are claim flag memory structures
                const currentFlag: AttackFlagMemory = attackRoom!.flags[flag] as AttackFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    MemoryApi.createEmpireAlertNode("Removing [" + flag + "] from Attack Room [" + attackRoom!.roomName + "]", 10);
                    delete attackRoom!.flags[flag];;
                }
            }
        }
    }

    /**
     * if an remote room has no flags associated with it, delete the attack room memory structure
     * @param attackRooms an array of all the attack room memory structures in the empire
     */
    public static cleanDeadRemoteRooms(remoteRooms: Array<RemoteRoomMemory | undefined>): void {

        // Loop over remote rooms, and if we find one with no associated flag, remove it
        for (const remoteRoom in remoteRooms) {
            if (!remoteRooms[remoteRoom]) {
                continue;
            }
            const remoteRoomName: string = remoteRooms[remoteRoom]!.roomName;

            if (!remoteRooms[remoteRoom]!.flags[0]) {
                MemoryApi.createEmpireAlertNode("Removing Remote Room [" + remoteRooms[remoteRoom]!.roomName + "]", 10);

                // Get the dependent room for this room
                const dependentRoom: Room | undefined = _.find(MemoryApi.getOwnedRooms(),
                    (room: Room) => {
                        const rr = room.memory.remoteRooms;
                        return _.some(rr!, (innerRR: RemoteRoomMemory) => {
                            if (innerRR) {
                                return innerRR.roomName === remoteRoomName;
                            }
                            return false;
                        });
                    });

                delete Memory.rooms[dependentRoom!.name].remoteRooms![remoteRoom];
            }
        }
    }

    /**
     * removes all claim room memory structures that do not have an existing flag associated with them
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    public static cleanDeadRemoteRoomsFlags(remoteRooms: Array<RemoteRoomMemory | undefined>): void {

        // Loop over remote rooms and make sure the flag they're referencing actually exists
        // Delete the memory structure if its not associated with an existing flag
        for (const remoteRoom of remoteRooms) {
            if (!remoteRoom) {
                continue;
            }

            for (const flag in remoteRoom!.flags) {
                if (!remoteRoom!.flags[flag]) {
                    continue;
                }

                // Tell typescript that these are claim flag memory structures
                const currentFlag: RemoteFlagMemory = remoteRoom!.flags[flag] as RemoteFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    MemoryApi.createEmpireAlertNode("Removing [" + flag + "] from Remote Room Memory [" + remoteRoom!.roomName + "]", 10);
                    delete remoteRoom!.flags[flag];
                }
            }
        }
    }

    /**
     * gets the flag type for a flag
     * @param flag the flag we are checking the type for
     * @returns the flag type constant that tells you the type of flag it is
     */
    public static getFlagType(flag: Flag): FlagTypeConstant | undefined {

        let flagType: FlagTypeConstant | undefined;

        // Attack flags
        if (flag.color === COLOR_RED) {

            // Check the subtype
            switch (flag.secondaryColor) {

                // Zealot Solo
                case COLOR_BLUE:
                    flagType = ZEALOT_SOLO;
                    break;

                // Stalker Solo
                case COLOR_BROWN:
                    flagType = STALKER_SOLO;

                // Standard Squad
                case COLOR_RED:
                    flagType = STANDARD_SQUAD;
            }
        }
        // Claim Flags
        else if (flag.color === COLOR_WHITE) {
            flagType = CLAIM_FLAG;
        }
        // Option Flags
        else if (flag.color === COLOR_GREEN) {

            // Check the subtype
            switch (flag.secondaryColor) {

                // Depedent Room Override Flag
                case COLOR_WHITE:
                    flagType = OVERRIDE_D_ROOM_FLAG;
                    break;

                case COLOR_YELLOW:
                    flagType = STIMULATE_FLAG;
            }
        }
        // Remote Flags
        else if (flag.color === COLOR_YELLOW) {
            flagType = REMOTE_FLAG;
        }

        // Unknown Flag Type
        else {

            // If it isn't a valid flag type, set it to complete to flag it for deletion and throw a warning
            Memory.flags[flag.name].complete = true;
            throw new UserException(
                "Invalid flag type",
                "The flag you placed has no defined type.",
                ERROR_WARN);
        }

        return flagType;
    }

    /**
     * generate the options for an attack flag based on its type
     * @param flag the flag we are getting options for
     * @param flagTypeConst the flag type of this flag
     * @param dependentRoom the room that will be hosting this attack room
     * @returns the object for the attack flag associated memory structure
     */
    public static generateAttackFlagOptions(flag: Flag, flagTypeConst: FlagTypeConstant | undefined, dependentRoom: string): AttackFlagMemory {

        // Generate the attack flag options based on the type of flag it is
        const attackFlagMemory: AttackFlagMemory = {
            active: false,
            squadSize: 0,
            squadUUID: 0,
            rallyLocation: null,
            flagName: flag.name,
            flagType: flagTypeConst,
            currentSpawnCount: 0,
        }

        // Fill in these options based on the flag type
        switch (flagTypeConst) {

            // Zealot Solo
            case ZEALOT_SOLO:
                // We don't need to adjust the memory for this type
                break;

            // Stalker Solo
            case STALKER_SOLO:
                // We don't need to adjust memory for this type
                break;

            // Standard Squad
            case STANDARD_SQUAD:

                attackFlagMemory.squadSize = 3;
                attackFlagMemory.squadUUID = SpawnApi.generateSquadUUID();
                attackFlagMemory.rallyLocation = this.findRallyLocation(dependentRoom, flag.pos.roomName);
                break;

            // Throw a warning if we were unable to generate memory for this flag type, and set it to be deleted
            default:
                flag.memory.complete = true;
                throw new UserException(
                    "Unable to get attack flag memory for flag type " + flagTypeConst,
                    "Flag " + flag.name + " was of an invalid type for the purpose of generating attack flag memory",
                    ERROR_WARN);
        }

        return attackFlagMemory;
    }
}
