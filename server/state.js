const state = require("../state");

module.exports = class State {
  constructor(value) {
    this.state = value;
    this.changeListeners = [];
  }

  onChange(f) {
    this.changeListeners.push(f);
  }

  emit(changeCommand) {
    this.changeListeners.forEach(f => f(changeCommand));
  }

  push(path, val) {
    this.state = state.push(this.state, path, val);
    this.emit(["push", path, val]);
  }

  set(path, val) {
    this.state = state.set(this.state, path, val);
    this.emit(["set", path, val]);
  }

  del(path) {
    this.state = state.del(this.state, path);
    this.emit(["del", path]);
  }
};
