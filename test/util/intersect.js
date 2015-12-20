var chai = require('chai');
var expect = chai.expect;

var intersect = require('../../src/util/intersect');

describe('Intersect', function () {


  describe('#check', function () {
    it('should return true for intersecting line segments', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 3
        },
        to: {
          x: 3,
          y: 0
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.true;
    });

    it('should return false for non-intersecting line segments', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 1
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 3
        },
        to: {
          x: 3,
          y: 2
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.false;
    });

    it('should return true for overlapping line segments', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 2,
          y: 2
        },
        to: {
          x: 4,
          y: 4
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.true;
    });

    it('should return false for collinear but non-overlapping line segments', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 4,
          y: 4
        },
        to: {
          x: 5,
          y: 5
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.false;
    });

    it('should return false for parallel line segments', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 1
        },
        to: {
          x: 3,
          y: 4
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.false;
    });

    it('should return false for line segments that have a common start and end point', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 3,
          y: 3
        },
        to: {
          x: 3,
          y: 4
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.false;
    });

    it('should return false for line segments which only differ by their direction', function () {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 3,
          y: 3
        },
        to: {
          x: 0,
          y: 0
        }
      };

      expect(intersect.check(segmentA, segmentB)).to.be.false;
    });
  });
});
