export function lookStructure(room: Room, x: number, y: number, type: StructureConstant): Structure | null {
  let structures = room.lookForAt(LOOK_STRUCTURES, x, y);
  for (let structure of structures) {
    if (structure.structureType == type) return structure;
  }
  return null;
}

export function lookRangeStructure(
  room: Room,
  x: number,
  y: number,
  range: number,
  type: StructureConstant
): Structure | null {
  let structures = room.lookForAtArea(LOOK_STRUCTURES, y - range, x - range, y + range, x + range, true);
  for (let structure of structures) {
    if (structure.structure.structureType == type) return structure.structure;
  }
  return null;
}

//---------------Creep Action Error Message---------------//
export function attackMsg(code: number): string {
  return `Unhandled attack error code ${code}`;
}
export function buildMsg(code: number): string {
  return `Unhandled build error code ${code}`;
}
export function claimMsg(code: number): string {
  return `Unhandled claim error code ${code}`;
}
export function dismantleMsg(code: number): string {
  return `Unhandled dismantle error code ${code}`;
}
export function dropMsg(code: number): string {
  return `Unhandled drop error code ${code}`;
}
export function harvestMsg(code: number): string {
  return `Unhandled harvest error code ${code}`;
}
export function healMsg(code: number): string {
  return `Unhandled heal error code ${code}`;
}
export function pickupMsg(code: number): string {
  return `Unhandled pickup error code ${code}`;
}
export function rangedAttackMsg(code: number): string {
  return `Unhandled rangedAttack error code ${code}`;
}
export function rangedHealMsg(code: number): string {
  return `Unhandled rangedHeal error code ${code}`;
}
export function rangedMassAttackMsg(code: number): string {
  return `Unhandled rangedMassAttack error code ${code}`;
}
export function repairMsg(code: number): string {
  return `Unhandled repair error code ${code}`;
}
export function reserveMsg(code: number): string {
  return `Unhandled reserve error code ${code}`;
}
export function transferMsg(code: number): string {
  return `Unhandled transfer error code ${code}`;
}
export function upgradeMsg(code: number): string {
  return `Unhandled upgrade error code ${code}`;
}
export function withdrawMsg(code: number): string {
  return `Unhandled withdraw error code ${code}`;
}
//-------------Creep Action Error Message End-------------//
