
export default class EmpireHelper {

    /**
     * commit a remote flag to memory
     * @param flag the flag we want to commit
     */
    public static processNewRemoteFlag(flag: Flag): void {
        // save the remote room into the proper memory blah blah blah
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
     * finds the closest colonized room to support a
     * Remote/Attack/Claim room
     * Calls helper functions to decide auto or over-ride
     * @param targetRoom the room we want to support
     */
    public static findDependentRoom(targetRoom: Room): string {
        // find the closest room, maybe some additional filters to make
        // sure the room is actually closest not just by distance idk
        return "";
    }

    /**
     * Automatically come up with a dependent room
     * @param targetRoom the room we want to support
     */
    public static findDependentRoomAuto(targetRoom: Room): string {
        // This will be called if theres no override in place
        return "";
    }

    /**
     * Manually get the dependent room based on flags
     * @param targetRoom the room we want to support
     */
    public static findDependentRoomManual(targetRoom: Room): string {
        // This will be called if an override is requested via flag
        return "";
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
            for (const flag of claimRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: ClaimFlagMemory = flag as ClaimFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete claimRoom!.flags.data[currentFlag.flagName];
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
            for (const flag of attackRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: AttackFlagMemory = flag as AttackFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete attackRoom!.flags.data[currentFlag.flagName];
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
            for (const flag of remoteRoom!.flags.data) {

                // Tell typescript that these are claim flag memory structures
                const currentFlag: RemoteFlagMemory = flag as RemoteFlagMemory;
                if (!Game.flags[currentFlag.flagName]) {
                    delete remoteRoom!.flags.data[currentFlag.flagName];
                }
            }
        }
    }
}
