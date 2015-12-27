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
      minCapacity: 0
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
        output.minCapacity = Math.min(output.minCapacity, a.capacity);
        output.aborescence.Aprime.push(a);
        output.aborescence.Vprime.push(a.to);
        output.lexicographical.push(a.to);
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

  // TODO:
  //  1. stop traversal it sink is reached
  //  2. verify if bfs works correctly
  //  3. allow currying of search with the store (e.g. provide queue to make graph traversal a bfs)
  //  4. include check for saturation

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
