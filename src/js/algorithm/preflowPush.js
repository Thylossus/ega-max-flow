const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');
const log = require('../util/log');

(function() {
  'use strict';

  function distanceFromSink(graph) {
    let bfs = graphTraversal.init(queue.create(), graph, graph.sink);
    let iterator = bfs.next();
    let parent;
    let currentVertex;
    let distance;
    let excess;

    // Init sink distance to itself with 0 (explicitly)
    graph.sink.distance = 0;

    while (!iterator.done) {
      currentVertex = iterator.value.lexicographical[iterator.value.lexicographical.length - 1];
      parent = currentVertex.parent;

      if (currentVertex.distance !== null) {
        currentVertex.distance = parent.distance + 1;
      }

      if (iterator.value.currentArc !== null) {
        iterator.value.currentArc.from.minNeighborDistance = Math.min(iterator.value.currentArc.from.minNeighborDistance, iterator.value.currentArc.to.distance);
      }

      iterator = bfs.next();
    }

    // Reset everything but the distance and the excess of the vertices
    graph.vertices = graph.vertices.map((vertex) => {
      distance = vertex.distance;
      excess = vertex.excess;
      vertex = vertex.reset();
      vertex.distance = distance;
      vertex.excess = excess;

      return vertex;
    });
  }

  function init(graph, logger) {

    logger.group('init');

    let S = queue.create();
    let a = graph.source.nextArc();
    let flow = 0;

    // Step 1: set flow to 0 for each arc
    // -> finished (this is the default flow value)
    logger.log('set flow to 0 for each arc');

    // Step 2: create a staturated cut between the source and the rest of the graph and add the nodes reachable from s to S
    logger.group('create a saturated cut between the source and the rest of the graph');
    while (a !== null) {
      flow = a.capacity;
      a.increaseFlow(flow);
      a.to.excess = flow;

      S.push(a.to);

      logger.log(`push, ${flow} from ${a.from.id} to ${a.to.id} and add ${a.to.id} to S`);

      a = graph.source.nextArc();
    }
    logger.groupEnd();

    // Reset the source vertex in order to reset the current arc index
    graph.source.reset();

    // Step 3: compute a valid distance labeling by calculating the distances from t
    logger.log('compute a valid distance labeling');
    distanceFromSink(graph);

    // Step 4: set d(s) = |V| (this does not violate the valid distance labeling because all of s's outgoing arcs have capacity 0 due to step 2)
    logger.log('set d(s) = |V|');
    graph.source.distance = graph.vertices.length;

    // Step 5: reset all current arc indizes
    // -> finished by resetting all arcs in distanceFromSink()

    logger.groupEnd();

    return S;
  }

  function push(graph, a, v, S, logger) {
    let w = a.to;
    let flow = 0;

    logger.group('push');

    // Step 3.1: add w to set of active vertices
    if (!w.equals(graph.source) && !w.equals(graph.sink) && w.excess === 0) {
      // Add w to S because after this step w will be active
      S.push(w);
      logger.log(`add ${w.id} to S`);
    }

    // Step 3.2: increase flow on a by minimum of excess and residual capacity
    flow = Math.min(a.capacity, v.excess);
    a.increaseFlow(flow);
    logger.log(`push ${flow} from ${a.from.id} to ${a.to.id}`);


    // Step 3.3: increase excess of w and decrease excess of v accordingly
    w.excess += flow;
    v.excess -= flow;
    logger.log(`increase excess of ${w.id} and decrease excess of ${v.id} by ${flow}`);

    // Step 3.4: remove v from S if it is not active any more
    if (v.excess === 0) {
      // Since S is a queue, v is on its front because v was obtained via S.top()
      S.pop();
      logger.log(`remove ${v.id} from S because its not active any more`);
    }

    logger.groupEnd();
  }

  function relabel(graph, a, v, logger) {
    logger.group(`relabel ${v.id}`);

    // Step 4.1: Find minimum neighbor distance TODO: check if this violates the complexity constraints
    let dMin = v.outgoingArcs.reduce((min, arc) => {
      // Check if arc.capacity > 0 because arc has to be in the residual network
      if (arc.capacity > 0) {
        return Math.min(min, arc.to.distance);
      }

      return min;
    }, Infinity);
    logger.log(`minimum distance of adjecent vertices is ${dMin}`);

    // Step 4.2: Set distance of v to dMin + 1
    v.distance = dMin + 1;
    logger.log(`set distance of ${v.id} to ${v.distance}`);

    // Step 4.3: Reset current arc counter of v
    v.currentArcIndex = -1;
    logger.log(`reset current arc counter of ${v.id}`);
    logger.groupEnd();
  }

  function* iterator(graph) {
    // Only print if console.group is supported
    let logger = log.create({print: !!console.group});
    let output = {
      flow: {},
      preflow: [],
      logger: logger,
      step: '',
      activeElement: null
    };
    let S = init(graph, logger);

    // The active vertex
    let v;
    // The current arc
    let a;

    // Stop after intialization
    yield output;

    while (!S.empty) {
      // Step 1: choose active node v from S
      v = S.top();

      // Step 2: find next admissable arc from v
      a = v.nextArc();

      while (a && (!a.isAdmissable() || a.capacity <= 0)) {
        a = v.nextArc();
      }

      if (a && a.isAdmissable) {
        // Step 3: push
        push(graph, a, v, S, logger);
        output.flow[a.id] = a.flow;
        output.step = 'push';
        output.activeElement = a;
      } else {
        // Step 4: relabel
        relabel(graph, a, v, logger);
        output.step = 'relabel';
        output.activeElement = v;
      }

      yield output;
    }

    return output;
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  exports.run = (iterator) => {
    let output = null;
    let result = iterator.next();

    while (!result.done) {
      output = result.value;
      result = iterator.next();

    }

    return output;
  };

}());
