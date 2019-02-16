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

        const openSpawn: Structure<StructureConstant> | null = SpawnApi.getOpenSpawn(room);
        // get tier

        // if we don't have an open spawn, return early
        if (openSpawn === null) {
            return;
        }

        // add method to generate the over ride values from flags for the military creeps
        const creepOptions: CreepOptionsCiv | CreepOptionsMili;
        const energyAvailable: number = room.energyAvailable;
        const creepBody: BodyPartConstant[] = SpawnApi.generateCreepBody()
    }
}
