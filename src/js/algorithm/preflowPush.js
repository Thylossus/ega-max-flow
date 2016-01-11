const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');

(function() {
  'use strict';

  function init(graph) {
    let S = queue.create();
    let a = graph.source.nextArc();

    while (a !== null) {
      a.increaseFlow(a.capacity);
      a.to.excess = a.capacity;

      a = graph.source.nextArc();
    }

    a.reset();

    S.push(graph.source);

    return S;
  }

  function* iterator(graph) {
    let output = {};
    let S = init(graph);

    return output;
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  exports.run = () => {

  };

}());
