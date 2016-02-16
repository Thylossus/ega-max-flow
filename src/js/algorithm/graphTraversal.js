const curry = require('lodash/function/curry');
const queue = require('../structure/queue');
const stack = require('../structure/stack');

(function() {
  'use strict';

  function* traverse(store, graph, startVertex) {
    // Output
    let output = {
      // Lexicographical order vertices
      lexicographical: [],
      // Parenthetical order vertices
      parenthetical: [],
      // Arcs in lexicographical order
      arcs: [],
      minCapacity: Infinity,
      currentArc: null,
      currentVertex: null,
      progress: true
    }
    // Set of vertices
    let V = graph.vertices;
    // Start vertex
    let s = startVertex || graph.source;

    // Minimum capacities
    let minCapacities = [];
    let lastMinCapacity = Infinity;
    let overallMinCapacity = Infinity;

    // First element of the store
    let v;
    // Next arc
    let a;

    // Initialize traversal
    store.push(s);
    s.seen = true;
    output.lexicographical.push(s);

    // Set the level for the source to 0 for building a level graph (only relevant for Dinic)
    s.setLevel(0);

    while (!store.empty) {
      // Retrieve the current vertex from the top of the stack or the front of the queue
      v = store.top();
      // Get next arc in outgoing arc list of v
      a = v.nextArc();

      // Update state information
      output.currentArc = a;
      output.currentVertex = v;
      output.progress = true;

      if (a === null) {
        // Vertex v has no more outgoing in its outgoing arc list
        v.finished = true;
        store.pop();

        // Remove arc because output.arcs should only contain arcs that lead to a termination node
        output.arcs.pop();
        // Remove last minimum capacity because it refers to an arc that is no longer parts of the arc array
        minCapacities.pop();
        // Find new last minimum capacity
        lastMinCapacity = minCapacities[minCapacities.length - 1];
        lastMinCapacity = lastMinCapacity === undefined ? Infinity : lastMinCapacity;

        output.parenthetical.push(v);
      } else if (!a.to.seen && a.capacity > 0) {
        // Mark target node of arc a as seen
        a.to.seen = true;
        store.push(a.to);

        // Set the target vertex' level (only relevant for Dinic and the level graph it requires)
        a.to.setLevel(v.level + 1);

        // Set properties for finding paths with BFS
        a.to.parent = a.from;
        a.to.parentArc = a;
        a.to.parentArcMinCapacity = a.from.parentArcMinCapacity === undefined ? a.capacity : Math.min(a.from.parentArcMinCapacity, a.capacity);

        // Add a new value to the min capacities array
        minCapacities.push(Math.min(lastMinCapacity, a.capacity));
        lastMinCapacity = minCapacities[minCapacities.length - 1];

        // Update the observed minimum capacity w.r.t. the whole graph
        overallMinCapacity = Math.min(overallMinCapacity, a.capacity);

        output.lexicographical.push(a.to);
        output.arcs.push(a);
      } else {
        output.progress = false;
      }

      output.minCapacity = lastMinCapacity === Infinity ? overallMinCapacity : lastMinCapacity;

      // Yield controll to the caller
      // Procedure is resumed when caller uses .next()
      yield output;
    }
    // BREAK CONDITION: store (queue or stack) is empty


    return null;
  }

  function init(store, graph, startVertex) {
    if (!(store instanceof queue.Queue) && !(store instanceof stack.Stack)) {
      throw new Error('Unsupported data structure. Please provide queue or stack');
    }

    return traverse(store, graph, startVertex);
  }

  exports.init = curry(init, 2);

  exports.run = (traverse, termination) => {
    let output = null;
    let result = traverse.next();
    let last;

    while (!result.done) {
      output = result.value;
      last = output.lexicographical[output.lexicographical.length - 1];

      // Check if the currently last visited vertex is the termination vertex
      if (termination && last && last.equals(termination)) {
        // Terminate
        result.done = true;
      } else {
        result = traverse.next();
      }

    }

    return output;
  };
}());
