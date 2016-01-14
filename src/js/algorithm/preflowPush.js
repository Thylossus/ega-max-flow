const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');

(function() {
  'use strict';

  function distanceFromSink(graph) {
    let bfs = graphTraversal.init(queue.create(), graph, graph.sink);
    let iterator = bfs.next();
    let parent;
    let currentVertex;
    let distance;
    let excess;

    // Init sink distance to itself with 0 (explicitly)
    graph.sink.distance = 0;

    while (!iterator.done) {
      currentVertex = iterator.value.lexicographical[iterator.value.lexicographical.length - 1];
      parent = currentVertex.parent;

      if (currentVertex.distance !== null) {
        currentVertex.distance = parent.distance + 1;
      }

      if (iterator.value.currentArc !== null) {
        iterator.value.currentArc.from.minNeighborDistance = Math.min(iterator.value.currentArc.from.minNeighborDistance, iterator.value.currentArc.to.distance);
      }

      iterator = bfs.next();
    }

    // Reset everything but the distance and the excess of the vertices
    graph.vertices = graph.vertices.map((vertex) => {
      distance = vertex.distance;
      excess = vertex.excess;
      vertex = vertex.reset();
      vertex.distance = distance;
      vertex.excess = excess;

      return vertex;
    });
  }

  function init(graph) {
    let S = queue.create();
    let a = graph.source.nextArc();
    let flow = 0;

    // Step 1: set flow to 0 for each arc
    // -> finished (this is the default flow value)

    // Step 2: create a staturated cut between the source and the rest of the graph and add the nodes reachable from s to S
    while (a !== null) {
      flow = a.capacity;
      a.increaseFlow(flow);
      a.to.excess = flow;

      S.push(a.to);

      a = graph.source.nextArc();
    }

    // Reset the source vertex in order to reset the current arc index
    graph.source.reset();

    // Step 3: compute a valid distance labeling by calculating the distances from t
    distanceFromSink(graph);

    // Step 4: set d(s) = |V| (this does not violate the valid distance labeling because all of s's outgoing arcs have capacity 0 due to step 2)
    graph.source.distance = graph.vertices.length;

    // Step 5: reset all current arc indizes
    // -> finished by resetting all arcs in distanceFromSink()

    return S;
  }

  function push(graph, a, v, S) {
    let w = a.to;
    let flow = 0;

    // Step 3.1: add w to set of active vertices
    if (!w.equals(graph.source) && w.excess === 0) {
      // Add w to S because after this step w will be active
      S.push(w);
    }

    // Step 3.2: increase flow on a by minimum of excess and residual capacity
    flow = Math.min(a.capacity, v.excess);
    a.increaseFlow(flow);

    // Step 3.3: increase excess of w and decrease excess of v accordingly
    w.excess += flow;
    v.excess -= flow;

    // Step 3.4: remove v from S if it is not active any more
    if (v.excess === 0) {
      // Since S is a queue, v is on its front because v was obtained via S.top()
      S.pop();
    }
  }

  function relabel(graph, a, v) {
    // Step 4.1: Find minimum neighbor distance TODO: check if this violates the complexity constraints
    let dMin = v.outgoingArcs.reduce((min, arc) => {
      // Check if arc.capacity > 0 because arc has to be in the residual network
      if (arc.capacity > 0) {
        return Math.min(min, arc.to.distance);
      }

      return min;
    }, Infinity);

    // Step 4.2: Set distance of v to dMin + 1
    v.distance = dMin + 1;

    // Step 4.3: Reset current arc counter of v
    v.currentArcIndex = -1;
  }

  function* iterator(graph) {
    let output = {};
    let S = init(graph);

    // The active vertex
    let v;
    // The current arc
    let a;

    while (!S.empty) {
      // Step 1: choose active node v from S
      v = S.top();

      // Step 2: find next admissable arc from v
      a = v.nextArc();

      while (a && (!a.isAdmissable() || a.capacity <= 0)) {
        a = v.nextArc();
      }

      if (a && a.isAdmissable) {
        // Step 3: push
        push(graph, a, v, S);
      } else {
        // Step 4: relabel
        relabel(graph, a, v);
      }

      yield output;
    }

    return output;
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  exports.run = () => {

  };

}());
