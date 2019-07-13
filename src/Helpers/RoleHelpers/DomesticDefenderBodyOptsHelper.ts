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
    ROLE_DOMESTIC_DEFENDER,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class DomesticDefenderBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_DOMESTIC_DEFENDER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * generate body for domestic defender creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Stalker
        let body: CreepBodyDescriptor = { attack: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 2 Attack, 2 Move - Total Cost: 260
                body = { attack: 2, move: 2 };
                break;

            case TIER_2: // 3 Attack, 2 Move - Total Cost: 340
                body = { attack: 3, move: 2 };
                break;

            case TIER_3: // 5 Attack, 5 Move - Total Cost: 650
                body = { attack: 5, move: 5 };
                break;

            case TIER_4: // 8 Attack, 8 Move - Total Cost: 880
                body = { attack: 8, move: 8 };
                break;

            case TIER_5: // 10 Attack, 10 Move - Total Cost: 1300
                body = { attack: 10, move: 10 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 15 Attack, 15 Move - Total Cost: 1950
                body = { attack: 15, move: 15 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * generate options for domestic defender creep
     * @param roomState the room state for the room spawning it
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsMili | undefined {
        let creepOptions: CreepOptionsMili = SpawnHelper.getDefaultCreepOptionsMili();

        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
            case ROOM_STATE_INTER:
            case ROOM_STATE_ADVANCED:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    squadSize: 0,
                    squadUUID: null,
                    rallyLocation: null,
                    defender: true
                };

                break;
        }

        return creepOptions;
    }
}
