const range = require('lodash/utility/range');
const random = require('lodash/number/random');
const flatten = require('lodash/array/flatten');
const vertex = require('./vertex');
const arc = require('./arc');
const graph = require('./graph');
const calculation = require('../util/calculation');

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
      arcs = flatten(arcs)
        .sort((a1, a2) => {
          return a1.compare(a2);
        })
        .filter((arc) => {
          // Remove arcs from a vertex to itself
          return !calculation.equalPosition(arc.from, arc.to);
        });

      // Remove intersecting arcs
      arcs = arcs
        .filter((arc, index) => {
          // Remove intersecting arcs (only comparing with previous arcs)
          return arcs.slice(0, index).every((other) => {
            if (arc.equals(other)) {
              return true;
            }
            return !calculation.intersect(arc, other);
          });
        });

      return graph.create(vertices, arcs);
    }
  }

  exports.create = (numberOfVertices, maxCapacity) => {
    return new Generator(numberOfVertices, maxCapacity);
  };
})();
