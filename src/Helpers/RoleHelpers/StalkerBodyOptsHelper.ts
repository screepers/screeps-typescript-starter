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
    ROLE_STALKER,
    ERROR_ERROR,
    SpawnHelper,
    SpawnApi,
    UserException,
    EventHelper
} from "utils/internals";

export class StalkerBodyOptsHelper implements ICreepBodyOptsHelper {
    public name: RoleConstant = ROLE_STALKER;

    constructor() {
        const self = this;
        self.generateCreepBody = self.generateCreepBody.bind(self);
        self.generateCreepOptions = self.generateCreepOptions.bind(this);
    }

    /**
     * Generate body for stalker creep
     * @param tier the tier of the room
     */
    public generateCreepBody(tier: TierConstant): BodyPartConstant[] {
        // Default Values for Stalker
        let body: CreepBodyDescriptor = { ranged_attack: 1, move: 1 };
        const opts: CreepBodyOptions = { mixType: GROUPED };

        switch (tier) {
            case TIER_1: // 1 Ranged Attack, 2 Move - Total Cost: 200
                body = { ranged_attack: 1, move: 1 };
                break;

            case TIER_2: // 3 Ranged Attack, 2 Move - Total Cost: 550
                body = { ranged_attack: 3, move: 2 };
                break;

            case TIER_3: // 4 Ranged Attack, 4 Move - Total Cost: 800
                body = { ranged_attack: 4, move: 4 };
                break;

            case TIER_4: // 6 Ranged Attack, 6 Move - Total Cost: 1200
                body = { ranged_attack: 6, move: 6 };
                break;

            case TIER_5: // 8 Ranged Attack, 8 Move - Total Cost: 1600
                body = { ranged_attack: 8, move: 8 };
                break;

            case TIER_8:
            case TIER_7:
            case TIER_6 || TIER_7 || TIER_8: // 12 Ranged Attack, 10 Move - Total Cost: 2300
                body = { ranged_attack: 12, move: 10 };
                break;
        }

        // ! Important DONT FORGET TO CHANGE
        // Temp override
        body = { ranged_attack: 1, move: 1 };
        // Generate creep body based on body array and options
        return SpawnApi.createCreepBody(body, opts);
    }

    /**
     * Generate options for stalker creep
     * @param roomState the room state of the room
     * @param squadSizeParam the size of the squad associated with the zealot
     * @param squadUUIDParam the squad id that the zealot is a member of
     * @param rallyLocationParam the meeting place for the squad
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
                    rallyDone: false
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
        const requestingFlag: AttackFlagMemory | undefined = EventHelper.getMiliRequestingFlag(
            room,
            roleConst,
            creepName
        );
        if (requestingFlag) {
            return Game.flags[requestingFlag!.flagName].pos.roomName;
        }

        // Throw exception if we couldn't find a definite room memory
        throw new UserException(
            "Couldn't get target room for [" + roleConst + " ]",
            "room: [ " + room.name + " ]",
            ERROR_ERROR
        );
    }
}
