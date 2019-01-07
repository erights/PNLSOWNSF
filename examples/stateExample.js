/*global require*/

// hiddenExample.js using PrivateName instead of hiddenState



const PrivateName = require('./PrivateName');

const state = new PrivateName();

class Point {
 
  constructor(x, y) {
    state.init(this, { x, y });
  }

  toString() {
    let { x, y } = state.get(this);
    return `<${x}:${y}>`;
  }

  add(p) {
    let { x, y } = state.get(this);
    let { x: x1, y: y1 } = state.get(p);
    return new Point(x + x1, y + y1);
  }

  static isPoint(p) {
    return state.has(p);
  }
}
