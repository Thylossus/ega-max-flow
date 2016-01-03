const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');
const stack = require('../structure/stack');
const dll = require('../structure/dll');

(function() {
  'use strict';

  function buildLevelGraph(graph) {
    let bfsTraversal = graphTraversal.init(queue.create(), graph);

    let output = null;
    let result = bfsTraversal.next();

    let levelGraph = {
      sink: graph.sink,
      source: graph.source
    };

    let outgoingArcListElement;
    let incomingArcListElement;

    while (!result.done) {
      output = result.value;

      if (output.currentArc && output.currentArc.level) {
        if (!output.currentArc.from.outgoingArcList) {
          output.currentArc.from.outgoingArcList = dll.create();
          output.currentArc.from.outgoingArcListPointer = output.currentArc.from.outgoingArcList.head;
        }

        if (!output.currentArc.to.incomingArcList) {
          output.currentArc.to.incomingArcList = dll.create();
        }

        outgoingArcListElement = output.currentArc.from.outgoingArcList.add(output.currentArc);
        incomingArcListElement = output.currentArc.to.incomingArcList.add(output.currentArc);

        // Set cross references
        outgoingArcListElement.elementRef = {
          list: output.currentArc.to.incomingArcList,
          element: incomingArcListElement,
          vertex: output.currentArc.to
        };

        incomingArcListElement.elementRef = {
          list: output.currentArc.from.outgoingArcList,
          element: outgoingArcListElement,
          vertex: output.currentArc.from
        }
      }
      result = bfsTraversal.next();
    }

    return levelGraph;
  }

  function getNextOutgoingArcElement(vertex) {
    if (vertex.outgoingArcListPointer === undefined) {
      return null;
    } else if (vertex.outgoingArcListPointer === null) {
      vertex.outgoingArcListPointer = vertex.outgoingArcList.head;
    } else {
      vertex.outgoingArcListPointer = vertex.outgoingArcListPointer.next;
    }

    return vertex.outgoingArcListPointer;
  }

  function deleteArcs(vertex, listType) {
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

  function findFlowAugmentingPathInLevelGraph(levelGraph) {
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
          return {
            path: path,
            minCapacity: lastMinCapacity
          };
        }

        a.value.to.seen = true;
        store.push(a.value.to);
      }
    }

    return null;
  }

  function calculateBlockingFlow(levelGraph, graph) {
    let pathFindingResult = findFlowAugmentingPathInLevelGraph(levelGraph);

    while (pathFindingResult) {
      pathFindingResult.path.forEach((element) => {
        // Increase flow
        element.value.increaseFlow(pathFindingResult.minCapacity);

        // Check if capacity was reduced to 0
        if (element.value.capacity === 0) {
          // Remove arc
          element.value.from.outgoingArcList.remove(element);
          let refList = element.elementRef.list;
          let refElement = element.elementRef.element;
          refList.remove(refElement);
        }
      });

      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
        vertex.outgoingArcListPointer = null;
      });

      // Search for the next path
      pathFindingResult = findFlowAugmentingPathInLevelGraph(levelGraph);
    }
  }

  function* iterator(graph) {
    let output = {};
    let levelGraph = buildLevelGraph(graph);

    while (levelGraph.sink.seen) {
      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });

      calculateBlockingFlow(levelGraph, graph);

      yield output;
      // Reset vertices
      graph.vertices.forEach((vertex) => {
        vertex.reset();
      });
      levelGraph = buildLevelGraph(graph);
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
