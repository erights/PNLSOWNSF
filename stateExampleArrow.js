/*global require*/

// hiddenExampleArrow.js using PrivateName instead of hiddenState
// assuming that we accept at least dotted paths after the "->"


const PrivateName = require('./PrivateName');

const state = new PrivateName();

class Point {

  constructor(x, y) {
    this->state.init({ x, y });
  }

  toString() {
    let { x, y } = this->state.get();
    return `<${x}:${y}>`;
  }

  add(p) {
    let { x, y } = this->state.get();
    let { x: x1, y: y1 } = p->state.get();
    return new Point(x + x1, y + y1);
  }

  static isPoint(p) {
    return p->state.has();
  }
}
