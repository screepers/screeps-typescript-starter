// Creep interface, use this when you want to call a creep instance
export interface CreepInstance {
  // work function
  run: (creep: Creep) => void;

  // getter
  get_spawn_energy: (config: Object) => number;
}
