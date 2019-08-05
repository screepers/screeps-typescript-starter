import RoomHelper from "Helpers/RoomHelper";
import {
    ROOM_STATUS_SOURCE_KEEPER,
    ROOM_STATUS_HIGHWAY,
    ROOM_STATUS_ALLY,
    ROOM_STATUS_HOSTILE,
    ROOM_STATUS_NEUTRAL
} from "utils/constants";

export default class MovementApi {
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
        } else if (!room.controller.my) {
            roomStatus = ROOM_STATUS_HOSTILE;
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

        if (roomDataIndex < 0) {
            Memory.empire.movementData!.push(roomData);
        } else {
            Memory.empire.movementData![roomDataIndex] = roomData;
        }
    }

    /**
     * TODO Go through and replace all use of the constant from constants.ts with this method call
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
                MovementApi.SetCreepCostMatrix(roomName, costMatrix);
                MovementApi.SetRoomCostMatrix(roomName, costMatrix);
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
    public static SetRoomCostMatrix(roomName: string, costMatrix: CostMatrix): void {
        // TODO Figure out how to skip rooms based on conditions. E.g. skip hostile rooms, prefer ally rooms, allow neutral etc
    }
}
