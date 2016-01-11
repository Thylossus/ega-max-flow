const curry = require('lodash/function/curry');
const queue = require('../structure/queue');
const stack = require('../structure/stack');

(function() {
  'use strict';

  function* traverse(store, graph, startVertex) {
    // Output
    let output = {
      // Aborescence
      aborescence: {
        Vprime: [],
        Aprime: []
      },
      // Lexicographical order
      lexicographical: [],
      // Parenthetical order
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
    output.aborescence.Vprime.push(s);
    output.lexicographical.push(s);

    // Set the level for the source to 0 for building a level graph (only relevant for Dinic)
    s.setLevel(0);

    while (!store.empty) {
      v = store.top();
      a = v.nextArc();

      output.currentArc = a;
      output.currentVertex = v;
      output.progress = true;

      if (a === null) {
        v.finished = true;
        store.pop();

        // Remove arc because output.arcs should only contain arcs that lead to a termination node
        output.arcs.pop();
        minCapacities.pop();
        lastMinCapacity = minCapacities[minCapacities.length - 1];
        lastMinCapacity = lastMinCapacity === undefined ? Infinity : lastMinCapacity;

        output.parenthetical.push(v);
      } else if (!a.to.seen && a.capacity > 0) {
        a.to.seen = true;
        store.push(a.to);

        // Set the target vertex' level
        a.to.setLevel(v.level + 1);

        // Set properties for finding paths with BFS
        a.to.parent = a.from;
        a.to.parentArc = a;
        a.to.parentArcMinCapacity = a.from.parentArcMinCapacity === undefined ? a.capacity : Math.min(a.from.parentArcMinCapacity, a.capacity);

        minCapacities.push(Math.min(lastMinCapacity, a.capacity));
        lastMinCapacity = minCapacities[minCapacities.length - 1];

        overallMinCapacity = Math.min(overallMinCapacity, a.capacity);

        output.aborescence.Aprime.push(a);
        output.aborescence.Vprime.push(a.to);
        output.lexicographical.push(a.to);
        output.arcs.push(a);
      } else {
        output.progress = false;
      }

      output.minCapacity = lastMinCapacity === Infinity ? overallMinCapacity : lastMinCapacity;

      yield output;
    }

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
