es-class
========

[![build status](https://secure.travis-ci.org/WebReflection/es-class.png)](http://travis-ci.org/WebReflection/es-class)


### Simple, semantic, and lightweight
This basic tool to define classes fits in few bytes (~580) bringing a semantic and elegant way to define [cross platform](http://webreflection.github.io/es-class/test) all classes you need.
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
It will result in the following, once minified, using both closure compiler or uglify JS:
```js
var A=Class({"static":{A:"a"}}),B=Class({"extends":A});
```
No build task? Just wrap them in quotes as done in the [test file](test/es-class.js).

However, this is mostly IE8 and lower only issue, nothing to worry about for IE9 and modern engines, including nodejs and others.

### F.A.Q.

#### is it safe to use protected keywords ?
In this ES5 compatible age all keywords are not protected anymore. `weakMap.delete(object)` is a basic example where protected keywords, as `delete` is, can be used without problems indeed. However, as specified in the previous chapter, all modern minifiers will take care of these names wrapping them in quotes so that no engine will fail but your source code will still look awesome.


#### but why using protected keywords ?
Your editor will most likely syntax highlight both `extends` and `static` so that you can easily and instantly spot them. It's actually a help for you writing code, no special highlight? It's mispelled! Has special highlights? Quickly find them while scrolling and read what these classes do and from where.