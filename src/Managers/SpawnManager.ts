import SpawnApi from "../Api/Spawn.Api";
import MemoryApi from "../Api/Memory.Api";
import { TIER_2 } from "../utils/constants";
import MiliHelper from "Helpers/MiliHelper";
import { SpawnHelper } from "Helpers/SpawnHelper";

// handles spawning for every room
export default class SpawnManager {
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
    public static runSpawnForRoom(room: Room): void {
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
            const energyAvailable: number = room.energyAvailable;
            const roomTier: TierConstant = SpawnApi.getTier(room, nextCreepRole);
            const creepBody: BodyPartConstant[] = SpawnApi.generateCreepBody(roomTier, nextCreepRole);
            const bodyEnergyCost: number = SpawnApi.getEnergyCostOfBody(creepBody);

            // Check if we even have enough energy to even spawn this potential monstrosity
            if (energyAvailable >= bodyEnergyCost) {
                // Get all the information we will need to spawn the next creep
                const roomState: RoomStateConstant = room.memory.roomState!;
                // TODO fix target room for military creeps, attack room dissapears so we need to know where to go
                const targetRoom: string = SpawnApi.getCreepTargetRoom(room, nextCreepRole, creepBody);
                const militarySquadOptions: StringMap = SpawnApi.generateSquadOptions(room, targetRoom, nextCreepRole);
                const homeRoom: string = SpawnApi.getCreepHomeRoom(room, nextCreepRole, targetRoom);
                const creepOptions: any = SpawnApi.generateCreepOptions(
                    room,
                    nextCreepRole,
                    roomState,
                    militarySquadOptions["squadSize"],
                    militarySquadOptions["squadUUID"],
                    militarySquadOptions["rallyLocation"]
                );

                // Spawn the creep
                if (SpawnApi.spawnNextCreep(room, creepBody, creepOptions, nextCreepRole, openSpawn, homeRoom, targetRoom) === OK) {
                    // On successful creep spawn of a military creep, remove that role from the military spawn queue
                    SpawnApi.removeSpawnedCreepFromMiliQueue(nextCreepRole, room);
                }
            }
        }
    }
}
