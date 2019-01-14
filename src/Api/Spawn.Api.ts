import RoomHelper from "../Helpers/RoomHelper";
import MemoryHelper from "../Helpers/MemoryHelper";
import MemoryApi from "./Memory.Api";

/**
 * the api used by the spawn manager
 */
export default class SpawnApi {
    /**
     * get count for the specified creep
     * @param room the room we are getting the count for
     * @param creepConst the role of the creep we want
     */
    public static getCreepCount(room: Room, creepConst: any): number {

        return _.sum(MemoryApi.getMyCreeps(room,
            (c: Creep) => c.memory.role === creepConst));
    }

    /**
     * get the limit for the specified creep
     * @param room the room we are getting the limits for
     * @param creepConst the role of the creep we want
     */
    public static getCreepLimits(room: Room, creepConst: RoleConstant): CreepLimits {
        return room.memory.creepLimit[creepConst];
    }

    /**
     * set domestic creep limits
     * @param room the room we want limits for
     */
    public static generateDomesticCreepLimits(room: Room): DomesticCreepLimits {

        let domesticLimits: DomesticCreepLimits = {
            miner: 0,
            harvester: 0,
            worker: 0,
            powerUpgrader: 0,
            lorry: 0
        };


        // check what room state we are in
        switch (room.memory.roomState) {

            // Intro
            case ROOM_STATE_INTRO:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 1;
                domesticLimits[ROLE_HARVESTER] = 1;
                domesticLimits[ROLE_WORKER] = 1;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                break;

            // Beginner
            case ROOM_STATE_BEGINNER:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 4;
                domesticLimits[ROLE_HARVESTER] = 4;
                domesticLimits[ROLE_WORKER] = 4;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                break;

            // Intermediate
            case ROOM_STATE_INTER:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 5;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                break;

            //Advanced
            case ROOM_STATE_ADVANCED:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 4;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 2;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 1;
                domesticLimits[ROLE_LORRY] = 0;

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 3;
                domesticLimits[ROLE_POWER_UPGRADER] = 2;
                domesticLimits[ROLE_LORRY] = 2;

                break;

            // Seige
            case ROOM_STATE_SEIGE:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 2;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 1;

                break;

            // Nuke Inbound
            case ROOM_STATE_NUKE_INBOUND:

                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 0;
                domesticLimits[ROLE_HARVESTER] = 0;
                domesticLimits[ROLE_WORKER] = 0;
                domesticLimits[ROLE_POWER_UPGRADER] = 0;
                domesticLimits[ROLE_LORRY] = 0;

                break;
        }

        // Return the limits
        return domesticLimits;
    }

    /**
     * set remote creep limits
     * TODO - get num of remote sources .. get remote defender to roll thru on call
     * (we got shooters on deck)
     * @param room the room we want limits for
     */
    public static generateRemoteCreepLimits(room: Room): RemoteCreepLimits {

        let remoteLimits: RemoteCreepLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0
        };

        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const numClaimRooms: number = RoomHelper.numClaimRooms(room);

        // I want to be able to do this.. can you make it happen?
        const numRemoteSources: number = Memory.rooms[room.name].remoteRooms.data["sources"];

        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0) {
            return remoteLimits;
        }


        // check what room state we are in
        switch (room.memory.roomState) {

            //Advanced
            case ROOM_STATE_ADVANCED:

                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = 0;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:

                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = 0;


                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:

                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = 0;


                break;
        }

        // Return the limits
        return remoteLimits;
    }

    /**
     * set military creep limits
     * @param room the room we want limits for
     */
    public static generateMilitaryCreepLimits(room: Room): MilitaryCreepLimits {

        let militaryLimits: MilitaryCreepLimits = {
            zealot: 0,
            stalker: 0,
            medic: 0
        };


        // Check for attack flags and adjust accordingly

        // Check if we need defenders and adjust accordingly

        // Return the limits
        return militaryLimits;
    }

    /**
     * set creep limits for the room
     * @param room the room we are setting limits for
     */
    public static setCreepLimits(room: Room): void {

        // Set Domestic Limits to Memory
        Memory.rooms[room.name].creepLimit["domesticLimits"] = this.generateDomesticCreepLimits(room);

        // Set Remote Limits to Memory
        Memory.rooms[room.name].creepLimit["remoteLimits"] = this.generateRemoteCreepLimits(room);

        // Set Military Limits to Memory
        Memory.rooms[room.name].creepLimit["militaryLimits"] = this.generateMilitaryCreepLimits(room);
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): Structure<StructureConstant> | null {

        // get all spawns then just take the first one from it
        const allSpawns: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(room,
            (s: Structure<StructureConstant>) => s.structureType === STRUCTURE_SPAWN);

        // not sure about this one, i read that _.first ONLY works on arrays and will NOT work on objects
        // allSpawns[0] might be needed... just so we have solution if this ends up being a bug later lol
        // i mean i could just change it to be safe but then nobody would read this
        // so im just gonna leave it
        return _.first(allSpawns);
    }

    /**
     * get next creep to spawn
     * @param room the room we want to spawn them in
     */
    public static getNextCreep(room: Room): void {
        // brock hates empty blocks
    }


    /**
     * spawn the next creep
     * @param room the room we want to spawn them in
     * @param BodyPartConstant[] the body array of the creep
     * @param RoleConstant the role of the creep
     */
    public static spawnNextCreep(room: Room): void {
        // brock hates empty blocks
    }


    /**
     * get energy cost of creep
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    public static getEnergyCost(room: Room, roleConst: RoleConstant, tier: number): number {
        return 1;
    }


    /**
     * check what tier of this creep we are spawning
     * @param room the room we are spawning them in
     * @param RoleConstant the role of the creep
     */
    public static getTier(room: Room, roleConst: RoleConstant): number {
        return 1;
    }


    /**
     * get the memory options for this creep
     * @param room the room we are spawning it in
     * @param RoleConstant the role of the creep
     * @param tier the tier of this creep we are spawning
     */
    private static generateCreepOptions(room: Room, roleConst: RoleConstant, tier: number): void {
        // .keep
    }

    /**
     * generate a body for creeps given a specific set of paramters
     * @param
     */
    private static generateCreepBody(): BodyPartConstant[] {
        // not sure the implementation yet
        // 2 options... paramter for each body part and you just supply a number
        // but i prefer passing 2 arrays of equal length, one with body part constants
        // and one with the number of these parts you wish for. Order can be in the order you
        // make the body part constant array in, but i want some options for switching order around
        // to be customizable if possible... idk yet but this function will be much nicer than
        // manually creating the bodies
        return [WORK, WORK, MOVE];
    }

    /**
     * check if our remote room needs a remote defender
     * @param room the home room associated with the remote room
     */
    private static needRemoteDefender(room: Room): boolean {
        return false;
    }

    /**
     * get the number of active miners
     * ie miners with more than 50 TTL
     * @param room the room we are checking in
     */
    private static getActiveMiners(room: Room): number {

        // all miners with more than 50 TTL
        return 1;
    }

}
