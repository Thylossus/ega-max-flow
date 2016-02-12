const random = require('lodash/number/random');
const flatten = require('lodash/array/flatten');
const vertex = require('./vertex');
const arc = require('./arc');
const graph = require('./graph');
const calculation = require('../util/calculation');
const square = require('../util/square');
const graphConfig = require('../../../config/graph');
const sigmaConfig = require('../../../config/sigma');

(function () {
  'use strict';

  class Generator {
    constructor(numberOfVertices, maxCapacity, ordered) {
      this.numberOfVertices = numberOfVertices;
      this.maxCapacity = maxCapacity;
      if (ordered === undefined) {
        this.ordered = graphConfig.VERTICES_ORDERED;
      } else {
        this.ordered = ordered;
      }

    }

    run() {
      let separatedGrid = square.separate(graphConfig.GRID_SIZE, this.numberOfVertices);
      let quadrants = separatedGrid.quadrants.slice(0, this.numberOfVertices);
      let source;
      let sink;

      let vertices = quadrants.map((quadrant) => {
        let x = this.ordered ? quadrant.x1 : random(quadrant.x1, quadrant.x2);
        let y = this.ordered ? quadrant.y1 : random(quadrant.y1, quadrant.y2);
        let v = vertex.create(x, y);

        if (quadrant.id === 0) {
          v.type = graphConfig.VERTEX_TYPE.SOURCE;
          v.color = sigmaConfig.SOURCE_COLOR;
          source = v;
        } else if (quadrant.id === this.numberOfVertices - 1) {
          v.type = graphConfig.VERTEX_TYPE.SINK;
          v.color = sigmaConfig.SINK_COLOR;
          sink = v;
        }

        return v;
      });

      let arcs = vertices.map((v1, idx) => {
        // Only add forward arcs
        // This reduces computational overhead for sorting and finding intersecting arcs
        // Backwards arcs are added later
        return vertices.slice(idx + 1).map((v2) => {
          return arc.create(v1, v2, random(this.maxCapacity));
        });
      });
      arcs = flatten(arcs)
        .sort((a1, a2) => {
          return a1.compare(a2);
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

      // Add backwards arcs
      arcs = arcs.concat(arcs.map((a) => {
        let reverse = arc.create(a.to, a.from, random(this.maxCapacity))
        a.reverse = reverse;
        reverse.reverse = a;
        return reverse;
      }));

      // Adjust capacities for arcs that are connected to the source or the sink.
      // These arcs must not belong to a minimum cut.
      let maxUsedCapacity = arcs.reduce((max, arc) => {
        return Math.max(max, arc.capacity);
      }, 0);

      arcs.forEach((a) => {
        // Update capacity
        if (a.from.equals(source) || a.to.equals(source) || a.from.equals(sink) || a.to.equals(sink)) {
          a.setInitialCapacity(Math.min(maxUsedCapacity + 1, this.maxCapacity));
        }

        // Add to outgoing arcs
        a.from.outgoingArcs.push(a);
      });

      // Create graph
      let g = graph.create(vertices, arcs);

      // Set source and sink of the graph
      g.source = source;
      g.sink = sink;

      return g;
    }
  }

  exports.create = (numberOfVertices, maxCapacity, ordered) => {
    return new Generator(numberOfVertices, maxCapacity, ordered);
  };
})();
