import { RoomHelper } from "utils/internals";

export class ConsoleCommands {
    public static init() {
        global.removeFlags = this.removeFlags;
        global.removeConstructionSites = this.removeConstructionSites;
        global.killAllCreeps = this.killAllCreeps;
        global.sendResource = this.sendResource;
        global.displayRoomStatus = this.displayRoomStatus;
    }
    /**
     * remove all construction sites from the room when called
     * @param roomName the name of the room we want to remove construction sites from
     * @param structureType [optional] the type of structure we want to remove the sites of
     */
    public static removeConstructionSites = function(roomName: string, structureType?: string): void {
        Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site: ConstructionSite) => {
            if (!structureType || site.structureType === structureType) {
                site.remove();
            }
        });
    };

    /**
     * remove all flags from the empire when called
     * @param substr a name contained in flags we want to remove
     */
    public static removeFlags = function(substr: string): void {
        _.forEach(Game.flags, flag => {
            if (_.includes(flag.name, substr)) {
                console.log(`removing flag ${flag.name} in ${flag.pos.roomName}`);
                flag.remove();
            }
        });
    };

    /**
     * display status of specified room or all rooms if room specified
     * @param room [optional] the room we want to display the stats for (default all rooms)
     */
    public static displayRoomStatus = function(roomName?: string): void {
        // if no room was specified, display status for all
        if (!roomName) {
            _.forEach(Game.rooms, (currentRoom: Room) => {
                console.log(`Room: ${currentRoom.name} -----------`);
                console.log(`State: ${currentRoom.memory.roomState}`);
                console.log(`Storage: ${RoomHelper.getStoredAmount(currentRoom.storage, RESOURCE_ENERGY)}`);
                console.log("----------------------------");
            });
        } else {
            const room: Room = Game.rooms[roomName];
            console.log(`Room: ${room.name} -----------`);
            console.log(`State: ${room.memory.roomState}`);
            if (room.storage) {
                console.log(`Storage: ${RoomHelper.getStoredAmount(room.storage, RESOURCE_ENERGY)}`);
            }
            console.log("----------------------------");
        }
    };

    /**
     * kill all creeps
     * @param room [optional] the room we want to kill all creeps in (default all rooms)
     */
    public static killAllCreeps = function(room?: Room, role?: RoleConstant): void {
        // if no room specified, kill all creeps
        if (!room) {
            _.forEach(Game.creeps, creep => {
                if (!role || creep.memory.role === role) {
                    creep.suicide();
                }
            });
        } else {
            _.forEach(Game.creeps, creep => {
                if (creep.room.name === room.name) {
                    if (!role || creep.memory.role === role) {
                        creep.suicide();
                    }
                }
            });
        }
    };

    /**
     * send energy from one room to another
     * @param sendingRoom the room sending resources
     * @param receivingRoom the room receiving resources
     * @param resourceType the type of resource we want to transfer
     * @param amount the amount of the resource we want to send
     */
    public static sendResource = function(
        sendingRoom: Room,
        receivingRoom: Room,
        resourceType: ResourceConstant,
        amount: number
    ): void {
        // check if terminal exists in the sending room
        // check if we have enough energy to send the resource
        // send the resources
    };
}
