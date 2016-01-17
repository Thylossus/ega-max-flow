const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');
const stack = require('../structure/stack');
const dll = require('../structure/dll');
const log = require('../util/log');

(function() {
  'use strict';

  function buildLevelGraph(graph, logger) {
    logger.group('build a level graph');

    logger.log('initialize a breadth first search');
    let bfsTraversal = graphTraversal.init(queue.create(), graph);

    let output = null;
    let result = bfsTraversal.next();

    let levelGraph = {
      sink: graph.sink,
      source: graph.source,
      arcs: []
    };

    let outgoingArcListElement;
    let incomingArcListElement;

    // Current arc
    let a;

    while (!result.done) {
      output = result.value;
      a = output.currentArc;

      if (a && a.to.level === a.from.level + 1 && a.capacity > 0) {
        logger.group(`add the arc ${a.from.id} -> ${a.to.id} to the level graph`);

        levelGraph.arcs.push(a);

        if (!a.from.outgoingArcList) {
          logger.log(`add a list of outgoing arcs to the vertex ${a.from.id}`);
          a.from.outgoingArcList = dll.create();
          a.from.outgoingArcListPointer = a.from.outgoingArcList.head;
        }

        if (!a.to.incomingArcList) {
          logger.log(`add a list of incoming arcs to thie vertex ${a.to.id}`);
          a.to.incomingArcList = dll.create();
        }

        logger.log(`add the arc ${a.from.id} -> ${a.to.id} to ${a.from.id}'s outgoning arc list`);
        outgoingArcListElement = a.from.outgoingArcList.add(a);
        logger.log(`add the arc ${a.from.id} -> ${a.to.id} to ${a.to.id}'s incoming arc list`);
        incomingArcListElement = a.to.incomingArcList.add(a);

        // Set cross references
        logger.log('set cross references for fast deletion of arcs in the outgoing and incoming arc lists')
        outgoingArcListElement.elementRef = {
          list: a.to.incomingArcList,
          element: incomingArcListElement,
          vertex: a.to
        };

        incomingArcListElement.elementRef = {
          list: a.from.outgoingArcList,
          element: outgoingArcListElement,
          vertex: a.from
        }

        logger.groupEnd();
      }

      result = bfsTraversal.next();
    }

    logger.log('the level graph has been constructed')

    logger.groupEnd();

    return levelGraph;
  }

  function getNextOutgoingArcElement(vertex, logger) {
    if (vertex.outgoingArcListPointer === undefined || !vertex.outgoingArcList) {
      return null;
    } else if (vertex.outgoingArcListPointer === null) {
      vertex.outgoingArcListPointer = vertex.outgoingArcList.head;
    } else {
      vertex.outgoingArcListPointer = vertex.outgoingArcListPointer.next;
    }

    return vertex.outgoingArcListPointer;
  }

  function deleteArcs(vertex, listType, logger) {
    if (!vertex[listType + 'ArcList']) {
      return null;
    }

    vertex[listType + 'ArcList'].forEach((element) => {
      let refList = element.elementRef.list;
      let refElement = element.elementRef.element;
      let refVertex = element.elementRef.vertex;

      // If an incoming arc for this vertex is deleted, check if the referenced vertex currently points on the arc which will be deleted.
      // If this is the case, set pointer one position back. It will be advanced by getNextOutgoingArcElement later
      if (listType === 'incoming' && refVertex.outgoingArcListPointer === refElement) {
        refVertex.outgoingArcListPointer = refVertex.outgoingArcListPointer.prev;
      }
      refList.remove(refElement);
    });

    return null;
  }

  function findFlowAugmentingPathInLevelGraph(levelGraph, logger) {
    logger.group('find flow augmenting path in the provided level graph');

    let store = stack.create();

    // Start vertex
    let s = levelGraph.source;

    // First element of the store
    let v;
    // Next arc
    let a;

    // The path
    let path = [];
    // Minimum capacities
    let minCapacities = [];
    let lastMinCapacity = Infinity;

    // Initialize traversal
    store.push(s);
    s.seen = true;

    while (!store.empty) {
      v = store.top();
      a = getNextOutgoingArcElement(v);

      if (a === null) {
        v.finished = true;
        store.pop();

        // Remove arc because output.arcs should only contain arcs that lead to a termination node
        path.pop();
        minCapacities.pop();
        lastMinCapacity = minCapacities[minCapacities.length - 1];
        lastMinCapacity = lastMinCapacity === undefined ? Infinity : lastMinCapacity;

        logger.log('depth first search goes backwards');
        logger.log(`remove the vertex ${v.id} and all of its incident arcs`);
        // Modification 2: delete v and all its incident arcs
        // v is automatically by removing all incident arcs
        // Delete outgoing arcs and the respective incoming arcs at other vertices
        v.outgoingArcList = deleteArcs(v, 'outgoing');
        // Delete incoming arcs and the respective outgoing arcs at other vertices
        v.incomingArcList = deleteArcs(v, 'incoming');

      } else if (!a.value.to.seen && a.value.capacity > 0) {
        path.push(a);
        minCapacities.push(Math.min(lastMinCapacity, a.value.capacity));
        lastMinCapacity = minCapacities[minCapacities.length - 1];

        // Modification 1: Terminate if sink is reached
        if (a.value.to.equals(levelGraph.sink)) {
          logger.log(`found a flow augmenting (s,t)-path in the level graph with a capacity of ${lastMinCapacity}`);
          logger.groupEnd();

          return {
            path: path,
            minCapacity: lastMinCapacity
          };
        }

        a.value.to.seen = true;
        store.push(a.value.to);
      }
    }

    logger.log('did not find a flow augmenting path in the provided level graph');
    logger.groupEnd();

    return null;
  }

  function calculateBlockingFlow(levelGraph, graph, logger) {
    logger.group('calculate a blocking flow on the provided level graph');

    let pathFindingResult = findFlowAugmentingPathInLevelGraph(levelGraph, logger);
    let blockingFlow = {
      arcs: [],
      flow: []
    };

    while (pathFindingResult) {
      logger.group('increment the flow along the found (s,t)-path');

      pathFindingResult.path.forEach((element) => {
        logger.group(`arc ${element.value.from.id} -> ${element.value.to.id}`);

        // Increase flow
        logger.log(`increase the flow on the arc by ${pathFindingResult.minCapacity}`);
        element.value.increaseFlow(pathFindingResult.minCapacity);
        logger.log(`new flow: ${element.value.flow}`);

        // Add to result
        logger.log('add the arc to the blocking flow');
        blockingFlow.arcs.push(element.value);
        blockingFlow.flow.push({id: element.value.id, value: pathFindingResult.minCapacity});

        // Check if capacity was reduced to 0
        if (element.value.capacity === 0) {
          logger.log('the arc\'s capacity has been reduced to 0');
          logger.log(`remove the arc from ${element.value.from.id}'s outgoing arc list`);
          // Remove arc
          element.value.from.outgoingArcList.remove(element);
          let refList = element.elementRef.list;
          let refElement = element.elementRef.element;

          logger.log(`remove the corresponding entry in ${element.value.to.id}'s incoming arc list`);
          refList.remove(refElement);
        }

        logger.groupEnd();
      });

      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
        vertex.outgoingArcListPointer = null;
      });

      logger.groupEnd();

      // Search for the next path
      pathFindingResult = findFlowAugmentingPathInLevelGraph(levelGraph, logger);
    }

    logger.groupEnd();

    return blockingFlow;
  }

  function* iterator(graph) {
    // Only print if console.group is supported
    let logger = log.create({print: !!console.group});
    let output = {
      logger: logger
    };

    logger.log('flow is initially the zero flow')

    // Step 1: build a level graph
    let levelGraph = buildLevelGraph(graph, logger);

    while (levelGraph.sink.seen) {
      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });

      output.blockingFlow = calculateBlockingFlow(levelGraph, graph, logger);
      output.levelGraph = levelGraph;

      yield output;
      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });
      levelGraph = buildLevelGraph(graph, logger);
    }

    logger.log('terminate because there are no more flow augmenting paths')

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
