const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');

(function() {
  'use strict';

  function bfs(graph) {
    let q = queue.create();
    let traverse = graphTraversal.init(q, graph);
    let output = graphTraversal.run(traverse, graph.sink);

    let last = output.lexicographical[output.lexicographical.length - 1];

    if (!last || !last.equals(graph.sink)) {
      // Terminate early if no flow augmenting path was found
      return null;
    }

    let item = graph.sink;

    let result = {
      sink: graph.sink,
      minCapacity: graph.sink.parentArcMinCapacity
    };


    return result;
  }

  function* iterator(graph) {
    let bfsResult = null;
    let flow = {};
    let output = {
      flowAugmentingPath: [],
      flow: flow
    };

    while (bfsResult = bfs(graph)) {
      let arc;
      let vertex = bfsResult.sink;

      // Reset flowAugmentingPath
      output.flowAugmentingPath = [];

      while (vertex) {
        arc = vertex.parentArc;

        if (arc) {
          output.flowAugmentingPath.push(arc);
          arc.increaseFlow(bfsResult.minCapacity);
          flow[arc.id] = arc.flow;
        }

        vertex = vertex.parent;
      }

      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });

      output.flow = flow;

      yield output;
    }

    return output;
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  exports.run = (iterator) => {
    let output = null;
    let result = iterator.next();

    while (!result.done) {
      output = result.value;
      result = iterator.next();

    }

    return output;
  };
}());
