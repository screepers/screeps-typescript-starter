type Peak = {
    tiles: RoomPosition[];
    center: RoomPosition;
    height: number;
};

type Edge = {
    from: Peak;
    to: Peak;
    path: RoomPosition[];
    cost: number;
};

type Skeleton = {
    peaks: Peak[];
    edges: Edge[];
};

declare global {
    interface RoomMemory {
        routines : {
            [routineType : string] : any[];
        };
        highestDistance?: number;
        distanceMatrix?: number[]; // Serialized CostMatrix
        skeleton?: Skeleton; // Reference to existing Skeleton type
    }
    interface ConstructionSiteStruct {
        id: Id<ConstructionSite<BuildableStructureConstant>>;
        Builders: Id<Creep>[];
    }

    interface CreepMemory {
        role? : string;
    }
}

// Ensure TypeScript treats this file as a module
export {};

