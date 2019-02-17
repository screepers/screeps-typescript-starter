import RoomHelper from "Helpers/RoomHelper";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "../Api/Spawn.Api";

// handles spawning for every room
export default class SpawnManager {

    /**
     * run the spawning for the AI for each room
     */
    public static runSpawnManager(): void {

        // loop over each room
        // check if we have an open spawn
        // get next creep to spawn if any
        // get creep options, memory, and body
        // spawn the creep if we have the energy

        const ownedRooms = _.filter(Game.rooms, (room: Room) => RoomHelper.isOwnedRoom(room));

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
        // get tier

        // if we don't have an open spawn, return early
        if (openSpawn === null) {
            return;
        }

        // add method to generate the over ride values from flags for the military creeps
        const nextCreepRole: RoleConstant | null = SpawnApi.getNextCreep(room);

        // If we are spawning a creep this tick, continue from here
        if (nextCreepRole) {

            // Get all the information we will need to spawn the next creep
            const energyAvailable: number = room.energyAvailable;
            const roomTier: TierConstant = SpawnApi.getTier(room, nextCreepRole);
            const creepBody: BodyPartConstant[] = SpawnApi.generateCreepBody(roomTier, nextCreepRole);
            const roomState: RoomStateConstant = room.memory.roomState;
            const militarySquadOptions: StringMap = SpawnApi.generateSquadOptions(room);
            const creepOptions: any = SpawnApi.generateCreepOptions(room, nextCreepRole, roomState);
            const targetRoom: string = SpawnApi.getCreepTargetRoom(room);

            // Spawn the creep
            SpawnApi.spawnNextCreep(
                room,
                creepBody,
                creepOptions,
                nextCreepRole,
                openSpawn,
                targetRoom);
        }
    }
}
