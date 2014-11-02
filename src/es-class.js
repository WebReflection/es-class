var Class = Class || (function (Object) {
  'use strict';

  /*! (C) Andrea Giammarchi - MIT Style License */

  var
    // shortcuts for minifiers and ES3 private keywords too
    CONSTRUCTOR = 'constructor',
    EXTENDS = 'extends',
    PROTOTYPE = 'prototype',
    STATIC = 'static',

    // used to copy non enumerable properties on IE
    nonEnumerables = [
      CONSTRUCTOR,
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ],

    // IE < 9 bug only
    hasIEEnumerableBug = !{valueOf:0}[nonEnumerables[3]](nonEnumerables[6]),

    // Blackberry 7 and old webkit bug only
    hasNotBB7EnumerableBug = !Class[nonEnumerables[3]](PROTOTYPE),

    hOP = Object[nonEnumerables[1]],

    // basic ad-hoc private fallback for old browsers
    // use es5-shim if you want a properly patched Object.create polyfill
    create = Object.create || function (proto) {
      /*jshint newcap: false */
      create[PROTOTYPE] = proto;
      var object = new create;
      create[PROTOTYPE] = null;
      return object;
    },
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

  // copy enumerable source properties as tearget properties
  // these might be copied as enumerable (i.e. statics) or not
  function copyEnumerables(source, target, makeEnumerable) {
    var key, i;
    for (key in source) {
      if (
        hOP.call(source, key) &&
        (hasNotBB7EnumerableBug || (key !== PROTOTYPE))
      ) {
        setProperty(target, key, source[key], makeEnumerable);
      }
    }
    if (hasIEEnumerableBug) {
      for (i = 0; i < nonEnumerables.length; i++) {
        key = nonEnumerables[i];
        if (hOP.call(source, key)) {
          setProperty(target, key, source[key], makeEnumerable);
        }
      }
    }
  }

  // set a property via defineProperty using a common descriptor
  function setProperty(target, key, value, makeEnumerable) {
    return defineProperty(target, key, {
      enumerable: makeEnumerable,
      configurable: true,
      writable: true,
      value: value
    });
  }

  // Class({ ... })
  function Class(description) {
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
        constructor[PROTOTYPE]
    ;
    if (hasConstructor) {
      delete description[CONSTRUCTOR];
    }
    if (hasParent) {
      // in case it's a function
      if (parent !== inherits) {
        // copy possibly inherited statics
        copyEnumerables(parent, constructor, true);
      }
      constructor[PROTOTYPE] = prototype;
      delete description[EXTENDS];
    }
    if (hOP.call(description, STATIC)) {
      // add new statics
      copyEnumerables(description[STATIC], constructor, true);
      delete description[STATIC];
    }
    // enrich the prototype
    copyEnumerables(description, prototype, false);
    return constructor;
  }

  return Class;

}(Object));