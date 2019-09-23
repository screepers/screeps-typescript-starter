import {
    RoomHelper,
    ROOM_STATUS_SOURCE_KEEPER,
    ROOM_STATUS_HIGHWAY,
    ROOM_STATUS_ALLY,
    ROOM_STATUS_HOSTILE,
    ROOM_STATUS_NEUTRAL,
    ROOM_STATUS_UNKNOWN,
    ROOM_STATUS_HOSTILE_REMOTE
} from "utils/internals";

export class PathfindingApi {
    /**
     * Call this method to ensure that Memory.empire.movementData exists in a usable state
     */
    public static initializeEmpireMovementMemory(): void {
        // Memory safeguarding
        if (!Memory.empire) {
            Memory.empire = {};
        }

        if (!Memory.empire.movementData) {
            Memory.empire.movementData = [];
        }
        // End Memory Safeguarding
    }

    /**
     * @param room The room to get the status of
     * @returns RoomStatusType The status of the room
     */
    public static getRoomStatus(room: Room): RoomStatusType {
        let roomStatus: RoomStatusType;

        if (room.controller === undefined) {
            if (RoomHelper.isSourceKeeperRoom(room)) {
                roomStatus = ROOM_STATUS_SOURCE_KEEPER;
            } else {
                roomStatus = ROOM_STATUS_HIGHWAY;
            }
        } else if (room.controller.my || RoomHelper.isAllyRoom(room)) {
            roomStatus = ROOM_STATUS_ALLY;
        } else if (!room.controller.my && room.controller.owner) {
            roomStatus = ROOM_STATUS_HOSTILE;
        } else if (!room.controller.my && room.controller.reservation !== undefined) {
            roomStatus = ROOM_STATUS_HOSTILE_REMOTE;
        } else {
            roomStatus = ROOM_STATUS_NEUTRAL;
        }

        return roomStatus;
    }

    /**
     * This is the method that creeps will call to update Memory.empire.movementData
     * @param room The room to update the RoomMovementData for
     */
    public static updateRoomData(room: Room): void {
        if (!Memory.empire || !Memory.empire.movementData) {
            this.initializeEmpireMovementMemory();
        }

        const roomDataIndex = _.findIndex(
            Memory.empire.movementData!,
            (roomData: RoomMovementData) => roomData.roomName === room.name
        );

        const roomData: RoomMovementData = {
            roomName: room.name,
            roomStatus: this.getRoomStatus(room),
            lastSeen: Game.time
        };

        if (roomDataIndex === -1) {
            Memory.empire.movementData!.push(roomData);
        } else {
            Memory.empire.movementData![roomDataIndex] = roomData;
        }
    }

    /**
     * Retrieve the RoomStatus from memory
     * @param roomName The name of the room to retrieve
     * @returns RoomStatusType The type of room, or unknown if we have no data
     */
    public static retrieveRoomStatus(roomName: string): RoomStatusType {
        if (!Memory.empire || !Memory.empire.movementData) {
            this.initializeEmpireMovementMemory();
        }

        const roomData = _.find(Memory.empire.movementData!, (data: RoomMovementData) => data.roomName === roomName);

        if (roomData) {
            return roomData.roomStatus;
        } else {
            return ROOM_STATUS_UNKNOWN;
        }
    }

    /**
     * Use this function to get the DEFAULT_MOVE_OPTS object for use in pathing
     * @returns MoveToOpts The object used for pathfinding
     */
    public static GetDefaultMoveOpts(): MoveToOpts {
        const DEFAULT_OPTS = {
            heuristicWeight: 1.5, // TODO Test this to see if we can afford to raise it ( higher number = less CPU use, lower number = more likely to get best path each time)
            range: 0, // Assume we want to go to the location, if not told otherwise
            ignoreCreeps: true, // ! Might need to change this back to false if we have issues with enemy creeps
            reusePath: 999,
            // swampCost: 5, // Putting this here as a reminder that we can make bigger creeps that can move on swamps
            visualizePathStyle: {}, // Empty object for now, just uses default visualization
            costCallback(roomName: string, costMatrix: CostMatrix) {
                if (PathfindingApi.UseRoomForCostMatrix(roomName, costMatrix)) {
                    PathfindingApi.SetCreepCostMatrix(roomName, costMatrix);
                } else {
                    PathfindingApi.BlockRoomForCostMatrix(roomName, costMatrix);
                }
                return costMatrix;
            }
        };

        return DEFAULT_OPTS;
    }

    /**
     * Use this function to set the default CostMatrix values for creeps
     * @param roomName The roomname being processed
     * @param costMatrix The costMatrix object to set the values on
     */
    public static SetCreepCostMatrix(roomName: string, costMatrix: CostMatrix): void {
        _.forEach(Game.creeps, (creep: Creep) => {
            // If not in the room, do nothing
            if (creep.pos.roomName !== roomName) {
                return;
            }

            let matrixValue;

            if (creep.my) {
                if (creep.memory.working === true || creep.memory.job === undefined) {
                    // Walk around working creeps or idling creeps
                    matrixValue = 255;
                } else {
                    // Walk through creeps with a job, but not working (AKA traveling)
                    const terrainValue = new Room.Terrain(roomName).get(creep.pos.x, creep.pos.y);
                    // Match the terrain underneath the creep to avoid preferring going under creeps
                    matrixValue = terrainValue > 0 ? 5 : 1;
                }
            } else {
                // If creep is not ours, we can only walk on it if we are in safe mode
                if (creep.room.controller && creep.room.controller.safeMode !== undefined) {
                    const terrainValue = new Room.Terrain(roomName).get(creep.pos.x, creep.pos.y);
                    matrixValue = terrainValue > 0 ? 5 : 1;
                } else {
                    matrixValue = 255;
                }
            }

            costMatrix.set(creep.pos.x, creep.pos.y, matrixValue);
        });
    }

    /**
     * Use this function to set the default RoomStatus callback values
     * @param roomName The roomname being processed
     * @param costMatrx The costMatrix object to set the values on
     */
    public static UseRoomForCostMatrix(roomName: string, costMatrix?: CostMatrix): boolean {
        const roomStatus = this.retrieveRoomStatus(roomName);

        // Todo - Retrieve the lastSeen for the room as well for decisions about rooms that haven't been seen in a while

        switch (roomStatus) {
            case ROOM_STATUS_ALLY:
                return true;
            case ROOM_STATUS_HIGHWAY:
                return true;
            case ROOM_STATUS_NEUTRAL:
                return true;
            case ROOM_STATUS_HOSTILE:
                return false;
            case ROOM_STATUS_UNKNOWN:
                return true;
            case ROOM_STATUS_SOURCE_KEEPER:
                return false;
        }

        return true;
    }

    /**
     * Creates a room where all sides are considered unwalkable
     */
    public static BlockRoomForCostMatrix(roomName: string, costMatrix: CostMatrix): void {
        // x = 0 y = 0-49
        // x = 49, y = 0-49
        for (let i = 0; i < 50; i++) {
            costMatrix.set(i, 0, 255);
            costMatrix.set(i, 49, 255);
            costMatrix.set(0, i, 255);
            costMatrix.set(49, i, 255);
        }
    }

    /**
     * Use this to decide if we should update room status
     * @param Creep The creep to use for updating the room
     */
    public static CreepChangedRooms(creep: Creep): boolean {
        // Creep either doesn't use our method of movement, or is not moving.
        if (!creep.memory._move || !creep.memory._move.lastPosition) {
            return false;
        }

        const lastRoomName = creep.memory._move.lastPosition.substr(-6);

        return lastRoomName !== creep.pos.roomName;
    }
}
