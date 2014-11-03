es-class
========

[![build status](https://secure.travis-ci.org/WebReflection/es-class.png)](http://travis-ci.org/WebReflection/es-class)


### Simple, semantic, performant and lightweight Class definition for ECMAScript 3, 5, and 6 compatible engines
This basic tool to define classes fits in few bytes (~590 bytes) bringing a semantic and elegant way to define [cross platform](http://webreflection.github.io/es-class/test) all classes you need.
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


#### Minimal convenience for common daily tasks
There is no black magic behind any of `es-class` behaviors, what you see is what you expect and what you get.


### About `extends` property
The `extends` property is used to indeed extends other classes or objects.

A generic prototype descriptor for each extended property would use this configuration:
```js
{
    enumerable: false,      // not visible in for/in loops
    configurable: true,     // can be redefined when/if needed
    writable: true          // can be overwritten when/if needed
}
```

However, it's never too late to `Object.freeze` a `prototype` but I believe most of the time is not needed.


#### About `static` property
The `static` property is used to define all public static properties **only** on the constructor, avoiding interferences with instances, still preserving inheritance within constructors statics.

A generic descriptor for a public static property would use this configuration:
```js
{
    enumerable: true,       // visible
    configurable: false,    // cannot remove or re-configure
    writable: false         // cannot re-assign
}
```

In case it's needed, it is possible to define both statics _and_ properties without problems.

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


#### are properties not enumerable in IE8 and lower too ?
Not a chance and it doesn't matter because if old IE browsers are a target you need to be sure every `for/in` loop is guarded through `Object.prototype.hasOwnProperty` checks. Bear in mind you might want to ensure such loop won't fail with more modern engines and objects so feel free [to read more about here](https://groups.google.com/forum/#!msg/jsmentors/cXeYNxKx-Ro/CZLiMKv2SoMJ).