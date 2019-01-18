import RoomHelper from "../Helpers/RoomHelper";
import MemoryHelper from "../Helpers/MemoryHelper";
import MemoryHelperRoom from "../Helpers/MemoryHelper_Room"
import MemoryApi from "./Memory.Api";
import CreepDomestic from "./CreepDomestic.Api";
import { ROLE_REMOTE_RESERVER } from "utils/Constants";
import UtilHelper from "Helpers/UtilHelper";

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
        return _.sum(MemoryApi.getMyCreeps(room, (c: Creep) => c.memory.role === creepConst));
    }

    /**
     * get creep limits
     * @param room the room we want the limits for
     */
    public static getCreepLimits(room: Room): CreepLimits {

        const creepLimits: CreepLimits = {
            domesticLimits: Memory.rooms[room.name].creepLimit['remoteLimits'],
            remoteLimits: Memory.rooms[room.name].creepLimit['remoteLimits'],
            militaryLimits: Memory.rooms[room.name].creepLimit['militaryLimits']
        }

        return creepLimits;
    }

    /**
     * set domestic creep limits
     * @param room the room we want limits for
     */
    public static generateDomesticCreepLimits(room: Room): DomesticCreepLimits {
        const domesticLimits: DomesticCreepLimits = {
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

                break;

            // Beginner
            case ROOM_STATE_BEGINNER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 4;
                domesticLimits[ROLE_HARVESTER] = 4;
                domesticLimits[ROLE_WORKER] = 4;

                break;

            // Intermediate
            case ROOM_STATE_INTER:
                // Domestic Creep Definitions
                domesticLimits[ROLE_MINER] = 2;
                domesticLimits[ROLE_HARVESTER] = 3;
                domesticLimits[ROLE_WORKER] = 5;

                break;

            // Advanced
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
                domesticLimits[ROLE_LORRY] = 1;

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
        const remoteLimits: RemoteCreepLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0
        };

        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const numClaimRooms: number = RoomHelper.numClaimRooms(room);
        const numRemoteDefenders = RoomHelper.numRemoteDefenders(room);

        // I want to be able to do this.. can you make it happen?
        const numRemoteSources: number = Memory.rooms[room.name].remoteRooms.data["sources"];

        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0) {
            return remoteLimits;
        }

        // check what room state we are in
        switch (room.memory.roomState) {
            // Advanced
            case ROOM_STATE_ADVANCED:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

                break;

            // Upgrader
            case ROOM_STATE_UPGRADER:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

                break;

            // Stimulate
            case ROOM_STATE_STIMULATE:
                // 1 'Squad' per source (harvester and miner) and a reserver
                // Remote Creep Definitions
                remoteLimits[ROLE_REMOTE_MINER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_HARVESTER] = numRemoteSources;
                remoteLimits[ROLE_REMOTE_RESERVER] = numRemoteRooms;
                remoteLimits[ROLE_COLONIZER] = numClaimRooms;
                remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;

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
        const militaryLimits: MilitaryCreepLimits = {
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
        MemoryHelperRoom.updateDomesticLimits(room, this.generateDomesticCreepLimits(room));

        // Set Remote Limits to Memory
        MemoryHelperRoom.updateRemoteLimits(room, this.generateRemoteCreepLimits(room));

        // Set Military Limits to Memory
        MemoryHelperRoom.updateMilitaryLimits(room, this.generateMilitaryCreepLimits(room));
    }

    /**
     * get the first available open spawn for a room
     * @param room the room we are checking the spawn for
     */
    public static getOpenSpawn(room: Room): Structure<StructureConstant> | null {
        // get all spawns then just take the first one from it
        const allSpawns: Array<Structure<StructureConstant> | null> = MemoryApi.getStructures(
            room,
            (s: Structure<StructureConstant>) => s.structureType === STRUCTURE_SPAWN
        );

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
    public static getNextCreep(room: Room): string | null {

        /* !Important
            Note to Brock:
            There has to be a better way to do this lol
            Please refactor if you find a better way to do it.
            Or run your idea by me and I'll implement it
            I tried doing it with loops but honestly couldn't really figure it out
            But didn't spend very much time figuring it out
            So theres that
        */
        let nextCreep: string | null = null;

        // Get Limits for each creep department
        const creepLimits: CreepLimits = this.getCreepLimits(room);
        const domesticLimits: DomesticCreepLimits = creepLimits['domesticLimits'];
        const remoteLimits: RemoteCreepLimits = creepLimits['remoteLimits'];
        const militaryLimits: MilitaryCreepLimits = creepLimits['militaryLimits'];

        // Current Creep count for domestic creeps
        const minerCount: number = this.getCreepCount(room, ROLE_MINER);
        const harvesterCount: number = this.getCreepCount(room, ROLE_HARVESTER);
        const workerCount: number = this.getCreepCount(room, ROLE_WORKER);
        const powerUpgraderCount: number = this.getCreepCount(room, ROLE_POWER_UPGRADER);
        const lorryCount: number = this.getCreepCount(room, ROLE_LORRY);

        // Current Creep count for remote creeps
        const remoteMinerCount: number = this.getCreepCount(room, ROLE_REMOTE_MINER);
        const remoteHarvesterCount: number = this.getCreepCount(room, ROLE_REMOTE_HARVESTER);
        const remoteDefenderCount: number = this.getCreepCount(room, ROLE_REMOTE_DEFENDER);
        const remoteReserverCount: number = this.getCreepCount(room, ROLE_REMOTE_RESERVER);
        const remoteColonizerCount: number = this.getCreepCount(room, ROLE_COLONIZER);

        // Current Creep count for military creeps
        const zealotCount: number = this.getCreepCount(room, ROLE_ZEALOT)
        const stalkerCount: number = this.getCreepCount(room, ROLE_STALKER)
        const medicCount: number = this.getCreepCount(room, ROLE_MEDIC)

        // Check if we need a domestic creep --
        if (minerCount < domesticLimits[ROLE_MINER]) { return ROLE_MINER; }
        else if (harvesterCount < domesticLimits[ROLE_HARVESTER]) { return ROLE_HARVESTER; }
        else if (workerCount < domesticLimits[ROLE_WORKER]) { return ROLE_WORKER; }
        else if (powerUpgraderCount < domesticLimits[ROLE_POWER_UPGRADER]) { return ROLE_POWER_UPGRADER; }
        else if (lorryCount < domesticLimits[ROLE_LORRY]) { return ROLE_LORRY; }


        // Check if we need a miltary creep --
        if (remoteMinerCount < remoteLimits[ROLE_REMOTE_MINER]) { return ROLE_REMOTE_MINER; }
        else if (remoteHarvesterCount < remoteLimits[ROLE_REMOTE_HARVESTER]) { return ROLE_REMOTE_HARVESTER; }
        else if (remoteDefenderCount < remoteLimits[ROLE_REMOTE_DEFENDER]) { return ROLE_REMOTE_DEFENDER; }
        else if (remoteReserverCount < remoteLimits[ROLE_REMOTE_RESERVER]) { return ROLE_REMOTE_RESERVER; }
        else if (remoteColonizerCount < remoteLimits[ROLE_COLONIZER]) { return ROLE_COLONIZER; }


        // Check if we need a remote creep --
        if (zealotCount < militaryLimits[ROLE_ZEALOT]) { return ROLE_ZEALOT; }
        else if (stalkerCount < militaryLimits[ROLE_STALKER]) { return ROLE_STALKER; }
        else if (medicCount < militaryLimits[ROLE_MEDIC]) { return ROLE_MEDIC; }


        // Return null if we don't need to spawn anything
        return nextCreep;
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
    private static generateCreepBody(parts: BodyPartConstant[], numEach: number[]): BodyPartConstant[] {

        // Ensure that the arrays are of equal size
        if (parts.length !== numEach.length) {
            UtilHelper.throwError("Invalid parameters", "GenerateCreepBody was passed 2 differing array sizes",
                ERROR_ERROR);
            throw new Error("Body part and number of part part arrays are not of equal length.")
        }

        let creepBody: BodyPartConstant[] = [];
        let size: number = parts.length;

        // Loop over the parts and push the associated amount of parts onto the array
        for (let i = 0; i < size; ++i) {
            let currentPart: BodyPartConstant = parts[i];
            let currentCount: number = numEach[i];

            for (let j = 0; j < currentCount; ++j) {
                creepBody.push(currentPart);
            }
        }

        return creepBody;
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
