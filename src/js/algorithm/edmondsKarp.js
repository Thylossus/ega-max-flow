const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');
const log = require('../util/log');

(function() {
  'use strict';

  function bfs(graph, logger) {
    logger.group('Perform breadth first search');

    logger.log('Initialize graph traversal');
    // Initialize graph traversal with queue in order to perform a breadth-first search
    let q = queue.create();
    let traverse = graphTraversal.init(q, graph);
    logger.log(`Run graph traversal until the sink (${graph.sink.id}) is found`);
    // Run graph traversal until the sink is found
    let output = graphTraversal.run(traverse, graph.sink);

    let last = output.lexicographical[output.lexicographical.length - 1];

    // Check if the sink was detected
    if (!last || !last.equals(graph.sink)) {
      logger.log('Did not find a flow augmenting path');
      logger.groupEnd();
      // Terminate early if no flow augmenting path was found
      return null;
    }

    logger.log(`Found a flow augmenting path with a capacity of ${graph.sink.parentArcMinCapacity}`);

    let result = {
      sink: graph.sink,
      minCapacity: graph.sink.parentArcMinCapacity,
      visitedVertices: output.lexicographical
    };

    logger.groupEnd();

    return result;
  }

  // O(nm^2)
  function* iterator(graph) {
    let logger = log.create();
    let bfsResult = null;
    let flow = {};
    let output = {
      flowAugmentingPath: [],
      flow: flow,
      logger: logger,
      incFlow: 0
    };

    logger.group('Algorithm - Edmonds-Karp');
    // Induction basis: initialize a feasible flow => zero flow
    logger.log('Initialized the graph with the zero flow');

    // Induction step: find a flow augmenting path with the smallest number of arcs
    // Since the smalles number of arcs has to be found, use breadth-first search
    while (bfsResult = bfs(graph, logger)) {
      let arc;
      let vertex = bfsResult.sink;

      logger.group('Saturate arcs along the flow augmenting path');

      // Reset flowAugmentingPath
      output.flowAugmentingPath = [];

      // Increase flow along the flow augmenting path
      while (vertex) {
        arc = vertex.parentArc;

        if (arc) {
          logger.group(`Saturate ${arc.from.id} -> ${arc.to.id}`);

          logger.log(`Current flow: ${arc.flow}`);
          logger.log(`Increase by: ${bfsResult.minCapacity}`);

          output.flowAugmentingPath.push(arc);
          arc.increaseFlow(bfsResult.minCapacity);
          flow[arc.id] = arc.flow;

          logger.log(`New flow: ${arc.flow - bfsResult.minCapacity} + ${bfsResult.minCapacity} = ${arc.flow}`);

          logger.groupEnd();
        }

        vertex = vertex.parent;
      }

      // Reset visited vertices
      bfsResult.visitedVertices.forEach((vertex) => {
        vertex.reset();
      });

      output.incFlow = bfsResult.minCapacity;
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
