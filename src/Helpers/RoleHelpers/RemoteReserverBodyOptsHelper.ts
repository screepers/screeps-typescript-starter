import {
    GROUPED,
    ROOM_STATE_INTRO,
    ROOM_STATE_BEGINNER,
    ROOM_STATE_INTER,
    ROOM_STATE_ADVANCED,
    ROOM_STATE_NUKE_INBOUND,
    ROOM_STATE_STIMULATE,
    ROOM_STATE_UPGRADER,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
    ROLE_REMOTE_RESERVER,
    ERROR_ERROR,
    SpawnHelper,
    SpawnApi,
    UserException
} from "utils/internals";

export class RemoteReserverBodyOptsHelper implements ICreepBodyOptsHelper {
    public name: RoleConstant = ROLE_REMOTE_RESERVER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for remote reserver creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Remote Reserver
        let body: CreepBodyDescriptor = { claim: 2, move: 2 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_8:
            case TIER_7:
            case TIER_6:
            case TIER_5:
            case TIER_4: // 2 Claim, 2 Move - Total Cost: 800
                body = { claim: 2, move: 2 };
                break;
        }

        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for remote reserver creep
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
                // Remote reservers don't really have options perse, so just leave as defaults
                creepOptions = {
                    claim: true
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
        const roomMemory: RemoteRoomMemory | undefined = SpawnHelper.getRemoteRoomNeedingRemoteReserver(room);
        if (roomMemory) {
            return roomMemory.roomName;
        }

        // Throw error if target room is left unhandled
        throw new UserException(
            "Couldn't get target room for [" + roleConst + " ]",
            "room: [ " + room.name + " ]",
            ERROR_ERROR
        );
    }
}
