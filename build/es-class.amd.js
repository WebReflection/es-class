/*! (C) Andrea Giammarchi - MIT Style License */
define(function(){var e=e||function(e){"use strict";function g(e,t,n){for(var r,s=[],o=0;o<e.length;o++)r=e[o],c.call(r,i)&&s.push(r[i]),y(r,t,n,!1,!1);return s}function y(e,t,n,r,i){var s,o;for(s in e)w(s,i)&&c.call(e,s)&&(c.call(t,s)&&x("duplicated: "+s),E(n,t,s,e[s],r));if(l)for(o=0;o<f.length;o++)s=f[o],c.call(e,s)&&E(n,t,s,e[s],r)}function b(e,t,n,r){return d(e,t,{enumerable:r,configurable:!r,writable:!r,value:n})}function w(e,f){return e!==t&&e!==n&&e!==r&&e!==s&&e!==o&&e!==u&&e!==a&&(f||e!==i)}function E(e,t,n,r,i){if(i){if(c.call(t,n))return t}else typeof r=="function"&&v.test(r)&&(r=T(e,n,r,i));return b(t,n,r,i)}function S(e,t){for(var n,r,i=0;i<e.length;i++){n=e[i];for(r in n)c.call(n,r)&&!c.call(t,r)&&x(r+" is not implemented")}}function x(e){try{console.warn(e)}catch(t){}}function T(e,t,n,r){return function(){c.call(this,u)||b(this,u,null,r);var i=this[u],s=this[u]=e[t],o=n.apply(this,arguments);return this[u]=i,o}}var t="constructor",n="extends",r="implements",i="init",s="prototype",o="static",u="super",a="with",f=["hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],l=!{valueOf:0}[f[2]](f[5]),c=e[f[0]],h=e.create||function(e){var t=this instanceof h;return h[s]=t?p:e,t?this:new h},p=h[s],d=e.defineProperty,v=/\bsuper\b/.test(function(){this["super"]()})?/\bsuper\b/:/.*/;try{d({},"{}",{})}catch(m){d=function(e,t,n){return e[t]=n.value,e}}return function(e){var i=c.call(e,t),u=i?e[t]:function(){},f=c.call(e,n),l=f&&i&&v.test(u),p=f&&e[n],d=f&&typeof p=="function"?p[s]:p,m=f?h(d):u[s],w,E;return l&&(u=T(d,t,u,!1)),c.call(e,a)&&(w=g([].concat(e[a]),m,d),E=w.length,E&&(u=function(e){return function(){var t=0;while(t<E)w[t++].call(this);return e.apply(this,arguments)}}(u),u[s]=m)),c.call(e,o)&&y(e[o],u,d,!0,!0),f&&(p!==d&&y(p,u,d,!0,!0),u[s]=m),m[t]!==u&&b(m,t,u,!1),y(e,m,d,!1,!0),c.call(e,r)&&S([].concat(e[r]),m),u}}(Object);return e});