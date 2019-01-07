/*global require*/
// Original syntax example from
/*
https://github.com/tc39/proposal-class-fields/issues/183#issuecomment-451733300
*/




const { hiddenState } = require('./hidden-state');

const [getState, initState, isInstance] = hiddenState('Point'); 

class Point {
  
  constructor(x, y) {
    this->initState({ x, y });
  }

  toString() {
    let { x, y } = this->getState();
    return `<${x}:${y}>`;
  }

  add(p) {
    let { x, y } = this->getState();
    let { x: x1, y: y1 } = p->getState();
    return new Point(x + x1, y + y1);
  }

  static isPoint(x) {
    return x->isInstance();
  }
}
