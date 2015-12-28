const generator = egamaxflow.graph.generator;
const sigmaSettings = egamaxflow.sigmaSettings;
const graphSettings = egamaxflow.graphSettings;

(function () {
  'use strict';


  let graph = generator.create(graphSettings.NUMBER_OF_VERTICES, graphSettings.MAX_CAPACITY).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;

  // console.log('arcs', graph.arcs.map((arc) => {return arc.id + '(' + arc.from.id + ' -' + arc.capacity + '-> ' + arc.to.id + ')'}));

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

  console.log('-------------------- DFS --------------------------');
  console.log('lexicographical', output.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('arcs', output.arcs.map((arc) => {return arc.id + '(' + arc.from.id + ' -> ' + arc.to.id + ')';}));
  console.log('parenthetical', output.parenthetical.map((vertex) => {return vertex.id;}));

  graph.reset();

  traverse = egamaxflow.algorithm.graphTraversal.init(queue, graph);
  output = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('-------------------- BFS --------------------------');
  console.log('lexicographical', output.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('arcs', output.arcs.map((arc) => {return arc.id + '(' + arc.from.id + ' -> ' + arc.to.id + ')';}));
  console.log('parenthetical', output.parenthetical.map((vertex) => {return vertex.id;}));

  graph.reset();

  console.log('--------------- Ford Fulkerson --------------------');


  let iterator = egamaxflow.algorithm.fordFulkerson.init(graph);
  output = null;
  let result = iterator.next();

  for (let i = 0;  !result.done; i++) {
    output = result.value;
    result = iterator.next();
    console.log(output);
    console.log('augmenting path', output.flowAugmentingPath.map((arc) => {return arc.id + '(' + arc.from.id + ' -> ' + arc.to.id + ')';}));
    console.log('flow', Object.keys(output.flow).reduce((flow, key) => {flow[key] = output.flow[key]; return flow;}, {}));

    s.graph.clear();
    s.graph.read(graph);
    s.refresh();
  }

})();
