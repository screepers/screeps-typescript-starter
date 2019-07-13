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
    ROLE_COLONIZER,
    ERROR_WARN,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class RemoteColonizerBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_COLONIZER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for remote colonizer creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Remote Colonizer
        let body: CreepBodyDescriptor = { work: 7, carry: 5, move: 6 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_4: // 7 Work, 5 Carry, 5 Move - Total Cost: 1300
                body = { work: 7, carry: 5, move: 6 };
                break;

            case TIER_5: // 9 Work, 8 Carry, 10 Move - Total Cost: 1800
                body = { work: 9, carry: 8, move: 10 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 12 Work, 10 Carry, 10 Move - Total Cost: 2300
                body = { work: 12, carry: 10, move: 12 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for remote colonizer creep
     * @param tier the tier of the room
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
                    build: true, //
                    upgrade: true, //
                    repair: true, //
                    harvestSources: true,
                    wallRepair: true, //
                    getFromContainer: true, //
                    getDroppedEnergy: true //
                };

                break;
        }

        return creepOptions;
    }
}
