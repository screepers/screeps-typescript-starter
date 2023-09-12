export interface EnergyRoute {
    waypoints : {x: number, y: number, roomName: string, surplus: boolean}[];
    Carriers : { creepId: Id<Creep>, waypointIdx: number }[];
}
