interface SourceMine {}
interface EnergyRoute {}

interface ConstructionSiteStruct {
    id: Id<ConstructionSite<BuildableStructureConstant>>;
    Builders: Id<Creep>[];
}

interface RoomMemory {
    routines : {
        [routineType : string] : any[];
    };
}

interface CreepMemory {
    role? : string;
}
