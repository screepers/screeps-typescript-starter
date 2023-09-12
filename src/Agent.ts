class Action {
    constructor(public preconditions: Map<string, boolean>, public effects: Map<string, boolean>, public cost: number) { }

    isAchievable(worldState: Map<string, boolean>): boolean {
        for (const [condition, value] of this.preconditions.entries()) {
          if (worldState.get(condition) !== value) {
            return false;
          }
        }
        return true;
      }
}

const mineEnergyAction = new Action(
    new Map([['hasResource', false], ['hasMiner', true]]),
    new Map([['hasResource', true]]),
    2
);

const buildStructureAction = new Action(
    new Map([['hasResource', true], ['hasBuilder', true]]),
    new Map([['hasResource', false]]),
    3
);

// Define more actions as needed

class Goal {
    public conditions: Map<string, boolean>;
    public priority: number;

    constructor(conditions: Map<string, boolean>, priority: number) {
      this.conditions = conditions;
      this.priority = priority;
    }
  }

const profitGoal = new Goal(new Map([['hasResource', true]]), 3);

// Define more goals as needed


class WorldState {
    private state: Map<string, boolean>;

    constructor(initialState: Map<string, boolean>) {
      this.state = initialState;
    }

    updateState(newState: Map<string, boolean>): void {
      for (const [condition, value] of newState.entries()) {
        this.state.set(condition, value);
      }
    }

    getState(): Map<string, boolean> {
      return new Map(this.state);
    }
  }

abstract class Agent {
    private currentGoals: Goal[];
    private availableActions: Action[];
    private worldState: WorldState;

    constructor(initialWorldState: WorldState) {
        this.currentGoals = [];
        this.availableActions = [];
        this.worldState = initialWorldState;
    }

    addAction(action: Action): void {
        this.availableActions.push(action);
    }

    addGoal(goal: Goal): void {
        this.currentGoals.push(goal);
        this.currentGoals.sort((a, b) => b.priority - a.priority);
    }

    selectAction(): Action | null {
        for (const goal of this.currentGoals) {
            for (const action of this.availableActions) {
                if (action.isAchievable(this.worldState.getState()) && this.isGoalSatisfied(goal)) {
                    return action;
                }
            }
        }
        return null;
    }

    private isGoalSatisfied(goal: Goal): boolean {
        for (const [condition, value] of goal.conditions.entries()) {
            if (this.worldState.getState().get(condition) !== value) {
                return false;
            }
        }
        return true;
    }

    abstract performAction(): void;
}
