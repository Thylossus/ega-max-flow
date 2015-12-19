const range = require('lodash/utility/range');
const random = require('lodash/number/random');
const flatten = require('lodash/array/flatten');
const vertex = require('./vertex');
const arc = require('./arc');
const graph = require('./graph');

(function () {
  'use strict';

  class Generator {
    constructor(numberOfVertices, maxCapacity) {
      this.numberOfVertices = numberOfVertices;
      this.maxCapacity = maxCapacity;
    }

    run() {
      let vertices = range(this.numberOfVertices).map(() => {
        return vertex.create();
      });

      let arcs = vertices.map((v1) => {
          return vertices.map((v2) => {
            return arc.create(v1, v2, random(this.maxCapacity));
          });
        });
      arcs = flatten(arcs);

      return graph.create(vertices, arcs);
    }
  }

  exports.create = (numberOfVertices, maxCapacity) => {
    return new Generator(numberOfVertices, maxCapacity);
  };
})();
