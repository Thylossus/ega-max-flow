const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');
const log = require('../util/log');

(function() {
  'use strict';

  function bfs(graph, logger) {
    logger.group('Perform breadth first search');

    logger.log('Initialize graph traversal');
    let q = queue.create();
    let traverse = graphTraversal.init(q, graph);
    logger.log(`Run graph traversal until the sink (${graph.sink.id}) is found`);
    let output = graphTraversal.run(traverse, graph.sink);

    let last = output.lexicographical[output.lexicographical.length - 1];

    if (!last || !last.equals(graph.sink)) {
      logger.log('Did not find a flow augmenting path');
      logger.groupEnd();
      // Terminate early if no flow augmenting path was found
      return null;
    }

    logger.log(`Found a flow augmenting path with a capacity of ${graph.sink.parentArcMinCapacity}`);

    let result = {
      sink: graph.sink,
      minCapacity: graph.sink.parentArcMinCapacity
    };

    logger.groupEnd();

    return result;
  }

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

    logger.group('Algorithm - Edmonds Karp');
    logger.log('Initialized the graph with the zero flow');

    while (bfsResult = bfs(graph, logger)) {
      let arc;
      let vertex = bfsResult.sink;

      logger.group('Saturate arcs along the flow augmenting path');

      // Reset flowAugmentingPath
      output.flowAugmentingPath = [];

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

      // Reset vertices
      graph.vertices.forEach((vertex) => {
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
