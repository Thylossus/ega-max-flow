const graphTraversal = require('./graphTraversal');
const stack = require('./stack');

(function() {
  'use strict';

  function dfs(graph) {
    let s = stack.create();
    let traverse = graphTraversal.init(s, graph);
    let output = graphTraversal.run(traverse, graph.sink);
    let result = {
      flowAugmentingPath: output.arcs,
      minCapacity: output.minCapacity
    };
    let last = result.flowAugmentingPath[result.flowAugmentingPath.length - 1];

    return last.to.equals(graph.sink) ? result : null;
  }

  function* iterator(graph) {
    let dfsResult = null;
    let flow = {};
    let output = {
      flowAugmentingPath: [],
      flow: flow
    };

    while (dfsResult = dfs(graph)) {
      console.log('dfsResult', dfsResult);
      dfsResult.flowAugmentingPath.forEach((arc) => {
        // Reset vertices
        arc.to.reset();
        // Set flow
        arc.setFlow(dfsResult.minCapacity);
        flow[arc.id] = arc.flow;
      });

      // Reset source (this is the only vertex which is not reset in the previous loop)
      graph.source.reset();

      output.flowAugmentingPath = dfsResult.flowAugmentingPath;
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
