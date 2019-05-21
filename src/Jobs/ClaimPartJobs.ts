import MemoryApi from "Api/Memory.Api";
import { RESERVER_MIN_TTL } from "utils/config";

export default class ClaimPartJobs {
    /**
     * Gets a list of ClaimJobs for the Room
     * @param room The room to get the jobs for
     */
    public static createClaimJobs(room: Room): ClaimPartJob[] {
        // Get only ClaimRoomMemory objects that are defined
        const claimRooms = MemoryApi.getClaimRooms(room);

        if (claimRooms.length === 0) {
            return [];
        }

        const claimJobs: ClaimPartJob[] = [];

        _.forEach(claimRooms, (room: ClaimRoomMemory) => {
            const claimJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: room.roomName,
                targetType: "roomName",
                actionType: "claim",
                isTaken: false
            };

            claimJobs.push(claimJob);
        });

        return claimJobs;
    }

    /**
     * Gets a list of ReserveJobs for the room
     * @param room The room to get the jobs for
     */
    public static createReserveJobs(room: Room): ClaimPartJob[] {
        const reserveRooms: RemoteRoomMemory[] = MemoryApi.getRemoteRooms(room, (roomMemory: RemoteRoomMemory) => {
            return roomMemory.reserveTTL < RESERVER_MIN_TTL
        });

        if (reserveRooms.length === 0) {
            return [];
        }

        const reserveJobs: ClaimPartJob[] = [];

        _.forEach(reserveRooms, (room: RemoteRoomMemory) => {
            const reserveJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: room.roomName,
                targetType: "roomName",
                actionType: "reserve",
                isTaken: false
            };

            reserveJobs.push(reserveJob);
        });

        return reserveJobs;
    }

    /**
     * Gets a list of SignJobs for the room (signing the controller)
     * @param room The room to get the jobs for
     */
    public static createSignJobs(room: Room): ClaimPartJob[] {
        // TODO Get a list of controllers to be signed
        const controllers: StructureController[] = [];

        if (controllers.length === 0) {
            return [];
        }

        const signJobs: ClaimPartJob[] = [];

        _.forEach(controllers, (controller: StructureController) => {
            const signJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: controller.id,
                targetType: "controller",
                actionType: "sign",
                isTaken: false
            };

            signJobs.push(signJob);
        });

        return signJobs;
    }

    /**
     * Gets a list of AttackJobs for the room (attacking enemy controller)
     * @param room The room to get the jobs for
     */
    public static createAttackJobs(room: Room): ClaimPartJob[] {
        // TODO Get a list of rooms to attack
        const roomNames: string[] = [];

        if (roomNames.length === 0) {
            return [];
        }

        const attackJobs: ClaimPartJob[] = [];

        _.forEach(roomNames, (name: string) => {
            const attackJob: ClaimPartJob = {
                jobType: "claimPartJob",
                targetID: name,
                targetType: "roomName",
                actionType: "attack",
                isTaken: false
            };

            attackJobs.push(attackJob);
        });

        return attackJobs;
    }
}
