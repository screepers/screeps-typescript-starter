export interface SourceMine {
    sourceId : Id<Source>;
    HarvestPositions: RoomPosition[];
    flow: number;
    distanceToSpawn: number;
}
