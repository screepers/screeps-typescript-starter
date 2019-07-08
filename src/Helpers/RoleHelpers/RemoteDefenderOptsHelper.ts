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
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class RemoteDefenderBodyOptsHelper implements ICreepBodyOptsHelper {

    /**
     * Generate body for remote defender creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Remote Defender
        let body: CreepBodyDescriptor = { attack: 5, move: 5 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_3: // 5 Attack, 5 Move - Total Cost: 550
                body = { attack: 5, move: 5 };
                break;

            case TIER_4: //  6 Ranged Attack, 6 Move, - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;

            case TIER_5: // 8 Ranged Attack, 7 Move, 1 Heal - Total Cost: 1800
                body = { ranged_attack: 8, move: 7, heal: 1 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 8 Ranged Attack, 10 Move, 2 Heal
                body = { ranged_attack: 8, move: 10, heal: 2 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }

    /**
     * Generate options for remote defender creep
     * @param tier the tier of the room
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
                    squadSize: 1,
                    squadUUID: null,
                    rallyLocation: null,
                    rallyDone: false,
                    healer: true,
                    defender: true
                };

                break;
        }

        return creepOptions;
    }
}
