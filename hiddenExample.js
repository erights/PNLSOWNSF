/*global require*/

// Original syntax-free example from
// https://github.com/zenparsing/hidden-state/blob/master/README.md
// but without gratutous differences from hiddenExampleArrow.js

const { hiddenState } = require('./hidden-state');

const [getState, initState, isInstance] = hiddenState('Point');

class Point {
 
  constructor(x, y) {
    initState(this, { x, y });
  }

  toString() {
    let { x, y } = getState(this);
    return `<${x}:${y}>`;
  }

  add(p) {
    let { x, y } = getState(this);
    let { x: x1, y: y1 } = getState(p);
    return new Point(x + x1, y + y1);
  }

  static isPoint(p) {
    return isInstance(p);
  }
}
