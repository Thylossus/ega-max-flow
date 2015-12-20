const random = require('lodash/number/random');
const graphConfig = require('../../../config/graph');
const sigmaConfig = require('../../../config/sigma');

(function () {
  'use strict';

  var count = 0;

  function id_gen() {
    count += 1;
    return `v${count}`;
  }

  class Vertex {
    constructor(x, y) {
      this.id = id_gen();
      this.x = x === undefined ? random(graphConfig.GRID_SIZE) : x;
      this.y = y === undefined ? random(graphConfig.GRID_SIZE) : y;
      this.size = sigmaConfig.NODE_SIZE;
      this.label = this.id;
    }

    equals(other) {
      return this.id === other.id;
    }
  }

  exports.create = (x, y) => {
    return new Vertex(x, y);
  };
})();
