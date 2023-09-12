export interface SourceMine {
    sourceId : Id<Source>;
    HarvestPositions: HarvestPosition[];
    flow: number;
    distanceToSpawn: number;
}

export interface HarvestPosition {
    pos: RoomPosition;
    Harvesters: Id<Creep>[];
}
