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
          wru.assert('A#constructor === A', this.constructor === A);
        }
      });
      var B = Class({
        'extends': A,
        constructor: function () {
          wru.assert('B#constructor === B', this.constructor === B);
        }
      });
      var C = Class({});
      new A;
      new B;
      wru.assert('C#constructor === C', (new C).constructor === C);
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
  }, {
    name: 'extending objects',
    test: function () {
      var a = {a: 1};
      var B = Class({
        'extends': a,
        b: 2
      });
      wru.assert((new B).a === 1);
      wru.assert((new B).b === 2);
      wru.assert(B.a === undefined);
      wru.assert(a.b === undefined);
    }
  }, {
    name: 'configuration',
    test: function () {
      function check(obj, prop, value, publicStatic) {
        var tmp = gOPD(obj, prop);
        wru.assert('checking ' + prop,
          !!tmp.enumerable === publicStatic &&
          !!tmp.configurable === !publicStatic &&
          !!tmp.writable === !publicStatic &&
          tmp.value === value
        );
      }
      var gOPD = Object.getOwnPropertyDescriptor;
      // ignore IE8 for this test
      if (/*@cc_on 5.8<@_jscript_version&&@*/gOPD) {
        var A = Class({
          'static': {A: 'a'},
          a: 'a'
        });
        var B = Class({
          'extends': A,
          'static': {B: 'b'},
          b: 'b'
        });
        check(A, 'A', 'a', true);
        check(A.prototype, 'a', 'a', false);
        check(B, 'A', 'a', true);
        check(B, 'B', 'b', true);
        check(B.prototype, 'b', 'b', false);
      }
    }
  }, {
    name: 'supports non quoted properties',
    test: function () {
      try {
        Function('Class, callback', [
          "var A=Class({static:{A:'a'},a:1});",
          "var B=Class({extends:A,static:{B:'b'},b:2});",
          "callback(A, B);"
        ].join('\n'))(Class, function (A, B) {
            wru.assert(typeof A === 'function');
            wru.assert(typeof B === 'function');
            wru.assert(new A instanceof A);
            wru.assert(!(new A instanceof B));
            wru.assert(new B instanceof A);
            wru.assert(new B instanceof B);
            wru.assert(A.A === 'a');
            wru.assert(A.B === undefined);
            wru.assert(B.A === 'a');
            wru.assert(B.B === 'b');
            wru.assert((new A).a === 1);
            wru.assert((new A).b === undefined);
            wru.assert((new B).a === 1);
            wru.assert((new B).b === 2);
        });
      } catch(oldJSEngine) {
        // minifiers will take care of the problem ;-)
      }
    }
  }, {
    name: 'with',
    test: function () {
      var A = Class({
        'with': {
          init: function () {
            this.mixinInvoked = true;
          },
          mixedA: 'mixedA'
        },
        a: 'a'
      });
      wru.assert((new A).a === 'a');
      wru.assert((new A).mixedA === 'mixedA');
      wru.assert((new A).mixinInvoked === true);
    }
  }, {
    name: 'multiple with',
    test: function () {
      var sequence = [];
      var A = Class({
        'with': {
          init: function () {
            sequence.push('A#mixin');
          }
        },
        constructor: function () {
          sequence.push('A#constructor');
        }
      });
      var B = Class({
        'extends': A,
        'with': {
          init: function () {
            sequence.push('B#mixin');
          }
        },
        constructor: function () {
          sequence.push('B#constructor');
          A.call(this);
        }
      });
      var C = {
        init: function () {
          sequence.push('C#mixin');
        }
      };
      var D = {
        init: function () {
          sequence.push('D#mixin');
        }
      };
      var E = Class({
        'extends': B,
        'with': [C, D],
        constructor: function () {
          sequence.push('C#constructor');
          B.call(this);
        }
      });
      var e = new E;
      wru.assert(sequence.join(',') === [
        'C#mixin',
        'D#mixin',
        'C#constructor',
        'B#mixin',
        'B#constructor',
        'A#mixin',
        'A#constructor'
      ].join(','));
      wru.assert(e instanceof A && e instanceof B && e instanceof E);
    }
  }, {
    name: 'throws on duplicated',
    test: function () {
      var message;
      if (typeof console === 'undefined') {
        console = {};
      }
      console.warn = function (warning) {
        message = warning;
      };
      var A = Class({
        a: 1,
        'with': {
          a: 2
        }
      });
      wru.assert(message === 'duplicated: a');
    }
  }
]);
