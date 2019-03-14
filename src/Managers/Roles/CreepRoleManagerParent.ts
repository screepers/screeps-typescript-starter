// Defines parent class for creep role manager
export default class CreepRoleManagerParent {
    // only purpose of this is so we can call .runCreepRole on anything that extends this type
    // and it will call the overloaded function within each role
    // basically a way around no static class interface support in javascript
    public static runCreepRole(creep: Creep): void {
        console.log("We aren't supposed to see this, if you are then my idea didn't work.");
    }
}
