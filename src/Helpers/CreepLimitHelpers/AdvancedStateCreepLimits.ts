import {
    ROLE_MINER,
    ROLE_HARVESTER,
    ROLE_WORKER,
    ROLE_POWER_UPGRADER,
    ROLE_LORRY,
    ROLE_REMOTE_MINER,
    ROLE_REMOTE_HARVESTER,
    ROLE_REMOTE_RESERVER,
    ROLE_COLONIZER,
    ROLE_CLAIMER,
    ROLE_REMOTE_DEFENDER,
    ROOM_STATE_ADVANCED,
    ROLE_SCOUT,
    MemoryApi,
    RoomHelper,
    SpawnHelper,
    SpawnApi,
    Normalize
} from "utils/internals";

export class AdvancedStateCreepLimits implements ICreepSpawnLimits {
    // Think of this as the "key". It searched for this name to decide that this is the class instance we want to run
    public roomState: RoomStateConstant = ROOM_STATE_ADVANCED;

    // This is needed because javascript doesn't bind functions to instances, we must manually do it lmao
    constructor() {
        const self = this;
        self.generateDomesticLimits = self.generateDomesticLimits.bind(self);
        self.generateRemoteLimits = self.generateRemoteLimits.bind(self);
    }

    // Rest should be self explainitory, ask questions if you need
    // go to the interface definition above to see how the interface is set up
    // To recreate with jobs, make a folder for jobs, make an interface for each different target type or job type
    // implement a doWork and a travelTo for each of these
    // then replace the switch statement with the for loop search for the correct type, and call the doWork or travelTo on it
    // The creep manager will still just have creepapi.doWork, but that function will contain the search for the class we want

    /**
     * generate the domestic limits for the room
     * @param room the room we are setting the limits for
     */
    public generateDomesticLimits(room: Room): DomesticCreepLimits {
        const domesticLimits: DomesticCreepLimits = {
            miner: 0,
            harvester: 0,
            worker: 0,
            powerUpgrader: 0,
            lorry: 0
        };

        const numLorries: number = SpawnHelper.getLorryLimitForRoom(room, room.memory.roomState!);
        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const minerLimits: number = MemoryApi.getSources(room.name).length;
        let numHarvesters: number = numRemoteRooms === 0 ? 1 : 2;

        // [Special Case], if we recovered a room and only have 1 harvester (they would be too small to keep up with room)
        if (numHarvesters === 1 && RoomHelper.excecuteEveryTicks(40)) {
            const harvester: Creep | undefined = _.find(
                MemoryApi.getMyCreeps(room.name, (c: Creep) => c.memory.role === ROLE_HARVESTER)
            );
            if (harvester) {
                if (SpawnApi.getEnergyCostOfBody(Normalize.convertCreepBodyToBodyPartConstant(harvester.body)) <= 300) {
                    numHarvesters = 2;
                }
            }
        }

        // Generate Limits --------
        domesticLimits[ROLE_MINER] = minerLimits;
        domesticLimits[ROLE_HARVESTER] = numHarvesters;
        domesticLimits[ROLE_WORKER] = 3;
        domesticLimits[ROLE_POWER_UPGRADER] = 0;
        domesticLimits[ROLE_LORRY] = numLorries;

        // temp for testing
        domesticLimits[ROLE_SCOUT] = 0;

        return domesticLimits;
    }

    /**
     * generate the remote limits for the room
     * @param room the room we are setting the limits for
     */
    public generateRemoteLimits(room: Room): RemoteCreepLimits {
        const remoteLimits: RemoteCreepLimits = {
            remoteMiner: 0,
            remoteHarvester: 0,
            remoteReserver: 0,
            remoteColonizer: 0,
            remoteDefender: 0,
            claimer: 0
        };

        const numRemoteRooms: number = RoomHelper.numRemoteRooms(room);
        const numClaimRooms: number = RoomHelper.numClaimRooms(room);
        // If we do not have any remote rooms, return the initial remote limits (Empty)
        if (numRemoteRooms <= 0 && numClaimRooms <= 0) {
            return remoteLimits;
        }
        // Gather the rest of the data only if we have a remote room or a claim room
        const numRemoteDefenders: number = RoomHelper.numRemoteDefenders(room);
        const numRemoteSources: number = RoomHelper.numRemoteSources(room);
        const numCurrentlyUnclaimedClaimRooms: number = RoomHelper.numCurrentlyUnclaimedClaimRooms(room);

        // Generate Limits -----
        remoteLimits[ROLE_REMOTE_MINER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(
            ROLE_REMOTE_MINER,
            numRemoteSources
        );
        remoteLimits[ROLE_REMOTE_HARVESTER] = SpawnHelper.getLimitPerRemoteRoomForRolePerSource(
            ROLE_REMOTE_HARVESTER,
            numRemoteSources
        );
        remoteLimits[ROLE_REMOTE_RESERVER] = SpawnHelper.getRemoteReserverLimitForRoom(room);
        remoteLimits[ROLE_COLONIZER] = numClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_COLONIZER);
        remoteLimits[ROLE_REMOTE_DEFENDER] = numRemoteDefenders;
        remoteLimits[ROLE_CLAIMER] =
            numCurrentlyUnclaimedClaimRooms * SpawnHelper.getLimitPerClaimRoomForRole(ROLE_CLAIMER);

        return remoteLimits;
    }
}
