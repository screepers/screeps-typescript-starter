import { MemoryApi, UserException, EmpireHelper } from "utils/internals";

export class ProcessDefaultRemoteRoom implements IFlagProcesser {
    public primaryColor: ColorConstant = COLOR_YELLOW;
    public secondaryColor: ColorConstant = COLOR_YELLOW;

    constructor() {
        const self = this;
        self.processFlag = self.processFlag.bind(self);
    }

    /**
     * Process the default remote room flag
     * @param flag
     */
    public processFlag(flag: Flag): void {
        // Get the host room and set the flags memory
        const dependentRoom: Room = Game.rooms[EmpireHelper.findDependentRoom(flag.pos.roomName)];
        const flagTypeConst: FlagTypeConstant | undefined = EmpireHelper.getFlagType(flag);
        const roomName: string = flag.pos.roomName;
        Memory.flags[flag.name].complete = false;
        Memory.flags[flag.name].processed = true;
        Memory.flags[flag.name].timePlaced = Game.time;
        Memory.flags[flag.name].flagType = flagTypeConst;
        Memory.flags[flag.name].flagName = flag.name;
        Memory.flags[flag.name].spawnProcessed = false;

        // Create the RemoteFlagMemory object for this flag
        const remoteFlagMemory: RemoteFlagMemory = {
            flagName: flag.name,
            flagType: flagTypeConst
        };

        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentRemoteRoomMem: RemoteRoomMemory | undefined = _.find(
            MemoryApi.getRemoteRooms(dependentRoom),
            (rr: RemoteRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            }
        );

        if (existingDepedentRemoteRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException(
                "Already working this dependent room!",
                "The room you placed the remote flag in is already being worked by " +
                    existingDepedentRemoteRoomMem.roomName,
                ERROR_WARN
            );
        }

        // Otherwise, add a brand new memory structure onto it
        const remoteRoomMemory: RemoteRoomMemory = {
            sources: { cache: Game.time, data: 1 },
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [remoteFlagMemory],
            reserveTTL: 0
        };

        MemoryApi.createEmpireAlertNode(
            "Remote Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]",
            10
        );
        dependentRoom.memory.remoteRooms!.push(remoteRoomMemory);
    }
}
