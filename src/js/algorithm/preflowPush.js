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

    // Step 2: create a staturated cut between the source and the rest of the graph and add the source to S
    while (a !== null) {
      flow = a.capacity;
      a.increaseFlow(flow);
      a.to.excess = flow;

      a = graph.source.nextArc();
    }

    // Reset the source vertex in order to reset the current arc index
    graph.source.reset();

    // Add the source to S
    S.push(graph.source);

    // Step 3: compute a valid distance labeling by calculating the distances from t
    distanceFromSink(graph);

    // Step 4: set d(s) = |V| (this does not violate the valid distance labeling because all of s's outgoing arcs have capacity 0 due to step 2)
    graph.source.distance = graph.vertices.length;

    // Step 5: reset all current arc indizes
    // -> finished by resetting all arcs in distanceFromSink()

    return S;
  }

  function* iterator(graph) {
    let output = {};
    let S = init(graph);

    console.log(graph, S);

    return output;
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  exports.run = () => {

  };

}());
