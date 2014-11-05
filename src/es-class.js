var Class = Class || (function (Object) {
  'use strict';

  /*! (C) Andrea Giammarchi - MIT Style License */

  var
    // shortcuts for minifiers and ES3 private keywords too
    CONSTRUCTOR = 'constructor',
    EXTENDS = 'extends',
    WITH = 'with',
    IMPLEMENTS = 'implements',
    INIT = 'init',
    PROTOTYPE = 'prototype',
    STATIC = 'static',
    SUPER = 'super',

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
    defineProperty = Object.defineProperty,

    superRegExp = /create/.test(function () {
      create();
    }) ? /\bsuper\b/ : /.*/

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
  function addMixins(mixins, target, inherits) {
    for (var
      source,
      init = [],
      i = 0; i < mixins.length; i++
    ) {
      source = mixins[i];
      if (hOP.call(source, INIT)) {
        init.push(source[INIT]);
      }
      copyEnumerables(source, target, inherits, false, false);
    }
    return init;
  }

  // configure enumerable source properties in the target
  function copyEnumerables(source, target, inherits, publicStatic, allowInit) {
    var key, i;
    for (key in source) {
      if (isNotASpecialKey(key, allowInit) && hOP.call(source, key)) {
        if (hOP.call(target, key)) {
          warn('duplicated: ' + key);
        }
        setProperty(inherits, target, key, source[key], publicStatic);
      }
    }
    if (hasIEEnumerableBug) {
      for (i = 0; i < nonEnumerables.length; i++) {
        key = nonEnumerables[i];
        if (hOP.call(source, key)) {
          setProperty(inherits, target, key, source[key], publicStatic);
        }
      }
    }
  }

  function define(target, key, value, publicStatic) {
    return defineProperty(target, key, {
      enumerable: publicStatic,
      configurable: !publicStatic,
      writable: !publicStatic,
      value: value
    });
  }

  function isNotASpecialKey(key, allowInit) {
    return  key !== CONSTRUCTOR &&
            key !== EXTENDS &&
            key !== IMPLEMENTS &&
            // Blackberry 7 and old WebKit bug only:
            //  user defined functions have
            //  enumerable prototype and constructor
            key !== PROTOTYPE &&
            key !== STATIC &&
            key !== SUPER &&
            key !== WITH &&
            (allowInit || key !== INIT);
  }

  // set a property via defineProperty using a common descriptor
  // only if properties where not defined yet.
  // If publicStatic is true, properties are both non configurable and non writable
  function setProperty(inherits, target, key, value, publicStatic) {
    if (publicStatic) {
      if (hOP.call(target, key)) {
        return target;
      }
    } else {
      if (typeof value === 'function' && superRegExp.test(value)) {
        value = wrap(inherits, target, key, value, publicStatic);
      }
    }
    return define(target, key, value, publicStatic);
  }

  function verifyImplementations(interfaces, target) {
    for (var
      current,
      key,
      i = 0; i < interfaces.length; i++
    ) {
      current = interfaces[i];
      for (key in current) {
        if (hOP.call(current, key) && !hOP.call(target, key)) {
          warn(key + ' is not implemented');
        }
      }
    }
  }

  function warn(message) {
    try {
      console.warn(message);
    } catch(meh) {
      /*\_(ツ)_*/
    }
  }

  function wrap(inherits, target, key, method, publicStatic) {
    return function () {
      if (!hOP.call(this, SUPER)) {
        // define it once in order to use
        // fast assignment every other time
        define(this, SUPER, null, publicStatic);
      }
      var
        previous = this[SUPER],
        current = (this[SUPER] = inherits[key]),
        result = method.apply(this, arguments)
      ;
      this[SUPER] = previous;
      return result;
    };
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
        setProperty(inherits, create(inherits), CONSTRUCTOR, constructor, false) :
        constructor[PROTOTYPE],
      mixins,
      length
    ;
    if (hOP.call(description, STATIC)) {
      // add new public static properties first
      copyEnumerables(description[STATIC], constructor, inherits, true, true);
    }
    if (hasParent) {
      // in case it's a function
      if (parent !== inherits) {
        // copy possibly inherited statics too
        copyEnumerables(parent, constructor, inherits, true, true);
      }
      constructor[PROTOTYPE] = prototype;
    }
    // add modules/mixins
    if (hOP.call(description, WITH)) {
      mixins = addMixins([].concat(description[WITH]), prototype, inherits);
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
    copyEnumerables(description, prototype, inherits, false, true);
    if (hOP.call(description, IMPLEMENTS)) {
      verifyImplementations([].concat(description[IMPLEMENTS]), prototype);
    }
    return constructor;
  };

}(Object));