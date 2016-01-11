const random = require('lodash/number/random');
const graphConfig = require('../../../config/graph');
const sigmaConfig = require('../../../config/sigma');

(function () {
  'use strict';

  let count = 0;

  function id_gen() {
    count += 1;
    return `v${count}`;
  }

  function buildLabel(vertex) {
    return vertex.id + ' (' + (vertex.level === Infinity ? 'inf' : vertex.level) + ')';
  }

  class Vertex {
    constructor(x, y) {
      this.id = id_gen();
      this.x = x === undefined ? random(graphConfig.GRID_SIZE) : x;
      this.y = y === undefined ? random(graphConfig.GRID_SIZE) : y;
      this.size = sigmaConfig.NODE_SIZE;
      this.color = sigmaConfig.NODE_COLOR;
      this.type = graphConfig.VERTEX_TYPE.OTHER;
      this.outgoingArcs = [];
      this.currentArcIndex = -1;
      this.seen = false;
      this.finished = false;
      // These properties are required to find a path with BFS
      this.parent = null;
      this.parentArc = null;
      this.parentArcMinCapacity = Infinity;
      // These properties are requred for building a level graph
      this.level = Infinity;
      // These properties are required for preflow-push
      this.distance = 0;
      this.excess = 0;

      // Build the label
      this.label = buildLabel(this);
    }

    equals(other) {
      return this.id === other.id;
    }

    reset() {
      this.currentArcIndex = -1;
      this.seen = false;
      this.finished = false;
      this.parent = null;
      this.parentArc = null;
      this.parentArcMinCapacity = Infinity;
      this.level = Infinity;
      this.label = buildLabel(this);
      this.distance = 0;
      this.excess = 0;

      return this;
    }

    nextArc() {
      this.currentArcIndex += 1;
      return this.outgoingArcs[this.currentArcIndex] || null;
    }

    setLevel(level) {
      this.level = level;
      this.label = buildLabel(this);
    }
  }

  exports.create = (x, y) => {
    return new Vertex(x, y);
  };
})();
