const queue = require('./queue');
const stack = require('./stack');

(function() {
  'use strict';

  function* traverse(graph, store) {
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
      parenthetical: []
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
        output.parenthetical.push(v);
      } else if (!a.to.seen) {
        a.to.seen = true;
        store.push(a.to);
        output.aborescence.Aprime.push(a);
        output.aborescence.Vprime.push(a.to);
        output.lexicographical.push(a.to);
      }

      yield output;
    }

    return null;
  }

  exports.init = (graph, store) => {
    if (!(store instanceof queue.Queue) && !(store instanceof stack.Stack)) {
      throw new Error('Unsupported data structure. Please provide queue or stack');
    }

    return traverse(graph, store);
  };

  exports.run = (traverse) => {
    let output = null;
    let result = traverse.next();

    while (!result.done) {
      output = result.value;
      result = traverse.next();
    }

    return output;
  };
}());
