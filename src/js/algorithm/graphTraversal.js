const curry = require('lodash/function/curry');
const queue = require('./queue');
const stack = require('./stack');

(function() {
  'use strict';

  function* traverse(store, graph) {
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
      minCapacity: Infinity
    }
    // Set of vertices
    let V = graph.vertices;
    // Start vertex
    let s = graph.source;

    // First element of the store
    let v;
    // Next arc
    let a;

    // Initialize traversal
    store.push(s);
    s.seen = true;
    output.aborescence.Vprime.push(s);
    output.lexicographical.push(s);

    while (!store.empty) {
      v = store.top();
      a = v.nextArc();

      if (a === null) {
        v.finished = true;
        store.pop();

        // Remove arc because output.arcs should only contain arcs that lead to a termination node
        output.arcs.pop();
        
        output.parenthetical.push(v);
      } else if (!a.to.seen && a.capacity - a.flow > 0) {
        a.to.seen = true;
        store.push(a.to);
        output.minCapacity = Math.min(output.minCapacity, a.capacity - a.flow);
        output.aborescence.Aprime.push(a);
        output.aborescence.Vprime.push(a.to);
        output.lexicographical.push(a.to);
        output.arcs.push(a);
      }

      yield output;
    }

    return null;
  }

  function init(store, graph) {
    if (!(store instanceof queue.Queue) && !(store instanceof stack.Stack)) {
      throw new Error('Unsupported data structure. Please provide queue or stack');
    }

    return traverse(store, graph);
  }

  exports.init = curry(init);

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
