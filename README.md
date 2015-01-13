es-class
========

[![build status](https://secure.travis-ci.org/WebReflection/es-class.svg)](http://travis-ci.org/WebReflection/es-class)


### A future proof, backward compatible, JavaScript class utility.

  * **ES6** and **ES7** friendly, through semantic `extends` and `constructor` plus other features
  * **ES5** natively compatible granting that what you write is what you get
  * **ES3** backward compatible, thanks to common minifiers that will make production code safe

Feel free to [test all features](http://webreflection.github.io/es-class/test/) related to this project, and please come back if your browser is not green.



### Compatibility

Following a list of tested browsers split in Desktop and Mobile.

#### Desktop

  * Chrome
  * Firefox
  * IE 6 or greater
  * Safari
  * Opera

#### Mobile

  * Android 2 or greater
  * iOS 5 or greater
  * IE9 Mobile or greater
  * Bada
  * Kindle Fire
  * Xpress
  * Opera Mini and Mobile



### Features
All features explained in the [dedicated page](https://github.com/WebReflection/es-class/blob/master/FEATURES.md).

Following a summary:

  * [constructor](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#constructor) to optionally define the implicit initializer per each instance
  * [extends](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#extends) to optionally define a class or an object to inherit from
  * [super](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#super) to shortcut super methods invocation
  * [with](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#with) to attach lightweight traits / mixins enabling composition behind optional initializers per each mixin
  * [static](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#static) to define public static class constants, inherited if extended, without ever polluting the prototype
  * [implements](https://github.com/WebReflection/es-class/blob/master/FEATURES.md#implements) to perform light checks over expected implementations and warn eventually when something is missing


#### Features Example
This is an example of what's possible:
```js
var Engineer = Class({
  extends: Person,
  with: [
    eventEmitter,
    growingEachYear,
    carrierPath
  ],
  implements: [
    iWorker
  ],
  static: {
    SOFTWARE: 0,
    CONSTRUCTIONS: 1
  },
  constructor: function (name, age, type) {
    this.super(name, age);
    this.type = type;
  }
});

var me = new Engineer(
  'Mr. Andrea Giammarchi',
  36,
  Engineer.SOFTWARE
);

me instanceof Person; // true
me.type;              // Engineer.SOFTWARE

me.emit('work:start', {
  tasks: ['do this', 'do that']
});
```


### ES6 Ready
Using [6to5](http://6to5.org/) it is possible to make your code directly compatible down to ES5 or even ES3 without loosing the ability to debug in every platform without needing source-map. What you see is basically what you get.

```js
// how you would write in native ES6
class B extends A {
  method(x, y) {
    return super.method(x, y);
  }
  get value() {
    return super.value;
  }
  set value(value) {
    super.value = value;
  }
}

// how you would write in es-class
var B = Class({ extends: A,
  method(x, y) {
    return this.super(x, y);
  },
  get value() {
    return this.super();
  },
  set value(value) {
    return this.super(value);
  }
});
```

A simple call to `6to5 --whitelist=arrowFunctions,propertyMethodAssignment f.js` and the output will be way cleaner than any automation produced by the same transpiler.

Your output will be more **readable** and also probably faster at execution time.


### ES7 Ready
Looking at the future, grouped static properties and lightweight traits are also in, giving the ability to compose classes through eventual traits initialization without being on the way after class definition.

```js
var wheels = {
  init: function () {
    if (this instanceof Car) {
      this.frontWheels = 2;
      this.rearWheels = 2;
    } else {
      this.frontWheels = 1;
      this.rearWheels =
        this instanceof Tricycle ? 2 : 1;
    }
  },
  turn: function (where) {
    console.log('turning ' + where);
  }
};

var engine = {
  hp: 120
};

var Car = Class({
  with: [
    wheels,
    engine
  ]
});

var c = new Car;
c.turn('left'); // trning left
c.hp;           // 80
```


### Which File ?

  * [as global](build/es-class.js) to include inline or before any other file that uses classes
  * [require/CommonJS](build/es-class.npm.js) to include it via browserify or node.js
  * [AMD module](build/es-class.amd.js) if you want to load it via AMD

You can also simply `npm install -g es-class` and use `var Class = require('es-class');` whenever you need it.


### License
[MIT Style License](LICENSE.txt)