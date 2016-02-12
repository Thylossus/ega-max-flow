const log = require('../util/log');
const algorithms = require('../algorithm');
const fordFulkerson = algorithms.fordFulkerson;
const edmondsKarp = algorithms.edmondsKarp;
const dinic = algorithms.dinic;
const preflowPush = algorithms.preflowPush;
const graphGen = require('../graph/generator');

(function() {
  'use strict';

  let normalIteration = function normalIteration(graph) {
    let result = [];
    // Ford Fulkerson
    let ffResult = fordFulkerson.run(fordFulkerson.init(graph));
    // Add logger to results array
    result.push(ffResult.logger);
    // Reset graph
    graph.reset();

    // Edmonds Karp
    let ekResult = edmondsKarp.run(edmondsKarp.init(graph));
    // Add logger to results array
    result.push(ekResult.logger);
    // Reset graph
    graph.reset();

    // Dinic
    let diResult = dinic.run(dinic.init(graph));
    // Add logger to results array
    result.push(diResult.logger);
    // Reset graph
    graph.reset();

    // Preflow-Push
    let ppRestult = preflowPush.run(preflowPush.init(graph));
    // Add logger to results array
    result.push(ppRestult.logger);

    return result;
  };

  module.exports = (instances, vertices, maxCapacity) => {
    let result = [];

    for (var i = 0; i < instances; i++) {
      // Generate graph
      let graph = graphGen.create(vertices, maxCapacity).run();

      // Set result for this instance
      result[i] = normalIteration(graph);

    }

    return result;
  };
}());
