export const Creep_sr_carrier = {
  run(creep: Creep, room: Room) {
    if (creep.spawning) return;
  }
}

interface SRCarrier_data {
  container: string | null;
  containerPos: RoomPosition | null;
  repairId: string | null;
}

enum STATE {
  IDLE,
  FETCH,
  REPAIR,
  CARRY
}
