var Class = Class || (function (Object) {
  'use strict';

  /*! (C) Andrea Giammarchi - MIT Style License */

  var
    // shortcuts for minifiers and ES3 private keywords too
    CONSTRUCTOR = 'constructor',
    EXTENDS = 'extends',
    WITH = 'with',
    INIT = 'init',
    PROTOTYPE = 'prototype',
    STATIC = 'static',

    // used to copy non enumerable properties on IE
    nonEnumerables = [
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ],

    // IE < 9 bug only
    hasIEEnumerableBug = !{valueOf:0}[nonEnumerables[2]](nonEnumerables[5]),

    hOP = Object[nonEnumerables[0]],

    // basic ad-hoc private fallback for old browsers
    // use es5-shim if you want a properly patched Object.create polyfill
    create = Object.create || function (proto) {
      /*jshint newcap: false */
      var isInstance = this instanceof create;
      create[PROTOTYPE] = isInstance ? null : proto;
      return isInstance ? this : new create();
    },

    // redefined if not present
    defineProperty = Object.defineProperty
  ;

  // verified broken IE8
  try {
    defineProperty({}, '{}', {});
  } catch(o_O) {
    defineProperty = function (object, name, descriptor) {
      object[name] = descriptor.value;
      return object;
    };
  }

  // copy all imported enumerable methods and properties
  // throws if there is any duplicated name in the prototype
  function addMixins(mixins, target) {
    for (var
      source,
      init = [],
      i = 0; i < mixins.length; i++
    ) {
      source = mixins[i];
      if (hOP.call(source, INIT)) {
        init.push(source[INIT]);
      }
      copyEnumerables(source, target, false, false);
    }
    return init;
  }

  function checkDuplicatedAndSet(target, key, value, publicStatic) {
    if (hOP.call(target, key)) {
      try {
        console.warn('duplicated: ' + key);
      } catch(meh) {
        /*\_(ツ)_*/
      }
    }
    setProperty(target, key, value, publicStatic);
  }

  function isNotASpecialKey(key, allowInit) {
    return  key !== CONSTRUCTOR &&
            key !== EXTENDS &&
            key !== WITH &&
            key !== STATIC &&
            // Blackberry 7 and old WebKit bug only:
            //  user defined functions have
            //  enumerable prototype and constructor
            key !== PROTOTYPE &&
            (allowInit || key !== INIT);
  }

  // configure enumerable source properties in the target
  function copyEnumerables(source, target, publicStatic, allowInit) {
    var key, i;
    for (key in source) {
      if (isNotASpecialKey(key, allowInit) && hOP.call(source, key)) {
        checkDuplicatedAndSet(target, key, source[key], publicStatic);
      }
    }
    if (hasIEEnumerableBug) {
      for (i = 0; i < nonEnumerables.length; i++) {
        key = nonEnumerables[i];
        if (hOP.call(source, key)) {
          setProperty(target, key, source[key], publicStatic);
        }
      }
    }
  }

  // set a property via defineProperty using a common descriptor
  // only if properties where not defined yet.
  // If publicStatic is true, properties are both non configurable and non writable
  function setProperty(target, key, value, publicStatic) {
    return publicStatic && hOP.call(target, key) ?
      target :
      defineProperty(target, key, {
        enumerable: publicStatic,
        configurable: !publicStatic,
        writable: !publicStatic,
        value: value
      });
  }

  // Class({ ... })
  return function (description) {
    var
      hasConstructor = hOP.call(description, CONSTRUCTOR),
      constructor = hasConstructor ?
        description[CONSTRUCTOR] : function Class() {},
      hasParent = hOP.call(description, EXTENDS),
      parent = hasParent && description[EXTENDS],
      inherits = hasParent && typeof parent === 'function' ?
        parent[PROTOTYPE] : parent,
      prototype = hasParent ?
        setProperty(create(inherits), CONSTRUCTOR, constructor, false) :
        constructor[PROTOTYPE],
      mixins,
      length
    ;
    if (hOP.call(description, STATIC)) {
      // add new public static properties first
      copyEnumerables(description[STATIC], constructor, true, true);
    }
    if (hasParent) {
      // in case it's a function
      if (parent !== inherits) {
        // copy possibly inherited statics too
        copyEnumerables(parent, constructor, true, true);
      }
      constructor[PROTOTYPE] = prototype;
    }
    // add modules/mixins
    if (hOP.call(description, WITH)) {
      mixins = addMixins([].concat(description[WITH]), prototype);
      length = mixins.length;
      if (length) {
        constructor = (function (parent) {
          return function () {
            var i = 0;
            while (i < length) mixins[i++].call(this);
            return parent.apply(this, arguments);
          };
        }(constructor));
        constructor[PROTOTYPE] = prototype;
      }
    }
    // enrich the prototype
    copyEnumerables(description, prototype, false, true);
    return constructor;
  };

}(Object));