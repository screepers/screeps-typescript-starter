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
    ROLE_DOMESTIC_DEFENDER,
    ERROR_ERROR,
    SpawnHelper,
    SpawnApi,
    UserException
} from "utils/internals";

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
            case TIER_1: // Total Cost: 200
                body = { ranged_attack: 1, move: 1 };
                break;

            case TIER_2: // Total Cost: 550
                body = { ranged_attack: 3, move: 2 };
                break;

            case TIER_3: // Total Cost: 650
                body = { ranged_attack: 4, move: 4 };
                break;

            case TIER_4: // Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;

            case TIER_6:
            case TIER_5: // Total Cost: 1600
                body = { ranged_attack: 8, move: 8 };
                break;

            case TIER_8:
            case TIER_7: // Total Cost: 3000
                body = { ranged_attack: 15, move: 15 };
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

    /**
     * Get the home room for the creep
     * @param room the room we are spawning the creep from
     */
    public getHomeRoom(room: Room): string {
        return room.name;
    }

    /**
     * Get the target room for the creep
     * @param room the room we are spawning the creep in
     * @param roleConst the role we are getting room for
     * @param creepBody the body of the creep we are checking, so we know who to exclude from creep counts
     * @param creepName the name of the creep we are checking for
     */
    public getTargetRoom(
        room: Room,
        roleConst: RoleConstant,
        creepBody: BodyPartConstant[],
        creepName: string
    ): string {
        return room.name;
    }
}
