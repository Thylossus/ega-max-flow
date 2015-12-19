(function () {
  'use strict';

  class Graph {
    constructor(vertices, arcs) {
      this.vertices = vertices || [];
      this.arcs = arcs || [];
    }
  }

  exports.create = (vertices, arcs) => {
    return new Graph(vertices, arcs);
  };
})();
