import {
    GROUPED,
    COLLATED,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
    ROLE_REMOTE_HARVESTER,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class RemoteHarvesterBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_REMOTE_HARVESTER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for remote harvester creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Remote Harvester
        let body: CreepBodyDescriptor = { carry: 8, move: 8 };
        const opts: CreepBodyOptions = { mixType: COLLATED };

        switch (tier) {
            case TIER_3: // Total Cost: 800
                body = { work: 2, carry: 5, move: 7 };
                break;

            case TIER_4: // Total Cost: 1000
                body = { work: 2, carry: 7, move: 9 };
                break;

            case TIER_5: // Total Cost: 1600
                body = { work: 2, carry: 13, move: 15 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 20 Carry, 20 Move - Total Cost: 2000
                body = { work: 2, carry: 17, move: 19 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for remote harvester creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        let creepOptions: CreepOptionsCiv = SpawnHelper.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    build: true, //
                    repair: true, //
                    wallRepair: true, //
                    fillTower: true, //
                    getFromContainer: true, //
                    getDroppedEnergy: true, //
                    fillStorage: true,
                    fillTerminal: true,
                    fillLink: true
                };

                break;
        }

        return creepOptions;
    }
}
