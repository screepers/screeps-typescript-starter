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
import SpawnApi from "Api/Spawn.Api";

export class HarvesterBodyOptsHelper implements ICreepBodyOptsHelper {

    /**
     * Generate body for Harvester creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for harvester
        let body: CreepBodyDescriptor = { work: 1, carry: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2: // 2 Work, 4 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 4, move: 3 };
                break;

            case TIER_3: // 2 Work, 6 Carry, 6 Move - Total Cost: 800
                body = { work: 2, carry: 7, move: 5 };
                break;

            case TIER_4: // 2 Work, 11 Carry, 11 Move - Total Cost: 1300
                body = { carry: 16, move: 8 };
                break;

            case TIER_6:
            case TIER_5: // 2 Work, 16 Carry, 16 Move - Total Cost: 1800
                body = { carry: 24, move: 12 };
                break;

            case TIER_8:
            case TIER_7: // 2 Work, 20 Carry, 20 Move - Total Cost: 2200
                body = { carry: 28, move: 14 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.getCreepBody(body, opts);
    }

    /**
     * Generate options for harvester creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        let creepOptions: CreepOptionsCiv = SpawnHelper.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO:
                creepOptions = {
                    fillSpawn: true,
                    fillExtension: true,
                    fillStorage: true,
                    fillTerminal: true,
                    getDroppedEnergy: true
                };
                break;

            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    fillSpawn: true, //
                    fillExtension: true,
                    fillTerminal: true,
                    fillStorage: true,
                    getDroppedEnergy: true //
                };

                break;

            case ROOM_STATE_INTER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    fillSpawn: true, //
                    fillExtension: true,
                    fillTerminal: true,
                    fillStorage: true,
                    getFromContainer: true, //
                    getDroppedEnergy: true //
                };

                break;

            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    fillStorage: true, //
                    fillTerminal: true,
                    fillSpawn: true, //
                    fillExtension: true,
                    getFromStorage: true, //
                    getFromContainer: true, //
                    getDroppedEnergy: true, //
                    getFromTerminal: true //
                };

                break;

            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    fillStorage: true, //
                    fillTerminal: true,
                    fillExtension: true,
                    fillSpawn: true,
                    getFromStorage: true, //
                    getDroppedEnergy: true, //
                    getFromTerminal: true //
                };

                break;
        }

        return creepOptions;
    }
}
