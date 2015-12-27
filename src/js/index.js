const generator = egamaxflow.graph.generator;
const sigmaSettings = egamaxflow.sigmaSettings;
const graphSettings = egamaxflow.graphSettings;

(function () {
  'use strict';


  let graph = generator.create(graphSettings.NUMBER_OF_VERTICES, graphSettings.MAX_CAPACITY).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;

  console.log(graph);

  let s = new sigma({
    graph: graph,
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      edgeLabelSize: 'fixed',
      defaultEdgeLabelSize: sigmaSettings.EDGE_LABEL_SIZE,
      defaultEdgeType: sigmaSettings.EDGE_TYPE,
      defaultEdgeColor: sigmaSettings.EDGE_COLOR,
      drawEdgeLabels: sigmaSettings.EDGE_DISPLAY_LABELS
    }
  });

  let stack = egamaxflow.algorithm.stack.create();
  let queue = egamaxflow.algorithm.queue.create();

  let dfs = egamaxflow.algorithm.graphTraversal.init(stack);
  let bfs = egamaxflow.algorithm.graphTraversal.init(queue);

  let traverse = dfs(graph);
  let output = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('lexicographical', output.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('parenthetical', output.parenthetical.map((vertex) => {return vertex.id;}));

  graph.reset();

  traverse = egamaxflow.algorithm.graphTraversal.init(queue, graph);
  output = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('lexicographical', output.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('parenthetical', output.parenthetical.map((vertex) => {return vertex.id;}));


  let v1 = egamaxflow.graph.vertex.create();
  let v2 = egamaxflow.graph.vertex.create();
  let v3 = egamaxflow.graph.vertex.create();
  let a1 = egamaxflow.graph.arc.create(v1, v2, 1);
  let a2 = egamaxflow.graph.arc.create(v2, v3, 1);
  let a3 = egamaxflow.graph.arc.create(v3, v2, 1);
  let a4 = egamaxflow.graph.arc.create(v2, v1, 1);

  v1.outgoingArcs = [a1];
  v2.outgoingArcs = [a2, a4];
  v3.outgoingArcs = [a3];

  let vertices = [v1, v2, v3];
  let arcs = [a1, a2, a3, a4];

  let g = egamaxflow.graph.graph.create(vertices, arcs);
  g.source = v1;
  g.sink = v3;

  stack = egamaxflow.algorithm.stack.create();
  traverse = egamaxflow.algorithm.graphTraversal.init(stack, g);
  output = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('lexicographical', output.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('parenthetical', output.parenthetical.map((vertex) => {return vertex.id;}));

})();
