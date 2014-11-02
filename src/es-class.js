var Class = Class || (function (Object) {
  'use strict';

  /*! (C) Andrea Giammarchi - MIT Style License */

  var
    // shortcuts for minifiers and ES3 private keywords too
    CONSTRUCTOR = 'constructor',
    EXTENDS = 'extends',
    PROTOTYPE = 'prototype',
    STATIC = 'static',

    // IE only bug
    // used to copy non enumerable properties
    nonEnumerables = [
      CONSTRUCTOR,
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ],

    hasEnumerableBug = !{valueOf:0}[nonEnumerables[3]](nonEnumerables[6]),

    hOP = Object[nonEnumerables[1]],

    // basic ad-hoc private fallback for old browsers
    // use es5-shim if you want a properly patched Object.create polyfill
    create = Object.create || function (proto, descriptors) {
      /*jshint newcap: false */
      return (create[PROTOTYPE] = proto) ?
        new create(null, descriptors) :
        (this[CONSTRUCTOR] = descriptors[CONSTRUCTOR].value) && this
      ;
    },
    defineProperty = Object.defineProperty
  ;

  // verified broken IE8
  try {
    defineProperty({}, '{}', {});
  } catch(o_O) {
    defineProperty = function (object, name, descriptor) {
      object[name] = descriptor.value;
    };
  }

  // copy enumerable source properties as tearget properties
  // these might be copied as enumerable (i.e. statics) or not
  function copyEnumerables(source, target, makeEnumerable) {
    var key, i;
    for (key in source) {
      if (hOP.call(source, key)) {
        setProperty(target, key, source[key], makeEnumerable);
      }
    }
    if (hasEnumerableBug) {
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
    defineProperty(target, key, {
      enumerable: makeEnumerable,
      configurable: true,
      writable: true,
      value: value
    });
  }

  // Class({ ... })
  function Class(description) {
    var
      constructor = hOP.call(description, CONSTRUCTOR) ?
        description[CONSTRUCTOR] : function Class() {},
      hasParent = hOP.call(description, EXTENDS),
      parent = hasParent && description[EXTENDS],
      inherits = hasParent && typeof parent === 'function' ?
        parent[PROTOTYPE] : parent,
      prototype = hasParent ?
        create(inherits, {
          constructor: {
            configurable: true,
            writable: true,
            value: constructor
          }
        }) :
        constructor[PROTOTYPE]
    ;
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