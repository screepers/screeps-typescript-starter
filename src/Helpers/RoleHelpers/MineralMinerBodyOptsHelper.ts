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
    ROLE_MINERAL_MINER,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api";

export class MineralMinerBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_MINERAL_MINER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for mienral miner creep
     * @param tier The tier of the room
     */
    public generateCreepBody = (tier: TierConstant): BodyPartConstant[] => {
        let body: CreepBodyDescriptor = { work: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {

            case TIER_3:
            case TIER_2:
            case TIER_1:
                body = { carry: 6, move: 6 };
                break;

            case TIER_6:
            case TIER_5:
            case TIER_4:
                body = { carry: 8, move: 8 };
                break;

            case TIER_8:
            case TIER_7:
                body = { carry: 20, move: 20 }
        }

        // Generate the creep body based on the body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for miner creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions = (roomState: RoomStateConstant): CreepOptionsCiv | undefined => {
        let creepOptions: CreepOptionsCiv = SpawnHelper.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    harvestMinerals: true,
                    getFromContainer: true,
                    getFromStorage: true,
                    getFromTerminal: true,
                    fillContainer: true,
                    fillLab: true,
                    fillStorage: true,
                    fillTerminal: true
                };
                break;
        }

        return creepOptions;
    }
}
