(function () {
  'use strict';

  class Graph {
    constructor(vertices, arcs) {
      this.vertices = vertices || [];
      this.arcs = arcs || [];
      this.source = null;
      this.sink = null;
    }

    getFlow() {
      return this.arcs.reduce((result, arc) => {
        result[arc.id] = arc.flow;
        return result;
      }, {});
    }

    reset() {
      this.arcs.map((arc) => {return arc.reset();});

      this.vertices.map((vertex) => {return vertex.reset();});

      return this;
    }
  }

  exports.create = (vertices, arcs) => {
    return new Graph(vertices, arcs);
  };
})();
