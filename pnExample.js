/*global require*/
// An experiment to see how the example at
// https://github.com/zenparsing/hidden-state/blob/master/README.md
// looks using PrivateName from
// https://github.com/erights/PLNSOWNSF/blob/master/PrivateName.js
// instead of hiddenState from
// https://github.com/zenparsing/hidden-state/blob/master/src/hidden-state.js


const PrivateName = require('./PrivateName');

const state = new PrivateName();

class Point {

  constructor(x, y) {
    state.init(this, { x, y });
  }

  toString() {
    let { x, y } = state.get(this);
    return `<${ x }:${ y }>`;
  }

  add(point) {
    let { x: x1, y: y1 } = state.get(this);
    let { x: x2, y: y2 } = state.get(point);
    return new Point(x1 + x2, y1 + y2);
  }

  static isPoint(obj) {
    return state.has(obj);
  }
}
