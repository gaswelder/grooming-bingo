module.exports = {
  command,
  set,
  push,
  del
};

function path(template, args) {
  if (template.length == 0) {
    return template;
  }
  const [t, ...tt] = template;
  if (t == "#") {
    return [args[0], ...path(tt, args.slice(1))];
  } else {
    return [t, ...path(tt, args)];
  }
}

function command(state, command) {
  const [name, pathTemplate, pathArgs, value] = command;
  const func = { set, push, del };
  return func[name](state, path(pathTemplate, pathArgs), value);
}

//

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
