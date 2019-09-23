import { MemoryApi, EmpireHelper } from "utils/internals";

export class ProcessDefaultAttackFlag implements IFlagProcesser {
    public primaryColor: ColorConstant = COLOR_RED;
    public secondaryColor: undefined = undefined;

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
        const attackFlagMemory: AttackFlagMemory = EmpireHelper.generateAttackFlagOptions(
            flag,
            flagTypeConst,
            dependentRoom.name
        );

        // If the dependent room already has this room covered, just push this flag onto the existing structure
        const existingDepedentAttackRoomMem: AttackRoomMemory | undefined = _.find(
            MemoryApi.getAttackRooms(dependentRoom),
            (rr: AttackRoomMemory) => {
                if (rr) {
                    return rr.roomName === roomName;
                }
                return false;
            }
        );

        if (existingDepedentAttackRoomMem) {
            MemoryApi.createEmpireAlertNode(
                "Attack Flag [" +
                    flag.name +
                    "] processed. Added to existing Host Room: [" +
                    existingDepedentAttackRoomMem.roomName +
                    "]",
                10
            );
            existingDepedentAttackRoomMem.flags.push(attackFlagMemory);
            return;
        }

        // Otherwise, add a brand new memory structure onto it
        const attackRoomMemory: AttackRoomMemory = {
            hostiles: { cache: Game.time, data: null },
            structures: { cache: Game.time, data: null },
            roomName: flag.pos.roomName,
            flags: [attackFlagMemory]
        };

        MemoryApi.createEmpireAlertNode(
            "Attack Flag [" + flag.name + "] processed. Host Room: [" + dependentRoom.name + "]",
            10
        );
        dependentRoom.memory.attackRooms!.push(attackRoomMemory);
    }
}
