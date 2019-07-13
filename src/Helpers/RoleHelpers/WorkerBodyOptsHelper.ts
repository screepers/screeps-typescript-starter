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
    ROLE_WORKER,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class WorkerBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_WORKER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for worker creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Worker
        let body: CreepBodyDescriptor = { work: 1, carry: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Work, 2 Carry, 2 Move - Total Cost: 300
                body = { work: 1, carry: 2, move: 2 };
                break;

            case TIER_2: // 2 Work, 4 Carry, 3 Move - Total Cost: 550
                body = { work: 2, carry: 4, move: 3 };
                break;

            case TIER_3: // 4 Work, 4 Carry, 4 Move - Total Cost: 800
                body = { work: 4, carry: 4, move: 4 };
                break;

            case TIER_5:
            case TIER_4: // 8 Work, 4 Carry, 6 Move - Total Cost: 1300
                body = { work: 8, carry: 4, move: 6 };
                break;

            case TIER_6:
                body = { work: 14, carry: 6, move: 10 };
                break;

            case TIER_8:
            case TIER_7:
                // 10 Work, 8 Carry, 8 Move - Total Cost: 1800
                body = { work: 10, carry: 8, move: 8 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for worker creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        let creepOptions: CreepOptionsCiv = SpawnHelper.getDefaultCreepOptionsCiv();

        switch (roomState) {
            case ROOM_STATE_INTRO:
            case ROOM_STATE_BEGINNER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    wallRepair: true, //
                    fillTower: true, //
                    getDroppedEnergy: true //
                };

                break;

            case ROOM_STATE_INTER:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    wallRepair: true, //
                    fillTower: true, //
                    getFromContainer: true, //
                    getDroppedEnergy: true //
                };

                break;

            case ROOM_STATE_ADVANCED:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    wallRepair: true, //
                    fillTower: true, //
                    getFromStorage: true, //
                    getFromTerminal: true //
                };

                break;

            case ROOM_STATE_UPGRADER:
            case ROOM_STATE_STIMULATE:
            case ROOM_STATE_NUKE_INBOUND:
                creepOptions = {
                    // Options marked with // are overriding the defaults
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    wallRepair: true, //
                    fillTower: true, //
                    fillStorage: true, //
                    fillLink: true, //
                    getFromStorage: true, //
                    getDroppedEnergy: true, //
                    getFromTerminal: true //
                };

                break;
        }

        return creepOptions;
    }
}
