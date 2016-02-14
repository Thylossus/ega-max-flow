const graphTraversal = require('./graphTraversal');
const stack = require('../structure/stack');
const log = require('../util/log');

(function() {
  'use strict';

  function dfs(graph, logger) {
    logger.group('Perform depth first search');

    logger.log('Initialize graph traversal');
    let s = stack.create();
    let traverse = graphTraversal.init(s, graph);
    logger.log(`Run graph traversal until the sink (${graph.sink.id}) is found`);
    let output = graphTraversal.run(traverse, graph.sink);
    let result = {
      flowAugmentingPath: output.arcs,
      minCapacity: output.minCapacity
    };
    let last = result.flowAugmentingPath[result.flowAugmentingPath.length - 1];

    if (!(last && last.to.equals(graph.sink))) {
      logger.log('Did not find a flow augmenting path');
      logger.groupEnd();
      // Terminate early if no flow augmenting path was found
      return null;
    }

    logger.log(`Found a flow augmenting path with a capacity of ${graph.sink.parentArcMinCapacity}`)

    logger.groupEnd();

    return result;
  }

  function* iterator(graph) {
    // Only print if console.group is supported
    let logger = log.create();
    let dfsResult = null;
    let flow = {};
    let output = {
      flowAugmentingPath: [],
      flow: flow,
      logger: logger
    };

    logger.group('Algorithm - Ford Fulkerson');
    logger.log('Initialized the graph with the zero flow');

    while (dfsResult = dfs(graph, logger)) {
      logger.group('Saturate arcs along the flow augmenting path');

      dfsResult.flowAugmentingPath.forEach((arc) => {
        logger.group(`Saturate ${arc.from.id} -> ${arc.to.id}`);

        logger.log(`Current flow: ${arc.flow}`);
        logger.log(`Increase by: ${dfsResult.minCapacity}`);

        // Set flow
        arc.increaseFlow(dfsResult.minCapacity);
        flow[arc.id] = arc.flow;

        logger.log(`New flow: ${arc.flow - dfsResult.minCapacity} + ${dfsResult.minCapacity} = ${arc.flow}`);

        logger.groupEnd();
      });

      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });

      output.flowAugmentingPath = dfsResult.flowAugmentingPath;
      output.flow = flow;

      logger.groupEnd();

      yield output;
    }

    logger.log('Terminate because there is no flow-augmenting path');
    logger.groupEnd();

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
