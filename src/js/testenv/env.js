const log = require('../util/log');
const algorithms = require('../algorithm');
const fordFulkerson = algorithms.fordFulkerson;
const edmondsKarp = algorithms.edmondsKarp;
const dinic = algorithms.dinic;
const preflowPush = algorithms.preflowPush;
const graphGen = require('../graph/generator');
const moment = require('moment');
const graphConfig = require('../../../config/graph');
const random = require('lodash/number/random');

const ALGORITHM_NAMES = ['Ford Fulkerson', 'Edmonds Karp', 'Dinic', 'Preflow-Push'];
const FORD_FULKERSON = 0;
const EDMONDS_KARP = 1;
const DINIC = 2;
const PREFLOW_PUSH = 3;

const SEPARATOR = '--------------------------------------------------------------------------------';

(function() {
  'use strict';

  let getTime = function getTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  let getMaxFlow = function getMaxFlow(graph) {
    return graph.source.outgoingArcs.reduce((sum, arc) => {
      return sum + arc.flow - arc.reverse.flow;
    }, 0);
  };

  let runAlgorithm = function (algo, algofn, graph, logger) {
    let result = {};

    logger.group(`Run ${ALGORITHM_NAMES[algo]}`);
    logger.log(`Started at ${getTime()}`);

    let algoResult = algofn.run(algofn.init(graph));

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

  let validateResidualGraph = function validateResidualGraph(graph, logger) {
    let valid = true;

    logger.group('Checking if capacity constraint satisfied');
    valid = graph.arcs.reduce((valid, arc) => {
      let reverse = arc.reverse;
      let flow = arc.flow;
      if (reverse) {
        flow = flow - reverse.flow;
      }

      let arcValid = arc.initCapacity >= flow;

      if (!arcValid) {
        logger.error(`Arc ${arc.id} violates the capacity constraint! Its capacity is ${arc.initCapacity} and the flow on it is ${arc.flow}`);
      }
      return valid && arcValid;
    }, valid);
    if (valid) {
      logger.log('All arcs satisfy the capacity constraint');
      logger.groupEnd();
    } else {
      logger.groupEnd();
      return valid;
    }


    logger.group('Checking if flow conservation constraint is satisfied');
    valid = graph.vertices.reduce((valid, vertex) => {
      if (vertex.type === graphConfig.VERTEX_TYPE.SOURCE || vertex.type === graphConfig.VERTEX_TYPE.SINK) {
        return valid;
      }

      let inbound = graph.arcs.filter((arc) => {
        return arc.to.equals(vertex);
      });
      let outbound = graph.arcs.filter((arc) => {
        return arc.from.equals(vertex);
      });

      let inboundFlow = inbound.reduce((sum, arc) => {
        return sum + arc.flow;
      }, 0);
      let outboundFlow = outbound.reduce((sum, arc) => {
        return sum + arc.flow;
      }, 0);

      let vertexValid = inboundFlow === outboundFlow;

      if (!vertexValid) {
        logger.error(`Vertex ${vertex.id} violates the flow conservation constraint! Its inbound flow is ${inboundFlow} and its outbound flow is ${outboundFlow}`);
      }

      return valid && vertexValid;
    }, valid);

    if (valid) {
      logger.log('All arcs satisfy the flow conservation constraint');
    }

    logger.groupEnd();

    return valid;
  };

  let logSeparator = function logSeparator(logger) {
    logger.log();
    logger.log(SEPARATOR);
    logger.log();
  };

  let normalIteration = function normalIteration(graph, iteration) {
    let logger = log.create();
    let result = [];
    let allMaxFlows = [];
    let runResult;
    let maxFlow;

    logSeparator(logger);
    logger.group(`Iteration ${iteration + 1}`);

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

    // Log separator
    logSeparator(logger);

    // Add iteration logger to result array
    result.push(logger);

    return result;
  };

  let manipulatedIteration = function(graph) {
    // provoke errors by manipulating arc capacities etc.
    let logger = log.create();
    let allMaxFlows = [];
    let runResult;
    let maxFlow;

    logSeparator(logger);
    logger.group(`Manipulated iteration`);
    logger.log('This iteration verifies that all performed checks can detect errors')

    // Ford Fulkerson
    runResult = capacityConstraintFail(FORD_FULKERSON, fordFulkerson, graph, logger);
    allMaxFlows.push(runResult);

    // Edmonds Karp
    runResult = flowConservationFail(EDMONDS_KARP, edmondsKarp, graph, logger);
    allMaxFlows.push(runResult);

    // Dinic
    runResult = capacityConstraintFail(DINIC, dinic, graph, logger);
    allMaxFlows.push(runResult);

    // Preflow-Push
    runResult = flowConservationFail(PREFLOW_PUSH, preflowPush, graph, logger);
    // Manipulate the max flow to simulate failed "checkMaxFlowEquality"
    allMaxFlows.push(runResult + 1);

    // Check if all algorithms produced the same outcome, i.e. max flow
    // Use ford fulkerson's maximum flow as a reference value
    maxFlow = allMaxFlows[0];
    checkMaxFlowEquality(maxFlow, allMaxFlows, logger);

    // Close iteration logging group
    logger.groupEnd();

    // Log separator
    logSeparator(logger);

    return logger;
  };

  let capacityConstraintFail = function (algo, algofn, graph, logger) {
    logger.group(`Simulate flow constraint violation for ${ALGORITHM_NAMES[algo]}`);
    logger.log(`Started at ${getTime()}`);

    let algoResult = algofn.run(algofn.init(graph));
    // Get maximum flow
    let maxFlow = getMaxFlow(graph);

    logger.log(`Finished at ${getTime()}`);

    // Set the flow of an arbitrary arc to an invalid value
    let arc = graph.arcs[random(graph.arcs.length - 1)];
    let reverse = arc.reverse;
    let flow = arc.reverse ? arc.flow - reverse.flow : arc.flow;
    let maxCapacity = arc.reverse ? arc.initCapacity + reverse.initCapacity : arc.initCapacity;

    logger.log(`Random arc ${arc.id} with capacity ${arc.initCapacity} and flow ${flow}`);
    logger.log(`Set flow to ${maxCapacity + 1}`);
    arc.flow = maxCapacity + 1;

    // Validate residual graph
    validateResidualGraph(graph, logger);

    // Reset graph
    graph.reset();
    // Close algorithm logging group
    logger.groupEnd();

    return maxFlow;
  };

  let flowConservationFail = function (algo, algofn, graph, logger) {
    logger.group(`Simulate flow conservation violation for ${ALGORITHM_NAMES[algo]}`);
    logger.log(`Started at ${getTime()}`);

    let algoResult = algofn.run(algofn.init(graph));
    // Get maximum flow
    let maxFlow = getMaxFlow(graph);

    logger.log(`Finished at ${getTime()}`);

    let vertex;
    let inbound;
    // Set the inbound flow of an arbitrary vertex to a value higher than the outbound flow
    for (let i = 0; i < graph.vertices.length && !vertex; i++) {
      vertex = graph.vertices[random(graph.vertices.length - 1)];
      // Find inbound arcs with residual capacity > 0
      inbound = graph.arcs.filter((arc) => {
        return arc.to.equals(vertex) && arc.capacity > 0;
      });

      if (inbound.length === 0) {
        vertex = undefined;
        inbound = undefined;
      }
    }

    if (!vertex) {
      logger.error('Could not find any vertex with some inbound arc that has left some residual capacity')
      logger.error('Therefore a simulation of the flow conservation violation is not possible for this instance')
      return 0;
    }

    inbound.forEach((arc) => {
      arc.flow += 1;
    });

    // Validate residual graph
    validateResidualGraph(graph, logger);

    // Reset graph
    graph.reset();
    // Close algorithm logging group
    logger.groupEnd();

    return maxFlow;
  };

  module.exports = (instances, vertices, maxCapacity) => {
    let result = [];
    let graph;

    for (var i = 0; i < instances; i++) {
      // Generate graph (provide false to ensure that the graph is unordered)
      graph = graphGen.create(vertices, maxCapacity, false).run();

      // Set result for this instance
      result[i] = normalIteration(graph, i);

    }

    // Generate graph (provide false to ensure that the graph is unordered)
    graph = graphGen.create(vertices, maxCapacity, false).run();
    result[result.length] = manipulatedIteration(graph);

    return result;
  };
}());
