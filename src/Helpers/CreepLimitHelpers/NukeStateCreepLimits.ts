import {
    ROOM_STATE_NUKE_INBOUND
} from "utils/constants";
<<<<<<< HEAD
import RoomHelper from "Helpers/RoomHelper";
import { SpawnHelper } from "Helpers/SpawnHelper";
=======
>>>>>>> 3b9a79ff4821b8c9229b503dc7bd8c759c3fc397

export class NukeStateCreepLimits implements ICreepSpawnLimits {

    public roomState: RoomStateConstant = ROOM_STATE_NUKE_INBOUND;

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

        // If nuke is inbound, do not spawn additional creeps

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

        // If nuke is inbound, ditch remote rooms for time being

        return remoteLimits;
    }
}
