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

export class LorryBodyOptsHelper implements ICreepBodyOptsHelper {

    /**
     * Generate body for lorry creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Lorry
        let body: CreepBodyDescriptor = { carry: 3, move: 3 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // There are currently no plans to use lorry before terminal becomes available
        switch (tier) {
            case TIER_1: // 3 Carry, 3 Move - Total Cost: 300
                body = { carry: 3, move: 3 };
                break;

            case TIER_2: // 6 Carry, 5 Move - Total Cost: 550
                body = { carry: 6, move: 5 };
                break;

            case TIER_3: // 8 Carry, 8 Move - Total Cost: 800
                body = { carry: 8, move: 8 };
                break;

            case TIER_5:
            case TIER_4: // 10 Carry, 10 Move - Total Cost: 1000
                body = { carry: 10, move: 10 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 20 Carry, 20 Move - Total Cost: 2000
                body = { carry: 20, move: 20 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }

    /**
     * Generate options for lorry creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
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
                    fillTower: true, //
                    fillStorage: true, //
                    fillContainer: true, //
                    fillLink: true, //
                    fillTerminal: true, //
                    fillLab: true, //
                    getFromStorage: true, //
                    getFromContainer: true, //
                    getDroppedEnergy: true, //
                    getFromTerminal: true //
                };

                break;
        }

        return creepOptions;
    }
}
