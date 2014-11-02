//remove:
var Class = require('../build/es-class.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(typeof Class == "function");
    }
  }, {
    name: 'constructor',
    test: function () {
      var A = Class({
        constructor: function A() {
          wru.assert(this.constructor === A);
        }
      });
      var B = Class({
        'extends': A,
        constructor: function () {
          wru.assert(this.constructor === B);
        }
      });
      var C = Class({});
      new A;
      new B;
      wru.assert((new C).constructor === C);
    }
  }, {
    name: 'extends',
    test: function () {
      var A = Class({});
      var B = Class({
        'extends': A
      });
      var C = Class({
        'extends': B
      });
      wru.assert(new A instanceof A);
      wru.assert(!(new A instanceof B));
      wru.assert(!(new A instanceof C));
      wru.assert(new B instanceof A);
      wru.assert(new B instanceof B);
      wru.assert(!(new B instanceof C));
      wru.assert(new C instanceof A);
      wru.assert(new C instanceof B);
      wru.assert(new C instanceof C);
    }
  }, {
    name: 'static',
    test: function () {
      var A = Class({
        'static': {
          A: 1
        }
      });
      var B = Class({
        'extends': A,
        'static': {
          B: 2
        }
      });
      wru.assert(A.A === 1);
      wru.assert(A.B === undefined);
      wru.assert(A.hasOwnProperty('A'));
      wru.assert(!A.hasOwnProperty('B'));
      wru.assert(!A.prototype.hasOwnProperty('A'));
      wru.assert(!A.prototype.hasOwnProperty('static'));
      wru.assert(B.A === 1);
      wru.assert(B.B === 2);
      wru.assert(B.hasOwnProperty('A'));
      wru.assert(B.hasOwnProperty('B'));
      wru.assert(!B.prototype.hasOwnProperty('A'));
      wru.assert(!B.prototype.hasOwnProperty('B'));
      wru.assert(!B.prototype.hasOwnProperty('static'));
      wru.assert(!B.prototype.hasOwnProperty('extends'));
      wru.assert(new A instanceof A);
      wru.assert(!(new A instanceof B));
      wru.assert(new B instanceof A);
      wru.assert(new B instanceof B);
    }
  }, {
    name: 'probably non enumerable',
    test: function () {
      var A = Class({
        toString: function () {
          return 'a';
        }
      });
      wru.assert(('' + new A) === 'a');
    }
  }, {
    name: 'static and property',
    test: function () {
      var Rectangle = new Class({
        'static': {
          SHAPE: 'Rectangle'
        },
        constructor: function Rectangle(width, height) {
          this.width = width;
          this.height = height;
        },
        SHAPE: 'RectangleInstance'
      });

      var r10x20 = new Rectangle(10, 20);
      wru.assert(r10x20.SHAPE === 'RectangleInstance');
      wru.assert(Rectangle.SHAPE === 'Rectangle');
    }
  }, {
    name: 'static override',
    test: function () {
      var Rectangle = new Class({
        'static': {SHAPE: 'Rectangle'}
      });
      var Square = new Class({
        'extends': Rectangle,
        'static': {SHAPE: 'Square'}
      });
      wru.assert(Rectangle.SHAPE === 'Rectangle');
      wru.assert(Square.SHAPE === 'Square');
    }
  }
]);
