/*! (C) Andrea Giammarchi - MIT Style License */
define(function(){var e=e||function(e){"use strict";function h(e,t,n){var i,f;for(i in e)a.call(e,i)&&(u||i!==r)&&p(t,i,e[i],n);if(o)for(f=0;f<s.length;f++)i=s[f],a.call(e,i)&&p(t,i,e[i],n)}function p(e,t,n,r){return l(e,t,{enumerable:r,configurable:!0,writable:!0,value:n})}var t="constructor",n="extends",r="prototype",i="static",s=[t,"hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],o=!{valueOf:0}[s[3]](s[6]),u=!p[s[3]](r),a=e[s[1]],f=e.create||function(e){f[r]=e;var t=new f;return f[r]=null,t},l=e.defineProperty;try{l({},"{}",{})}catch(c){l=function(e,t,n){return e[t]=n.value,e}}return function(e){var s=a.call(e,t),o=s?e[t]:function(){},u=a.call(e,n),l=u&&e[n],c=u&&typeof l=="function"?l[r]:l,d=u?p(f(c),t,o,!1):o[r];return s&&delete e[t],u&&(l!==c&&h(l,o,!0),o[r]=d,delete e[n]),a.call(e,i)&&(h(e[i],o,!0),delete e[i]),h(e,d,!1),o}}(Object);return e});