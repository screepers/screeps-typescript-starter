import MemoryApi from "../Api/Memory.Api";
import UtilHelper from "./UtilHelper";
import UserException from "utils/UserException";

export default class EmpireHelper {

    /**
     * commit a remote flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewRemoteFlag(flag: Flag): void {

        const dependentRoom: Room = Game.rooms[this.findDependentRoom(flag.pos.roomName)];
        Memory.flags[flag.name].active = true;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;

        // Create the RemoteFlagMemory object for this flag
        const remoteFlagMemory: RemoteFlagMemory = {
            active: true,
            complete: false,
            flagName: flag.name,
        };


        // If the dependent room already has this room covered, just append the flag onto it
        const existingDepedentRemoteRoomMem: RemoteRoomMemory | undefined = _.find(MemoryApi.getRemoteRooms(dependentRoom),
            (rr: RemoteRoomMemory) => rr.roomName === flag.pos.roomName
        );

        if (!existingDepedentRemoteRoomMem) {
            existingDepedentRemoteRoomMem!.flags.cache = Game.time;
            existingDepedentRemoteRoomMem!.flags.data.push(remoteFlagMemory);
        }

        // Otherwise, add a brand new memory structure onto it
        const remoteRoomMemory: RemoteRoomMemory = {
            sources: { cache: Game.time, data: 1 },
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: { cache: Game.time, data: [remoteFlagMemory] },
        };

        // ! TODO - move this into memory api into a "addRemoteRoomToMemory" or something
        // Where you pass it the memory you want and it does exactly this below, just to keep
        // Memory adding in memory api in case we change how remote rooms are structured for some reason
        dependentRoom.memory.remoteRooms.cache = Game.time;
        dependentRoom.memory.remoteRooms.data.push(remoteRoomMemory);
    }

    /**
     * commit a attack flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewAttackFlag(flag: Flag): void {
        // save the attack room into the proper memory blah blah blah
    }

    /**
     * commit a claim flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewClaimFlag(flag: Flag): void {
        // save the claim room into the proper memory blah blah blah
    }

    /**
     * commit a depedent room over-ride flag to memory
     * @param flag the flag we are commiting to memory
     */
    public static processNewDependentRoomOverrideFlag(flag: Flag): void {

        // Set all the memory values for the flag
        Memory.flags[flag.name].active = true;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
    }

    /**
     * finds the closest colonized room to support a
     * Remote/Attack/Claim room
     * Calls helper functions to decide auto or over-ride
     * @param targetRoom the room we want to support
     */
    public static findDependentRoom(targetRoom: string): string {

        // Green & White flags are considered override flags, get those and find the one that was placed most recently
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


            const shortestPath = Game.map.findRoute(shortestPathRoom.name, targetRoom) as { exit: ExitConstant; room: string; }[];
            const currentPath = Game.map.findRoute(currentRoom.name, targetRoom) as { exit: ExitConstant; room: string; }[];

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
                "We have no vision in the room you attempted to manually set as override dependent room.",
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
    public static findRallyLocation(homeRoom: Room, targetRoom: Room): RoomPosition {

        const fullPath = Game.map.findRoute(homeRoom.name, targetRoom.name) as { exit: ExitConstant; room: string; }[];

        // To prevent out of bounds, only allow room paths that have as least 2 elements (should literally never occur unless we
        // are attacking our own room (??? maybe an active defender strategy, so i won't throw an error for it tbh)
        if (fullPath.length >= 2) {
            return new RoomPosition(25, 25, homeRoom.name);
        }

        // Return the room right BEFORE the room we are attacking. This is the rally room (location is just in middle of room)
        return new RoomPosition(25, 25, fullPath[fullPath.length - 2]['room']);
    }

    /**
     * if a claim room has no flags associated with it, delete the claim room memory structure
     * @param claimRooms an array of all the claim room memory structures in the empire
     */
    public static cleanDeadClaimRooms(claimRooms: Array<ClaimRoomMemory | undefined>): void {

        // Loop over attack rooms, and if we find one with no associated flag, remove it
        for (const claimRoom in claimRooms) {
            if (claimRooms[claimRoom]!.flags.data.length === 0) {
                delete claimRooms[claimRoom];
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
            for (const flag in claimRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: ClaimFlagMemory = claimRoom!.flags.data[flag] as ClaimFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete claimRoom!.flags.data[flag];
                }
            }
        }
    }

    /**
     * if an attack room has no flags associated with it, delete the attack room memory structure
     * @param attackRooms an array of all the attack room memory structures in the empire
     */
    public static cleanDeadAttackRooms(attackRooms: Array<AttackRoomMemory | undefined>): void {

        // Loop over attack rooms, and if we find one with no associated flag, remove it
        for (const attackRoom in attackRooms) {
            if (attackRooms[attackRoom]!.flags.data.length === 0) {
                delete attackRooms[attackRoom];
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
            for (const flag in attackRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: AttackFlagMemory = attackRoom!.flags.data[flag] as AttackFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete attackRoom!.flags.data[flag];;
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
            if (remoteRooms[remoteRoom]!.flags.data.length === 0) {
                delete remoteRooms[remoteRoom];
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
            for (const flag in remoteRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: RemoteFlagMemory = remoteRoom!.flags.data[flag] as RemoteFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete remoteRoom!.flags.data[flag];
                }
            }
        }
    }
}
