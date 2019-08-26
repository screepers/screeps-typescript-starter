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
    ROLE_HARVESTER,
    ROLE_SCOUT
} from "utils/Constants";
import { SpawnHelper } from "Helpers/SpawnHelper";
import SpawnApi from "Api/Spawn.Api";

export class ScoutBodyOptsHelper implements ICreepBodyOptsHelper {
    public name: RoleConstant = ROLE_SCOUT;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(self);
    }

    /**
     * Generate body for Scout creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for harvester
        let body: CreepBodyDescriptor = { move: 1 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for harvester creep
     * @param roomState the room state of the room
     */
    public generateCreepOptions(roomState: RoomStateConstant): CreepOptionsCiv | undefined {
        let creepOptions: CreepOptionsCiv = {};
        return creepOptions;
    }
}
