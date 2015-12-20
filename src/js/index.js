const generator = egamaxflow.graph.generator;

(function () {
  'use strict';

  let s = new sigma('container');
  let graph = generator.create(10, 100).run();

  graph.vertices.forEach((vertex) => {
    s.graph.addNode(vertex);
  });

  graph.arcs.forEach((arc) => {
    s.graph.addEdge(arc);
  });

  s.refresh();

})();
