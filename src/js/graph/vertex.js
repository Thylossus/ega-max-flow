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
      this.color = sigmaConfig.NODE_COLOR;
      this.label = this.id;
      this.type = graphConfig.VERTEX_TYPE.OTHER;
      this.outgoingArcs = [];
      this.currentArcIndex = -1;
      this.seen = false;
      this.finished = false;
    }

    equals(other) {
      return this.id === other.id;
    }

    reset() {
      this.currentArcIndex = -1;
      this.seen = false;
      this.finished = false;

      return this;
    }
  }

  exports.create = (x, y) => {
    return new Vertex(x, y);
  };
})();
