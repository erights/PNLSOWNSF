/*global require*/
// An experiment to see how the example at
// hiddenExample.js
// looks using the syntax proposed at
/*
https://github.com/tc39/proposal-class-fields/issues/183#issuecomment-451733300 
*/
// assuming that we accept at least dotted paths after the "->"

const PrivateName = require('./PrivateName');

const state = new PrivateName();

class Point {

  constructor(x, y) {
    this->state.init({ x, y });
  }

  toString() {
    let { x, y } = this->state.get();
    return `<${ x }:${ y }>`;
  }

  add(p) {
    let { x: x1, y: y1 } = this->state.get();
    let { x: x2, y: y2 } = p->state.get();
    return new Point(x1 + x2, y1 + y2);
  }

  static isPoint(x) {
    return x->state.has();
  }
}
