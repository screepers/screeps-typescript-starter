interface SourceMine {}
interface EnergyRoute {}

interface ConstructionSiteStruct {
    id: Id<ConstructionSite<BuildableStructureConstant>>;
    Builders: Id<Creep>[];
}

interface RoomMemory {
    sourceMines : SourceMine[];
    energyRoutes : EnergyRoute[];
    constructionSites : ConstructionSiteStruct[];
}

interface CreepMemory {
    role? : string;
}
