const log = require('../util/log');
const algorithms = require('../algorithm');
const fordFulkerson = algorithms.fordFulkerson;
const edmondsKarp = algorithms.edmondsKarp;
const dinic = algorithms.dinic;
const preflowPush = algorithms.preflowPush;
const graphGen = require('../graph/generator');
const moment = require('moment');

const ALGORITHM_NAMES = ['Ford Fulkerson', 'Edmonds Karp', 'Dinic', 'Preflow-Push'];
const FORD_FULKERSON = 0;
const EDMONDS_KARP = 1;
const DINIC = 2;
const PREFLOW_PUSH = 3;

(function() {
  'use strict';

  let getTime = function getTime() {
    return moment().format('HH:mm:ss.SSS');
  };

  let getMaxFlow = function getMaxFlow(graph) {
    return graph.source.outgoingArcs.reduce((sum, arc) => {
      return sum + arc.flow - arc.reverse.flow;
    }, 0);
  };

  let runAlgorithm = function (algo, algofn, graph, logger) {
    let result = {};
    // Ford Fulkerson
    logger.group(`Run ${ALGORITHM_NAMES[algo]}`);
    logger.log(`Started at ${getTime()}`);

    let algoResult = algofn.run(fordFulkerson.init(graph));

    logger.log(`Finished at ${getTime()}`);

    // Get maximum flow
    let maxFlow = getMaxFlow(graph);
    logger.log(`The maximum flow is ${maxFlow}`);

    // Validate residual graph
    validateResidualGraph(graph, logger);

    // Add logger and max flow to results
    result.maxFlow = maxFlow;
    result.logger = algoResult.logger;

    // Reset graph
    graph.reset();
    // Close algorithm logging group
    logger.groupEnd();

    return result;
  };

  let checkMaxFlowEquality = function checkMaxFlowEquality(maxFlow, allMaxFlows, logger) {
    logger.group('Checking if all algorithms found the same maximum flow value');
    let allMaxFlowsEqual = allMaxFlows.reduce((predicate, max, index) => {
      predicate = predicate && maxFlow === max;
      if (!predicate) {
        logger.error(`The maximum flow differes for ${ALGORITHM_NAMES[index]}`);
        logger.error(`Expected a maximum flow of ${maxFlow} but saw a maximum flow of ${max}`);
      }
      return predicate;
    }, true);

    if (allMaxFlowsEqual) {
      logger.log('Finished checking');
      logger.log(`All algorithms found the same maximum flow value of ${maxFlow}`);
    }

    logger.groupEnd();

    return allMaxFlowsEqual;
  };

  let normalIteration = function normalIteration(graph, iteration) {
    let logger = log.create();
    let result = [];
    let allMaxFlows = [];
    let runResult;
    let maxFlow;

    logger.group(`Iteraton ${iteration}`);

    // Ford Fulkerson
    runResult = runAlgorithm(FORD_FULKERSON, fordFulkerson, graph, logger);
    result.push(runResult.logger);
    allMaxFlows.push(runResult.maxFlow);

    // Edmonds Karp
    runResult = runAlgorithm(EDMONDS_KARP, edmondsKarp, graph, logger);
    result.push(runResult.logger);
    allMaxFlows.push(runResult.maxFlow);

    // Dinic
    runResult = runAlgorithm(DINIC, dinic, graph, logger);
    result.push(runResult.logger);
    allMaxFlows.push(runResult.maxFlow);

    // Preflow-Push
    runResult = runAlgorithm(PREFLOW_PUSH, preflowPush, graph, logger);
    result.push(runResult.logger);
    allMaxFlows.push(runResult.maxFlow);

    // Check if all algorithms produced the same outcome, i.e. max flow
    // Use ford fulkerson's maximum flow as a reference value
    maxFlow = allMaxFlows[0];
    checkMaxFlowEquality(maxFlow, allMaxFlows, logger);

    // Close iteration logging group
    logger.groupEnd();

    // Add iteration logger to result array
    result.push(logger);

    return result;
  };

  let validateResidualGraph = function validateResidualGraph(graph, logger) {

  };

  module.exports = (instances, vertices, maxCapacity) => {
    let result = [];

    for (var i = 0; i < instances; i++) {
      // Generate graph (provide false to ensure that the graph is unordered)
      let graph = graphGen.create(vertices, maxCapacity, false).run();

      // Set result for this instance
      result[i] = normalIteration(graph, i);

    }

    return result;
  };
}());
