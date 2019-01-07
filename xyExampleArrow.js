/*global require*/

// hiddenExampleArrow.js done using a PrivateName per instance variable.



const PrivateName = require('./PrivateName');

const _x = new PrivateName();
const _y = new PrivateName();

class Point {
 
  constructor(x, y) {
    this->_x.init(x);
    this->_y.init(y);
  }

  toString() {
    return `<${this->_x.get()}:${this->_y.get()}>`;
  }

  add(p) {
    return new Point(this->_x.get() + p->_x.get(),
                     this->_y.get() + p->_y.get());
  }

  static isPoint(p) {
    return p->_x.has();
  }
}
