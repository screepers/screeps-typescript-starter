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
    ROLE_MINER,
    SpawnHelper,
    SpawnApi
} from "utils/internals";

export class MinerBodyOptsHelper implements ICreepBodyOptsHelper {
    public name: RoleConstant = ROLE_MINER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for miner creep
     * @param tier The tier of the room
     */
    public generateCreepBody = (tier: TierConstant): BodyPartConstant[] => {
        let body: CreepBodyDescriptor = { work: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 2 Work, 2 Move - Total Cost: 300
                body = { work: 2, move: 2 };
                opts.mixType = COLLATED; // Just as an example of how we could change opts by tier as well
                break;

            case TIER_2: // 5 Work, 1 Move - Total Cost: 550
                body = { work: 5, move: 1 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4:
            case TIER_3: // 5 Work, 3 Move - Total Cost: 650
                body = { work: 5, move: 3 };
                break;
        }

        // Generate the creep body based on the body array and options
        return SpawnApi.createCreepBody(body, opts);
    };

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
                    // Options marked with // are overriding the defaults
                    harvestSources: true, //
                    fillContainer: true //
                };

                break;
        }

        return creepOptions;
    };

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
