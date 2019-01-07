/*global require*/

// hiddenExample.js redone using a PrivateName per instance variable.



const PrivateName = require('./PrivateName');

const _x = new PrivateName();
const _y = new PrivateName();

class Point {
 
  constructor(x, y) {
    _x.init(this, x);
    _y.init(this, y);
  }

  toString() {
    return `<${_x.get(this)}:${_y.get(this)}>`;
  }

  add(p) {
    return new Point(_x.get(this) + _x.get(p),
                     _y.get(this) + _y.get(p));
  }

  static isPoint(p) {
    return _x.has(p);
  }
}
