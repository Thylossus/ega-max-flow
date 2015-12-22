(function () {
  'use strict';

  class Graph {
    constructor(vertices, arcs) {
      this.vertices = vertices || [];
      this.arcs = arcs || [];
    }

    getFlow() {
      return this.arcs.reduce((result, arc) => {
        result[arc.id] = arc.flow;
        return result;
      }, {});
    }

    reset() {
      this.arcs.map((arc) => {
        arc.capacity = arc.initCapacity;
        arc.flow = 0;

        return arc;
      });

      return this;
    }
  }

  exports.create = (vertices, arcs) => {
    return new Graph(vertices, arcs);
  };
})();
