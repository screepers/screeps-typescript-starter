export const DefenseController = function (context: DefenseControllerContext) {
  const getAttackTarget = function (): AnyCreep | Structure | null {
    let creeps = context.getHostileCreeps();
    if (creeps.length > 0) return creeps[0];
    let powerCreeps = context.getHostilePowerCreeps();
    if (powerCreeps.length > 0) return powerCreeps[0];
    return null;
  };

  return { getAttackTarget };
};

interface DefenseControllerContext {
  room: Room;
  getHostileCreeps: () => Creep[];
  getHostilePowerCreeps: () => PowerCreep[];
}
