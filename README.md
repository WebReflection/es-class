es-class
========

[![build status](https://secure.travis-ci.org/WebReflection/es-class.png)](http://travis-ci.org/WebReflection/es-class)


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

This is an example of what's possible:
```js
var Engineer = Class({
  constructor: function (name, age, type) {
    this.super(name, age);
    this.type = type;
  },
  extends: Person,
  with: [
    eventEmitter,
    growingEachYear,
    carrierPath
  ],
  static: {
    SOFTWARE: 0,
    CONSTRUCTIONS: 1
  },
  implements: [
    iWorker
  ]
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



### License
[MIT Style License](LICENSE.txt)