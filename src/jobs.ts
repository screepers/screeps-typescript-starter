import getEnergy from "jobs/getEnergy";
import returnEnergy from "jobs/returnEnergy";
import returnEnergyToController from "jobs/returnEnergyToController";
import upgradeController from "jobs/upgradeController";
import dance from "jobs/dance";

export const Jobs = [
  dance,
  getEnergy,
  // returnEnergy,
  returnEnergyToController,
  upgradeController,
]
