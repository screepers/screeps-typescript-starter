import RoomHelper from "Helpers/RoomHelper";
import { SpawnHelper } from "Helpers/SpawnHelper";
import {
    domesticRolePriority,
    militaryRolePriority,
    remoteRolePriority,
    ROLE_COLONIZER,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_RESERVER,
    ROLE_LORRY,
    ROLE_HARVESTER,
    ROLE_MEDIC,
    ROLE_MINER,
    ROLE_POWER_UPGRADER,
    ROLE_REMOTE_DEFENDER,
    ROLE_REMOTE_HARVESTER,
    ROLE_STALKER,
    ROLE_WORKER,
    ROLE_ZEALOT,
    GROUPED,
    COLLATED,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_SEIGE,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8
} from "utils/Constants";
import SpawnApi from "../Api/Spawn.Api";

// handles spawning for every room
export default class SpawnManager {
    /**
     * run the spawning for the AI for each room
     */
    public static runSpawnManager(): void {
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
                const roomState: RoomStateConstant = room.memory.roomState;
                const militarySquadOptions: StringMap = SpawnApi.generateSquadOptions(room);
                const targetRoom: string = SpawnApi.getCreepTargetRoom(room);
                const homeRoom: string = SpawnApi.getCreepHomeRoom(room);
                const creepOptions: any = SpawnApi.generateCreepOptions(
                    room,
                    nextCreepRole,
                    roomState,
                    militarySquadOptions["squadSize"],
                    militarySquadOptions["squadUUID"],
                    militarySquadOptions["rallyLocation"]
                );

                // Spawn the creep
                SpawnApi.spawnNextCreep(room, creepBody, creepOptions, nextCreepRole, openSpawn, homeRoom, targetRoom);
            }
        }
    }
}

// Current todo to finish Spawning ------
/*
            getCreepTargetRoom()
            We need to come up with a way to figure out what room a remote/military creep
            needs to go to.
            My idea for this is to create a function in SpawnApi that does precisely this.
            Using remote room for example let say we have 2 remote rooms and want to spawn a remote miner:
            The function will get both remote rooms and add their names to an array
            We will get every living creep that is a remote miner and loop over them
            we get the remtoe room that has the least amount of remote miners that consider them a target room
            we return this room as the creeps target room
            If they are all the same value, we just select the closeset one potentially

            fill out generateSquadOptions
            This one is a little simpler as it will just find the attackRoom in the spawning room's memory
            (this will be the same room found in the previous function btw, so this will have to come second)
            Then it just scrapes the values from the memory object.. easy enough

            complete getCreepHomeRoom to handle colonizers (it might be literally as easy as calling the getCreepTargetRoom
            function from that method if its a remote colonizer)
            When we start handling empire level stuff like inter-room assistance then we can add to it then

            Thats all I can think of, add to this if you think of anything. But I believe once the above cases
            are handled that spawn is completely functional. We will obviously be tweaking numbers later once we are
            implementing the code base in game. biggest one i can think of is when we need lorries to spawn. Like we will
            def have to go back and decide for cases for lorries/more workers/etc to spawn later and we can add it into
            spawn api on like get limits (so we avoid directly changing the limits from wherever we are working out of)
            We will probably just have like a getLorryLimit function that it calls to decide all of this stuff, similar to
            how remoteDefenders are handled since they are also a special case
        */
