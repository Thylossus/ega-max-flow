const graphTraversal = require('./graphTraversal');
const stack = require('../structure/stack');
const log = require('../util/log');

(function() {
  'use strict';

  function dfs(graph, logger) {
    logger.group('Perform depth first search');

    logger.log('Initialize graph traversal');
    // Initialize the graph traversal with a stack
    // A stack is used because the graph has to be traversed depth first
    let s = stack.create();
    let traverse = graphTraversal.init(s, graph);
    logger.log(`Run graph traversal until the sink (${graph.sink.id}) is found`);
    // Run graph traversal until the sink is found
    let output = graphTraversal.run(traverse, graph.sink);
    let result = {
      flowAugmentingPath: output.arcs,
      minCapacity: output.minCapacity,
      visitedVertices: output.lexicographical
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
      logger: logger,
      incFlow: 0
    };

    logger.group('Algorithm - Ford Fulkerson');
    // Induction basis: start with a feasible flow => zero flow
    logger.log('Initialized the graph with the zero flow');

    // Induction step: use depth-first search to find a flow augmenting path
    //                 until no more augmenting paths can be found
    while (dfsResult = dfs(graph, logger)) {
      logger.group('Saturate arcs along the flow augmenting path');

      // Increase flow along the flow augmenting path
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

      // Reset visited vertices
      dfsResult.visitedVertices.forEach((vertex) => {
        vertex.reset();
      });

      output.incFlow = dfsResult.minCapacity;
      output.flowAugmentingPath = dfsResult.flowAugmentingPath;
      output.flow = flow;

      logger.groupEnd();

      // Iteration finished: flow is feasible

      yield output;
    }
    // BREAK CONDITION: there is no flow-augmenting path

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
