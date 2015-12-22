;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This method renders the edge as two parallel lines.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.parallel = function(edge, source, target, context, settings) {
    var color = edge.active ?
          edge.active_color || settings('defaultEdgeActiveColor') :
          edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        tSize = target[prefix + 'size'],
        aSize = Math.max(size * 2, settings('minArrowSize')),
        c,
        d,
        dist = sigma.utils.getDistance(sX, sY, tX, tY);

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    // Intersection points of the source node circle:
    c = sigma.utils.getCircleIntersection(sX, sY, 0.5 * tSize, tX, tY, dist);

    // Intersection points of the target node circle:
    d = sigma.utils.getCircleIntersection(tX, tY, 0.5 * tSize, sX, sY, dist);

    context.save();

    if (edge.active) {
      context.strokeStyle = settings('edgeActiveColor') === 'edge' ?
        (color || defaultEdgeColor) :
        settings('defaultEdgeActiveColor');
    }
    else {
      context.strokeStyle = color;
    }

    context.lineWidth = size;
    context.beginPath();
    context.moveTo(c.xi_prime, c.yi_prime);
    context.lineTo(d.xi, d.yi);
    context.closePath();
    context.stroke();

    var cdDistance = sigma.utils.getDistance(c.xi_prime, c.yi_prime, d.xi, d.yi);
    var direction = {
      x: (d.xi - c.xi_prime) / cdDistance,
      y: (d.yi - c.yi_prime) / cdDistance
    };
    var arrowStart = {
      x: c.xi_prime + (cdDistance - aSize * tSize) * direction.x,
      y: c.yi_prime + (cdDistance - aSize * tSize) * direction.y
    };
    var arrowEnd = {
      x: arrowStart.x + (aSize - 1) * tSize * direction.x,
      y: arrowStart.y + (aSize - 1) * tSize * direction.y
    };

    var orthDirection = {
      y: -direction.x / direction.y
    };

    if (direction.x === 0 || direction.y === 0) {
      orthDirection.y = direction.x;
      orthDirection.x = direction.y;
    } else {
      orthDirection.x = -(direction.y * orthDirection.y) / direction.x;
      orthDirection.length = Math.sqrt(Math.pow(orthDirection.x, 2) + Math.pow(orthDirection.y, 2));
      orthDirection.x = orthDirection.x / orthDirection.length;
      orthDirection.y = orthDirection.y / orthDirection.length;
      delete orthDirection.length;
    }

    orthDirection.factor = 0.4 * tSize;

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(arrowEnd.x, arrowEnd.y);
    context.lineTo(arrowStart.x + orthDirection.factor * orthDirection.x, arrowStart.y + orthDirection.factor *  orthDirection.y);
    context.lineTo(arrowStart.x, arrowStart.y);
    context.lineTo(arrowStart.x - orthDirection.factor * orthDirection.x, arrowStart.y - orthDirection.factor *  orthDirection.y);
    context.stroke();

    context.closePath();
    context.fill();

    context.restore();
  };
})();
