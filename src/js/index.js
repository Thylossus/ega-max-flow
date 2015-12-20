const generator = egamaxflow.graph.generator;

(function () {
  'use strict';


  let graph = generator.create(10, 100).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;


  let s = new sigma({
    graph: graph,
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      edgeLabelSize: 'proportional'
    }
  });

})();
