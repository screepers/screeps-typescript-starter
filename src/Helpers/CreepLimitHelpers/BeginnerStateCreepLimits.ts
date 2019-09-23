import { ROLE_MINER, ROLE_HARVESTER, ROLE_WORKER, ROOM_STATE_BEGINNER, MemoryApi, SpawnHelper } from "utils/internals";

export class BeginnerStateCreepLimits implements ICreepSpawnLimits {
    public roomState: RoomStateConstant = ROOM_STATE_BEGINNER;

    constructor() {
        const self = this;
        self.generateDomesticLimits = self.generateDomesticLimits.bind(self);
        self.generateRemoteLimits = self.generateRemoteLimits.bind(self);
    }

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

        // If we can't build a single sufficiently sized miner, handle multiple miner limits
        let minerLimits: number = MemoryApi.getSources(room.name).length;
        if (room.energyCapacityAvailable < 550) {
            const numAccessTilesToSource: number = SpawnHelper.getNumAccessTilesToSources(room);
            minerLimits = numAccessTilesToSource < 4 ? numAccessTilesToSource : 4;
        }

        // Generate Limits -------
        domesticLimits[ROLE_MINER] = minerLimits;
        domesticLimits[ROLE_HARVESTER] = 4;
        domesticLimits[ROLE_WORKER] = 4;

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

        // No remote creeps for beginner room state

        return remoteLimits;
    }
}
