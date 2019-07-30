import {
    GROUPED,
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
    ROLE_MEDIC,
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api"

export class MedicBodyOptsHelper implements ICreepBodyOptsHelper {

    public name: RoleConstant = ROLE_MEDIC;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for medic creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Medic
        let body: CreepBodyDescriptor = { heal: 1, move: 1 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Heal, 1 Move - Total Cost: 300
                body = { heal: 1, move: 1 };
                break;

            case TIER_2: // 2 Heal, 1 Move - Total Cost: 550
                body = { heal: 2, move: 1 };
                break;

            case TIER_3: // 2 Heal, 2 Move - Total Cost: 600
                body = { heal: 2, move: 2 };
                break;

            case TIER_4: // 4 Heal, 4 Move - Total Cost: 1200
                body = { heal: 4, move: 4 };
                break;

            case TIER_5: // 6 Heal, 6 Move - Total Cost: 1800
                body = { heal: 6, move: 6 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6: // 8 Heal, 6 Move - Total Cost: 2300
                body = { heal: 8, move: 6 };
                break;
        }

        // ! Important DONT FORGET TO CHANGE
        // Temp override
        body = { heal: 1, move: 1 };
        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for medic creep
     * @param tier the tier of the room
     */
    public generateCreepOptions(
        roomState: RoomStateConstant,
        squadSizeParam: number,
        squadUUIDParam: number | null,
        rallyLocationParam: RoomPosition | null
    ): CreepOptionsMili | undefined {

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
                    squadSize: squadSizeParam,
                    squadUUID: squadUUIDParam,
                    rallyLocation: rallyLocationParam,
                    rallyDone: false,
                    healer: true,
                    flee: true
                };

                break;
        }

        return creepOptions;
    }
}
