class token {
  constructor(s) {
    this.s = s;
  }
}

class wrap extends token {
  constructor(s, tag) {
    super(s);
    this.tag = tag;
  }

  toString() {
    return `<${this.tag}>${this.s}</${this.tag}>`;
  }
}

class text extends token {
  toString() {
    return this.s;
  }
}

export const markdown = str => {
  const l = new lexer(str);
  const tt = [];
  while (l.more()) {
    const t = l.read();
    if (!t) break;
    tt.push(t);
  }
  return tt.map(t => t.toString()).join("");
};

class lexer {
  /**
   * @param {string} s
   */
  constructor(s) {
    this.s = s.replace(/\r/g, "");
    this.pos = 0;
  }

  next() {
    return this.s[this.pos];
  }

  get() {
    return this.s[this.pos++];
  }

  more() {
    return this.pos < this.s.length;
  }

  read() {
    if (!this.more()) return null;
    return (
      this.codeBlock() ||
      this.em() ||
      this.code() ||
      this.text() ||
      this.error()
    );
  }

  error() {
    throw new Error("unrecognized sequence: " + this.s.substr(this.pos));
  }

  startsWith(s) {
    return this.s.substr(this.pos).startsWith(s);
  }

  skip(s) {
    if (!this.startsWith(s)) return false;
    this.pos += s.length;
    return true;
  }

  codeBlock() {
    if (!this.skip("```")) return null;
    this.skip("\n");
    let s = "";
    while (this.more && !this.startsWith("```")) {
      s += this.get();
    }
    this.skip("```");
    this.skip("\n");
    return new wrap(s, "pre");
  }

  em() {
    if (this.next() != "*") {
      return null;
    }
    this.get();
    let s = "";
    while (this.more() && this.next() != "*") {
      s += this.get();
    }
    if (this.next() == "*") this.get();
    return new wrap(s, "em");
  }

  code() {
    if (this.next() != "`") {
      return null;
    }
    this.get();
    let s = "";
    while (this.more() && this.next() != "`") {
      s += this.get();
    }
    if (this.next() == "`") this.get();
    return new wrap(s, "code");
  }

  text() {
    if (!this.more()) return null;
    let s = "";
    while (this.more() && this.next() != "`" && this.next() != "*") {
      s += this.get();
    }
    return new text(s);
  }
}
