import { ERROR_ERROR, RoomHelper, UserException, SpawnHelper, MemoryApi, SpawnApi } from "utils/internals";

// handles spawning for every room
export class SpawnManager {
    /**
     * run the spawning for the AI for each room
     */
    public static runSpawnManager(): void {
        const ownedRooms = MemoryApi.getOwnedRooms();

        // Loop over all rooms and run the spawn for each one
        for (const room of ownedRooms) {
            this.runSpawnForRoom(room);
        }
    }

    /**
     * run spawn ai for a specific room
     * @param room the room we are running spawn for
     */
    private static runSpawnForRoom(room: Room): void {
        const openSpawn: StructureSpawn | null = SpawnApi.getOpenSpawn(room);

        // if we don't have an open spawn, return early
        if (openSpawn === null) {
            return;
        }

        // If we have a spawn, generate creep limits for the room
        SpawnApi.setCreepLimits(room);

        // add method to generate the over ride values from flags for the military creeps
        const nextCreepRole: RoleConstant | null = SpawnApi.getNextCreep(room);

        // If we are spawning a creep this tick, continue from here
        if (nextCreepRole) {
            const roomTier: TierConstant = SpawnApi.getTier(room, nextCreepRole);
            const creepBody: BodyPartConstant[] = SpawnApi.generateCreepBody(roomTier, nextCreepRole);
            const bodyEnergyCost: number = SpawnApi.getEnergyCostOfBody(creepBody);

            // Check if we even have enough energy to even spawn this potential monstrosity
            if (room.energyAvailable >= bodyEnergyCost) {
                // Get all the information we will need to spawn the next creep
                const roomState: RoomStateConstant = room.memory.roomState!;
                const name: string = SpawnHelper.generateCreepName(nextCreepRole, roomTier, room);
                const targetRoom: string = SpawnApi.getCreepTargetRoom(room, nextCreepRole, creepBody, name);
                const militarySquadOptions: StringMap = SpawnApi.generateSquadOptions(room, nextCreepRole, name);
                const homeRoom: string = SpawnApi.getCreepHomeRoom(room, nextCreepRole);
                const creepOptions: CreepOptionsCiv | CreepOptionsMili | undefined = SpawnApi.generateCreepOptions(
                    nextCreepRole,
                    roomState,
                    militarySquadOptions
                );

                // If anything in the spawn came out unexpectedly, throw an error
                if (targetRoom === "" || homeRoom === "" || !creepOptions) {
                    throw new UserException(
                        "Failure in Spawn Manager for [ " + name + " ]",
                        "Role: [ " +
                            nextCreepRole +
                            " ]\n" +
                            "homeRoom: [ " +
                            homeRoom +
                            " ]\n" +
                            "targetRoom: [ " +
                            targetRoom +
                            " ]\n" +
                            "creepOptions: [ " +
                            JSON.stringify(creepOptions) +
                            " ]\n",
                        ERROR_ERROR
                    );
                }

                // Spawn the creep
                if (
                    SpawnApi.spawnNextCreep(
                        room,
                        creepBody,
                        creepOptions!,
                        nextCreepRole!,
                        openSpawn!,
                        homeRoom,
                        targetRoom,
                        name
                    ) === OK
                ) {
                    // On successful creep spawn of a military creep, remove that role from the military spawn queue
                    SpawnApi.removeSpawnedCreepFromMiliQueue(nextCreepRole!, room);
                }
            }

            // Throw error if the energy cost is more than the capacity of the room for the room
            if (bodyEnergyCost > room.energyCapacityAvailable) {
                throw new UserException(
                    "Trying to spawn a creeep thats more expensive than we can possibly spawn",
                    "Cost: " + bodyEnergyCost + ". \nAvailable: " + room.energyCapacityAvailable + ".",
                    ERROR_ERROR
                );
            }
        }
    }
}
