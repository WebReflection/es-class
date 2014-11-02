es-class
========

[![build status](https://secure.travis-ci.org/WebReflection/es-class.png)](http://travis-ci.org/WebReflection/es-class)


### Simple, semantic, and lightweight
This basic tool to define classes fits in few bytes (~570) bringing a semantic and elegant way to define cross platform all classes you need.
```js
var Rectangle = new Class({
  constructor: function Rectangle(width, height) {
    this.width = width;
    this.height = height;
  }
});

var Square = new Class({
  extends: Rectangle,
  constructor: function Square(width) {
    Rectangle.call(this, width, width);
  }
});
```

Beside `extends` there is only one extra property: `static`.

Such property is used to define all static properties **only** on the constructor, avoiding interferences with instances, still preserving inheritance within constructors statics.

In case it's needed, it is possible to define both statics and properties without problems.

```js
var Rectangle = new Class({
  static: {
    SHAPE: 'Rectangle'
  },
  constructor: function Rectangle(width, height) {
    this.width = width;
    this.height = height;
  },
  // in case you need a property
  // with same value or even a different one
  SHAPE: 'RectangleInstance'
});

var r10x20 = new Rectangle(10, 20);
r10x20.SHAPE;     // RectangleInstance
Rectangle.SHAPE;  // Rectangle
```


#### Minimal convenience for common daily tasks
There is no black magic behind any of `es-class` behaviors, what you see is what you get.

No magic `superClass` or `sup`, no magic wraps whatsoever, you explicitly invoke what you need when and if you need.


### ES3 friendly via ES5 compatible syntax
Regardless the usage of reserved keywords such `extends` or `static`, every modern _minifier_ will take care of stringifying them, same way it would do with `delete` properties when, as example, `Map` or `WeakMap` ES6 collections are in place.

Take this code as example:
```js
var A = Class({
  static: {
    A: 'a'
  }
});
var B = Class({
  extends: A
});
```
It will result in the following, once minified, using both closure compiler and uglify JS:
```js
var A=Class({"static":{A:"a"}}),B=Class({"extends":A});
```
No build task? Simply wrap them in quotes, or simply `output.repalce(/\b(extends|static)\b(\s*:)/, "'$1'$2")` before a production deploy in case ES3 compatible browsers are part of your targets ( mostly IE8 and lower, nothing to worry about for IE9 or modern engines, including nodejs and other server side related ).