export function elem(tagName, children = []) {
  const p = document.createElement(tagName);
  for (const c of children) {
    if (typeof c == "string") {
      const t = document.createTextNode(c);
      p.appendChild(t);
    } else {
      p.appendChild(c);
    }
  }
  return p;
}
