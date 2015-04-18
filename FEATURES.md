### constructor
If specified will be the well known, ES3 compatible, implicit initializer of each `new` instance.

If not present, a fresh new empty `constructor` will be provided and used instead.

```js
var Point = Class({
  constructor: function (x, y) {
    this.x = x;
    this.y = y;
  }
});

var origin = new Point(0, 0);

// another class without a constructor
// ... it will work just as fine
var Base = Class({});
var b = new Base();
```

When a `constructor` is omitted, one is created and assigned by default. If the class is extending, such constructor will implicitly invoke its super with received arguments and it will return the optional content.

```js
var Person = Class({
  constructor: function (name) {
    this.name = name;
  }
});

var Employee = Class({
  extends: Person
});

var me = new Employee('Andrea');
me.name; // "Andrea"
```


#### tips: using named function expressions
For an improved debugging experience during development, using named function expressions is highly recommended for both `constructor` or any other generic method.

Don't worry about old IE problems with function expressions since once passed to a minifier, before pushing to production, all named expression will simply become anonymous.
```js
// development source code
var Point = Class({
  constructor: function Point(x, y) {},
  translate: function translate(x, y) {}
});

// production code once minified
var Point=Class({constructor:function(a,b){},translate:function(a,b){}});
```


### extends
It is possible to inherit classes _or_ objects simply using this property which aim is to reflect somehow ES6 semantics.

```js
// inheriting a class, the base one
var Rectangle = Class({
  constructor: function (width, height) {
    this.width = width;
    this.height = height;
  },
  toString: function () {
    return [this.width, this.height].join('x');
  }
});

// and the extending one
var Square = Class({
  extends: Rectangle,
  constructor: function (size) {
    this.super(size, size);
  }
});

console.log('' + new Square(16)); // 16x16


// inheriting an object ( if necessary )
var logger = {
  tell: function (value) {
    console.log(value);
  }
};

var Moderator = Class({
  extends: logger
});

var admin = new Moderator();
admin.tell('hello there');
```
If extending an object while defining a `class` is a matter of *composing* the `class` functionality, please consider reading further down about the `with` property, which is specially suitable for _mixins_ or _traits_ of any kind.

#### super
As shown already in a previous example, and despite the slightly controversial historical implementation of this keyword across all classical OOP simulators and the current ES6 specs, this property made it too in order to simplify `parent` or `super` invocation within any method.

Following one of the main reasons is to support namespaces, where reaching each time the parent `constructor.prototype` might result into a very tedious and error prone operation.

```js
my.nmsp.AGenericLogger = Class({
  log: function (what) {
    console.log(what);
  }
});

my.nmsp.WithVeryLongDescriptiveNames = Class({
  extends: my.nmsp.AGenericLogger,
  log: function (what) {

    // doing this
    this.super('WVLDN says: ' + what);

    // instead of doing the following
    my.nmsp.AGenericLogger.prototype.log.call(
      this,
      'WVLDN says: ' + what
    );

  }
});
```

#### more details about super and this implementation
I have been advocating against the usage of this techniques in JS for years now, but I have to admit it can be very handy on daily basis.

I've [used it massively in mobile production](https://github.com/WebReflection/redefine/blob/master/src/redefine.js#L296) without a glitch and with a way more complex implementation than the one proposed in here, where I've indeed implemented a logic quite similar to the one found in the good old [klass.js](https://github.com/ded/klass).

Tl;DR ... whenever `super` is not used in the method, the original callback will be used instead of wrapping each method or resolving the property at runtime as done in `redefine`.

Accordingly, please bear in mind that while very performant, this functionality does not come for free and it has many caveats: as example, if you need to do anything slightly more different than usual (asynchronous calls to `super` or borrowed bindings) be sure `this.super(arg1, argN)` will work as expected and feel free to ditch it for the good old direct pattern which will also most likely bring some slightly better raw performance.


### with
While lightweight *traits*, also commonly known as *mixins*, have been probably scheduled for ES7, composing prototypes and behaviors have been a long used technique in Javascript and since ES3 or before.

The "reserved" and semantic ES3 property name that more explain the intent is `with`:

```js

// emitter example for demo purpose
var EventEmitter = {
  init: function () {
    // initialize without causing
    // name clashes the property
    this._eventEmitterData = {};
  },
  on: function (type, handler) {
    var _ = this._eventEmitterData;
    (_[type] || (_[type] = [])).push(handler);
  },
  off: function (type, handler) {
    var _ = this._eventEmitterData;
    _[type].splice(_[type].indexOf(handler), 1);
  },
  emit: function (type) {
    var args = [].slice.call(arguments, 1);
    this._eventEmitterData[type].forEach(function (h) {
      h.apply(this, args);
    }, this);
  }
};

// server example for demo purpose
var WebServer = {
  init: function () {
    this.socket = new Socket(1337);
  },
  connect: function (then) {
    this.socket.connect(function (info) {
      then(info);
    });
  }
};

// app exmaple for demo purpose
var Application = Class({
  with: [
    EventEmitter,
    WebServer
  ],
  constructor: function (callback) {
    this.on('connected', callback);
    this.connect(function (info) {
      this.emit('connected', info);
    }.bind(this));
  }
});

```

Similar to what the deprecated `with` keyword actually does, every instance of `Application` will automatically have, through the prototype chain, all methods and properties defined in `EventEmitter` and `WebServer`.

The optional `init` method will be executed, if present, right before the `constructor` in oder to have an already set instance with everything needed and expected to operate.

Since version `1.0.0`, in case a trait is a class, `init` will be represented by the `constructor`, and properties will be borrowed from its `prototype`.


### static
Every class can have one or more static definitions.
```js
var Panel = Class({
  static: {
    SCROLLABLE: true
  }
});

var Page = Class({
  extends: Panel,
  static: {
    RESIZABLE: true
  }
});
```
`Page` will have both `SCROLLABLE` and `RESIZABLE` as own public static properties. These properties are defined as such:
```js
// public static descriptor
{
  enumerable: true,
  configurable: false,
  writable: false
}
```


### implements
Every class can implement one or more interfaces. These will be checked at definition time only and warn in case something is missing.
```js
// interface iMouse
var iMouse = {
  // describes expected methods
  moveTo: function (x, y) {
    // it could be used for documentation purpose too
  },
  scrollTo: function (value) {}
};

var MyMouse = Class({
  implements: iMouse,
  constructor: function () {
    this.cursor = {x: 0, y: 0};
    this.scroll = 0;
  },
  moveTo: function (x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
  }
  // omitting scrollTo method
});

// warning: scrollTo is not implemented 
```
Please bear in mind that this property is very permissive and lightweight and its main purpose is to give, eventually, an extra semantic meaning to a class definition.

No arity, property type, type of arguments, or complicated things are verified: simply the property name.


### prototype
Every property in the prototype will be defined as such:
```js
// prototype own properties descriptor
{
  enumerable: false,
  configurable: true,
  writable: true
}
```
This ensure no `for/in` loop conflicts or accidental methods exposure. Please bear in mind as soon as a property will be defined in an instance this will be enumerable unless defined through a descriptor.

#### tips: enumerable defaults
In case non enumerable default values are needed, this pattern works fine:
```js
var Point2D = Class({
  x: 0,
  y: 0
});

var p = new Point2D;
p.x; // 0
p.y; // 0
```
However, if these properties are meant to be publicly available, there is no concrete advantage in defining them in the prototype, while a constructor would work just fine:
```js
var Point2D = Class({
  constructor: function () {
    this.x = 0;
    this.y = 0;
  }
});
```
