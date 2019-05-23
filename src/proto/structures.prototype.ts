Object.defineProperty(Structure.prototype, "memory", {
    configurable: true,
    get() {
        if (_.isUndefined(Memory.structures[this.id])) {
            Memory.structures[this.id] = {} as any;
        }
        return (Memory.structures[this.id] = Memory.structures[this.id] || {});
    },
    set(value) {
        _.set(Memory.structures, this.id, value);
    }
});

Object.defineProperty(Structure.prototype, "processed", {
    configurable: true,
    get() {
        return _.get(Memory.structures, [this.id, "processed"], false); // or this.memory.processed
    },
    set(value) {
        _.set(Memory.structures, [this.id, "processed"], value);// or this.memory.processed
    }
});
