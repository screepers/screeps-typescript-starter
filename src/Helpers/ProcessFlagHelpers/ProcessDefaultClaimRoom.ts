import { MemoryApi, EmpireHelper, UserException } from "utils/internals";

export class ProcessDefaultClaimRoom implements IFlagProcesser {
    public primaryColor: ColorConstant = COLOR_WHITE;
    public secondaryColor: ColorConstant = COLOR_WHITE;

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

        // Create the ClaimFlagMemory object for this flag
        const claimFlagMemory: ClaimFlagMemory = {
            flagName: flag.name,
            flagType: flagTypeConst
        };

        // If the dependent room already has this room covered, set the flag to be deleted and throw a warning
        const existingDepedentClaimRoomMem: ClaimRoomMemory | undefined = _.find(
            MemoryApi.getClaimRooms(dependentRoom),
            (rr: ClaimRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            }
        );

        if (existingDepedentClaimRoomMem) {
            Memory.flags[flag.name].complete = true;
            throw new UserException(
                "Already working this dependent room!",
                "The room you placed the claim flag in is already being worked by " +
                    existingDepedentClaimRoomMem.roomName,
                ERROR_WARN
            );
        }

        // Otherwise, add a brand new memory structure onto it
        const claimRoomMemory: ClaimRoomMemory = {
            roomName: flag.pos.roomName,
            flags: [claimFlagMemory]
        };

        MemoryApi.createEmpireAlertNode(
            "Claim Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]",
            10
        );
        dependentRoom.memory.claimRooms!.push(claimRoomMemory);
    }
}
