/**
 * Credit to
 *  http://stackoverflow.com/a/565282/3867423
 * and
 * 	http://www.codeproject.com/Tips/862988/Find-the-Intersection-Point-of-Two-Line-Segments
 */

const graphConfig = require('../../config/graph');

(function () {
  'use strict';

  function det(v, w) {
    return v.x * w.y - v.y * w.x;
  };

  function mult(v, w) {
    return v.x * w.x + v.y * w.y;
  };

  function delta(a, b) {
    return {
      x: b.x - a.x,
      y: b.y - a.y
    };
  };

  function isZero(x) {
    return Math.abs(x) < graphConfig.ZERO_TOLERANCE
  };

  function equal(v, w) {
    return v.x === w.x && v.y === w.y;
  };

  /**
   * Checks whether the line segments A and B intersect or not.
   * @param  {Arc}      segmentA  Line segment A
   * @param  {Arc}      segmentB  Line segment B
   * @return {boolean}            True if the line segments intersect, false otherwise.
   */
  exports.check = (segmentA, segmentB) => {
    // Line segment a is the line between A and B
    // Line segment b is the line between C and D
    // P = B - A
    // Q = D - C
    // f: x -> A + t * (B - A) = A + t * P
    // g: x -> C + s * (D - C) = C + s * Q
    //
    // 2d vector cross product v x w = v_x * w_y - v_y * w_x (det)
    //
    // "g = f"
    //    A + t * P = C + s * Q                         | x Q
    //    (A + t * P) x Q = (C + s * Q) x Q
    //    A x Q + (t * P) x Q = C x Q + (s * Q) x Q     | Q x Q = 0
    //    A x Q + t * (P x Q) = C x Q                   | - A x Q
    //    t * (P x Q) = (C - A) x Q                     | / (P X Q)
    //    t = ((C - A) x Q) / (P x Q)
    //
    // Analogous for s:
    //    s = ((A - C) x P) / (Q x P)                   | P x Q = - (Q x P)
    //    s = ((C - A) x P) / (P x Q)
    //
    // R = C - A
    //    t = R x Q / P x Q
    //    s = R x P / P x Q

    var A = segmentA.from;
    var B = segmentA.to;
    var C = segmentB.from;
    var D = segmentB.to;

    // Check for endpoint equality
    // console.log('A = C?', equal(A, C), 'B != D?', equal(B, D));
    if (equal(A, C) && !equal(B, D)) {
      // Common start point but not overlapping
      return false;
    }

    // console.log('A = D?', equal(A, D), 'B != C?', equal(B,C));
    if (equal(A, D) && !equal(B, C)) {
      // Common start and end point but not overlapping
      return false;
    }

    // console.log('B = C?', equal(B, C), 'A != D?', equal(A,D));
    if (equal(B, C) && !equal(A, D)) {
      // Common end and start point but not overlapping
      return false;
    }

    // console.log('B = D?', equal(B, D), 'A != C?', equal(A,C));
    if (equal(B, D) && !equal(A, C)) {
      // Common end point but not overlapping
      return false;
    }

    var P = delta(A, B);

    var Q = delta(C, D);

    var PxQ = det(P, Q);

    var R = delta(A, C);

    var RxP = det(R, P);

    if (isZero(PxQ)) {
      if (!isZero(RxP)) {
        // Parallel
        return false;
      } else {
        // Collinear
        // If segments are equal except for their direction, they do not intersect (reverse arcs)
        if (equal(A, D) && equal(B, C)) {
          return false;
        }

        var RmultP = mult(R, P);
        var RmultQ = mult(R, Q);
        return 0 <= RmultP && RmultP <= mult(P, P) || 0 <= RmultQ && RmultQ <= mult(Q, Q);
      }
    } else {
      // Lines intersect
      var RxQ = det(R, Q);

      var t = RxQ / PxQ;
      var s = RxP / PxQ;

      // True if intersection is within the line segments, false otherwise
      return t >= 0 && t <= 1 && s >= 0 && s <= 1;
    }
  }
})();
