import * as job from "../jobs"
import * as creep from "./creepBase"
import {log} from "../../../lib/logger/log"

export class Worker extends creep.Base {
  private _job: job.Job | null;

  constructor(c: Creep) {
    super(c);
    if (c.memory.job) {
      this._job = job.Job.fromMemory(c.memory.job);
      if (!this._job.target) {
        this.backToIdle();
      }
    } else {
      this.state = State.Idle;
      this._job = null;
    }
  }

  public get job(): job.Job | null {
    return this._job;
  }

  public assignJob(job: job.Job) {
    this._job = job;
    this.state = State.Working;
    this._creep.memory.job = job.toMemory();
  }

  private backToIdle() {
      this._job = null;
      delete this._creep.memory.job;
      // log.info(`${this._creep.name}: reset to idle`);
      this.state = State.Idle;
  }

  public run() {
    const jobStr = this._job ? `{${this._job.action} ${this._job.target.id}}` : `<none>`;
    // log.debug(`state: ${creep.State[this.state]}, carry: ${this._creep.carry.energy}, capacity: ${this._creep.carryCapacity}, job: ${jobStr}`);

    // first maintain the state machine
    if (this.state === State.Collecting && _.sum(this._creep.carry) == this._creep.carryCapacity) {
      // we're collecting our energy and we're full, time to go do work
      this.state = this._job ? State.Working : State.Idle;  // if we don't have a job then we're ready for one
    } else if ((this.state == State.Idle || this.state === State.Working) && this._creep.carry.energy === 0) {
      // we were doing work and we ran out of energy, time to get some more
      this.state = State.Collecting;
    }

    // now do the actual work
    if (this.state === State.Collecting) {
      // need to go get some energy from a container, find the closest non-empty one
      // log.debug("collecting energy");
      this.collectEnergy();
    } else if (this.state === State.Working) {
      // time to get to work
      // log.debug("working");
      this.doWork();
    } else if (this.state === State.Idle) {
      // idle workers should upgrade the room controller
      // log.debug("upgrading controller");
      this.upgradeController();
    }
  }

  private doWork(): number {
    if (!this._job) {
      this.backToIdle();
      return -998;
    }

    // targets can be ConstructionSites, Things that need repairing
    let target = this._job.target;
    let code: number;
    switch (this._job.action) {
      case job.JobAction.Repair:
        let repairStruct = target as Structure;
        code = this._creep.repair(repairStruct);
        if (repairStruct.hits == repairStruct.hitsMax)
          this.backToIdle();  // job done
      break;

      case job.JobAction.Build:
        code = this._creep.build(target as ConstructionSite);
      break;

      case job.JobAction.Transfer:
        let transferStruct = target as Structure;
        code = this._creep.transfer(transferStruct, RESOURCE_ENERGY);
        let es = transferStruct as any as {energy: number, energyCapacity: number};
        if (es.energyCapacity && es.energy == es.energyCapacity)
          this.backToIdle();  // job done
      break;

      default:
        return -999
    }

    if (code == ERR_NOT_IN_RANGE)
      return this.moveTo(target);

    return code;
  }

  private upgradeController(): number {
    const controller = this._creep.room.controller;
    if (!controller) {
      // log.warning(`room ${this._creep.room.name} has no controller to upgrade`);
      return -999;
    }
    const code = this._creep.upgradeController(controller);
    if (code == ERR_NOT_IN_RANGE)
      return this.moveTo(controller);
    return code;
  }
}

export interface WorkerMap {
    [name: string]: Worker;
}
