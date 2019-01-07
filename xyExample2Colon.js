/*global require*/

// xyExampleSharp.js using :: syntax rather than the currently proposed .#



const PrivateName = require('./PrivateName');

class Point {
  ::x, ::y; 
  constructor(x, y) {
    this::x = x;
    this::y = y;
  }

  toString() {
    return `<${this::x}:${this::y}>`;
  }

  add(p) {
    return new Point(this::x + p::x,
                     this::y + p::y);
  }

  static isPoint(p) {
    return ::x in p;
  }
}
