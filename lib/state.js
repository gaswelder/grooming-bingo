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
    this.state = push(this.state, path, val);
    this.emit(["push", path, val]);
  }

  set(path, val) {
    this.state = set(this.state, path, val);
    this.emit(["set", path, val]);
  }

  del(path) {
    this.state = del(this.state, path);
    this.emit(["del", path]);
  }
};

function appl(currentValue, nextValue) {
  if (typeof nextValue == "function") {
    return nextValue(currentValue);
  }
  return nextValue;
}

function set(state, path, value) {
  if (path.length == 0) {
    return appl(state, value);
  }
  if (state == undefined) {
    return set(typeof path[0] == "number" ? [] : {}, path, value);
  }
  if (Array.isArray(state)) {
    const r = state.slice();
    r[path[0]] = set(r[path[0]], path.slice(1), value);
    return r;
  }
  const key = path[0];
  return Object.assign({}, state, {
    [key]: set(state[key], path.slice(1), value)
  });
}

function push(state, path, value) {
  return set(state, path, arr => [...arr, value]);
}

function delArray(arr, pos) {
  return arr.slice(0, pos).concat(arr.slice(pos + 1));
}

function delObj(obj, key) {
  const copy = Object.assign({}, obj);
  delete copy[key];
  return copy;
}

function del(state, path) {
  const last = path[path.length - 1];
  return set(state, path.slice(0, path.length - 1), val =>
    Array.isArray(val) ? delArray(val, last) : delObj(val, last)
  );
}
