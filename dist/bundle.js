(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.production.min.js
  var require_react_production_min = __commonJS({
    "node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l = /* @__PURE__ */ Symbol.for("react.element");
      var n = /* @__PURE__ */ Symbol.for("react.portal");
      var p = /* @__PURE__ */ Symbol.for("react.fragment");
      var q = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var r = /* @__PURE__ */ Symbol.for("react.profiler");
      var t = /* @__PURE__ */ Symbol.for("react.provider");
      var u = /* @__PURE__ */ Symbol.for("react.context");
      var v = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var w = /* @__PURE__ */ Symbol.for("react.suspense");
      var x = /* @__PURE__ */ Symbol.for("react.memo");
      var y = /* @__PURE__ */ Symbol.for("react.lazy");
      var z = Symbol.iterator;
      function A(a) {
        if (null === a || "object" !== typeof a) return null;
        a = z && a[z] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var B = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      var C = Object.assign;
      var D = {};
      function E(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      E.prototype.isReactComponent = {};
      E.prototype.setState = function(a, b) {
        if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a, b, "setState");
      };
      E.prototype.forceUpdate = function(a) {
        this.updater.enqueueForceUpdate(this, a, "forceUpdate");
      };
      function F() {
      }
      F.prototype = E.prototype;
      function G(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      var H = G.prototype = new F();
      H.constructor = G;
      C(H, E.prototype);
      H.isPureReactComponent = true;
      var I = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K = { current: null };
      var L = { key: true, ref: true, __self: true, __source: true };
      function M(a, b, e) {
        var d, c = {}, k = null, h = null;
        if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
        var g = arguments.length - 2;
        if (1 === g) c.children = e;
        else if (1 < g) {
          for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
          c.children = f;
        }
        if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
        return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
      }
      function N(a, b) {
        return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
      }
      function O(a) {
        return "object" === typeof a && null !== a && a.$$typeof === l;
      }
      function escape(a) {
        var b = { "=": "=0", ":": "=2" };
        return "$" + a.replace(/[=:]/g, function(a2) {
          return b[a2];
        });
      }
      var P = /\/+/g;
      function Q(a, b) {
        return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
      }
      function R(a, b, e, d, c) {
        var k = typeof a;
        if ("undefined" === k || "boolean" === k) a = null;
        var h = false;
        if (null === a) h = true;
        else switch (k) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a.$$typeof) {
              case l:
              case n:
                h = true;
            }
        }
        if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
          return a2;
        })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
        h = 0;
        d = "" === d ? "." : d + ":";
        if (I(a)) for (var g = 0; g < a.length; g++) {
          k = a[g];
          var f = d + Q(k, g);
          h += R(k, b, e, f, c);
        }
        else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
        else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
        return h;
      }
      function S(a, b, e) {
        if (null == a) return a;
        var d = [], c = 0;
        R(a, d, "", "", function(a2) {
          return b.call(e, a2, c++);
        });
        return d;
      }
      function T(a) {
        if (-1 === a._status) {
          var b = a._result;
          b = b();
          b.then(function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
          }, function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
          });
          -1 === a._status && (a._status = 0, a._result = b);
        }
        if (1 === a._status) return a._result.default;
        throw a._result;
      }
      var U = { current: null };
      var V = { transition: null };
      var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
      function X2() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      exports.Children = { map: S, forEach: function(a, b, e) {
        S(a, function() {
          b.apply(this, arguments);
        }, e);
      }, count: function(a) {
        var b = 0;
        S(a, function() {
          b++;
        });
        return b;
      }, toArray: function(a) {
        return S(a, function(a2) {
          return a2;
        }) || [];
      }, only: function(a) {
        if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
      } };
      exports.Component = E;
      exports.Fragment = p;
      exports.Profiler = r;
      exports.PureComponent = G;
      exports.StrictMode = q;
      exports.Suspense = w;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
      exports.act = X2;
      exports.cloneElement = function(a, b, e) {
        if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
        var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
        if (null != b) {
          void 0 !== b.ref && (k = b.ref, h = K.current);
          void 0 !== b.key && (c = "" + b.key);
          if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
          for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
        }
        var f = arguments.length - 2;
        if (1 === f) d.children = e;
        else if (1 < f) {
          g = Array(f);
          for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
          d.children = g;
        }
        return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
      };
      exports.createContext = function(a) {
        a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
        a.Provider = { $$typeof: t, _context: a };
        return a.Consumer = a;
      };
      exports.createElement = M;
      exports.createFactory = function(a) {
        var b = M.bind(null, a);
        b.type = a;
        return b;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a) {
        return { $$typeof: v, render: a };
      };
      exports.isValidElement = O;
      exports.lazy = function(a) {
        return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
      };
      exports.memo = function(a, b) {
        return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
      };
      exports.startTransition = function(a) {
        var b = V.transition;
        V.transition = {};
        try {
          a();
        } finally {
          V.transition = b;
        }
      };
      exports.unstable_act = X2;
      exports.useCallback = function(a, b) {
        return U.current.useCallback(a, b);
      };
      exports.useContext = function(a) {
        return U.current.useContext(a);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a) {
        return U.current.useDeferredValue(a);
      };
      exports.useEffect = function(a, b) {
        return U.current.useEffect(a, b);
      };
      exports.useId = function() {
        return U.current.useId();
      };
      exports.useImperativeHandle = function(a, b, e) {
        return U.current.useImperativeHandle(a, b, e);
      };
      exports.useInsertionEffect = function(a, b) {
        return U.current.useInsertionEffect(a, b);
      };
      exports.useLayoutEffect = function(a, b) {
        return U.current.useLayoutEffect(a, b);
      };
      exports.useMemo = function(a, b) {
        return U.current.useMemo(a, b);
      };
      exports.useReducer = function(a, b, e) {
        return U.current.useReducer(a, b, e);
      };
      exports.useRef = function(a) {
        return U.current.useRef(a);
      };
      exports.useState = function(a) {
        return U.current.useState(a);
      };
      exports.useSyncExternalStore = function(a, b, e) {
        return U.current.useSyncExternalStore(a, b, e);
      };
      exports.useTransition = function() {
        return U.current.useTransition();
      };
      exports.version = "18.3.1";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/scheduler/cjs/scheduler.production.min.js
  var require_scheduler_production_min = __commonJS({
    "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
      "use strict";
      function f(a, b) {
        var c = a.length;
        a.push(b);
        a: for (; 0 < c; ) {
          var d = c - 1 >>> 1, e = a[d];
          if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
          else break a;
        }
      }
      function h(a) {
        return 0 === a.length ? null : a[0];
      }
      function k(a) {
        if (0 === a.length) return null;
        var b = a[0], c = a.pop();
        if (c !== b) {
          a[0] = c;
          a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
            var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
            if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
            else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
            else break a;
          }
        }
        return b;
      }
      function g(a, b) {
        var c = a.sortIndex - b.sortIndex;
        return 0 !== c ? c : a.id - b.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        l = performance;
        exports.unstable_now = function() {
          return l.now();
        };
      } else {
        p = Date, q = p.now();
        exports.unstable_now = function() {
          return p.now() - q;
        };
      }
      var l;
      var p;
      var q;
      var r = [];
      var t = [];
      var u = 1;
      var v = null;
      var y = 3;
      var z = false;
      var A = false;
      var B = false;
      var D = "function" === typeof setTimeout ? setTimeout : null;
      var E = "function" === typeof clearTimeout ? clearTimeout : null;
      var F = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G(a) {
        for (var b = h(t); null !== b; ) {
          if (null === b.callback) k(t);
          else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
          else break;
          b = h(t);
        }
      }
      function H(a) {
        B = false;
        G(a);
        if (!A) if (null !== h(r)) A = true, I(J);
        else {
          var b = h(t);
          null !== b && K(H, b.startTime - a);
        }
      }
      function J(a, b) {
        A = false;
        B && (B = false, E(L), L = -1);
        z = true;
        var c = y;
        try {
          G(b);
          for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
            var d = v.callback;
            if ("function" === typeof d) {
              v.callback = null;
              y = v.priorityLevel;
              var e = d(v.expirationTime <= b);
              b = exports.unstable_now();
              "function" === typeof e ? v.callback = e : v === h(r) && k(r);
              G(b);
            } else k(r);
            v = h(r);
          }
          if (null !== v) var w = true;
          else {
            var m = h(t);
            null !== m && K(H, m.startTime - b);
            w = false;
          }
          return w;
        } finally {
          v = null, y = c, z = false;
        }
      }
      var N = false;
      var O = null;
      var L = -1;
      var P = 5;
      var Q = -1;
      function M() {
        return exports.unstable_now() - Q < P ? false : true;
      }
      function R() {
        if (null !== O) {
          var a = exports.unstable_now();
          Q = a;
          var b = true;
          try {
            b = O(true, a);
          } finally {
            b ? S() : (N = false, O = null);
          }
        } else N = false;
      }
      var S;
      if ("function" === typeof F) S = function() {
        F(R);
      };
      else if ("undefined" !== typeof MessageChannel) {
        T = new MessageChannel(), U = T.port2;
        T.port1.onmessage = R;
        S = function() {
          U.postMessage(null);
        };
      } else S = function() {
        D(R, 0);
      };
      var T;
      var U;
      function I(a) {
        O = a;
        N || (N = true, S());
      }
      function K(a, b) {
        L = D(function() {
          a(exports.unstable_now());
        }, b);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a) {
        a.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A || z || (A = true, I(J));
      };
      exports.unstable_forceFrameRate = function(a) {
        0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h(r);
      };
      exports.unstable_next = function(a) {
        switch (y) {
          case 1:
          case 2:
          case 3:
            var b = 3;
            break;
          default:
            b = y;
        }
        var c = y;
        y = b;
        try {
          return a();
        } finally {
          y = c;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a = 3;
        }
        var c = y;
        y = a;
        try {
          return b();
        } finally {
          y = c;
        }
      };
      exports.unstable_scheduleCallback = function(a, b, c) {
        var d = exports.unstable_now();
        "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
        switch (a) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c + e;
        a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
        c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
        return a;
      };
      exports.unstable_shouldYield = M;
      exports.unstable_wrapCallback = function(a) {
        var b = y;
        return function() {
          var c = y;
          y = b;
          try {
            return a.apply(this, arguments);
          } finally {
            y = c;
          }
        };
      };
    }
  });

  // node_modules/scheduler/index.js
  var require_scheduler = __commonJS({
    "node_modules/scheduler/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_scheduler_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom.production.min.js
  var require_react_dom_production_min = __commonJS({
    "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
      "use strict";
      var aa = require_react();
      var ca = require_scheduler();
      function p(a) {
        for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
        return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var da = /* @__PURE__ */ new Set();
      var ea = {};
      function fa(a, b) {
        ha(a, b);
        ha(a + "Capture", b);
      }
      function ha(a, b) {
        ea[a] = b;
        for (a = 0; a < b.length; a++) da.add(b[a]);
      }
      var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      var ja = Object.prototype.hasOwnProperty;
      var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
      var la = {};
      var ma = {};
      function oa(a) {
        if (ja.call(ma, a)) return true;
        if (ja.call(la, a)) return false;
        if (ka.test(a)) return ma[a] = true;
        la[a] = true;
        return false;
      }
      function pa(a, b, c, d) {
        if (null !== c && 0 === c.type) return false;
        switch (typeof b) {
          case "function":
          case "symbol":
            return true;
          case "boolean":
            if (d) return false;
            if (null !== c) return !c.acceptsBooleans;
            a = a.toLowerCase().slice(0, 5);
            return "data-" !== a && "aria-" !== a;
          default:
            return false;
        }
      }
      function qa(a, b, c, d) {
        if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
        if (d) return false;
        if (null !== c) switch (c.type) {
          case 3:
            return !b;
          case 4:
            return false === b;
          case 5:
            return isNaN(b);
          case 6:
            return isNaN(b) || 1 > b;
        }
        return false;
      }
      function v(a, b, c, d, e, f, g) {
        this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
        this.attributeName = d;
        this.attributeNamespace = e;
        this.mustUseProperty = c;
        this.propertyName = a;
        this.type = b;
        this.sanitizeURL = f;
        this.removeEmptyString = g;
      }
      var z = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
        z[a] = new v(a, 0, false, a, null, false, false);
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
        var b = a[0];
        z[b] = new v(b, 1, false, a[1], null, false, false);
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
        z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
        z[a] = new v(a, 2, false, a, null, false, false);
      });
      "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
        z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
      });
      ["checked", "multiple", "muted", "selected"].forEach(function(a) {
        z[a] = new v(a, 3, true, a, null, false, false);
      });
      ["capture", "download"].forEach(function(a) {
        z[a] = new v(a, 4, false, a, null, false, false);
      });
      ["cols", "rows", "size", "span"].forEach(function(a) {
        z[a] = new v(a, 6, false, a, null, false, false);
      });
      ["rowSpan", "start"].forEach(function(a) {
        z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
      });
      var ra = /[\-:]([a-z])/g;
      function sa(a) {
        return a[1].toUpperCase();
      }
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
        var b = a.replace(
          ra,
          sa
        );
        z[b] = new v(b, 1, false, a, null, false, false);
      });
      "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
        var b = a.replace(ra, sa);
        z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
      });
      ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
        var b = a.replace(ra, sa);
        z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
      });
      ["tabIndex", "crossOrigin"].forEach(function(a) {
        z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
      });
      z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
      ["src", "href", "action", "formAction"].forEach(function(a) {
        z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
      });
      function ta(a, b, c, d) {
        var e = z.hasOwnProperty(b) ? z[b] : null;
        if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
      }
      var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var va = /* @__PURE__ */ Symbol.for("react.element");
      var wa = /* @__PURE__ */ Symbol.for("react.portal");
      var ya = /* @__PURE__ */ Symbol.for("react.fragment");
      var za = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var Aa = /* @__PURE__ */ Symbol.for("react.profiler");
      var Ba = /* @__PURE__ */ Symbol.for("react.provider");
      var Ca = /* @__PURE__ */ Symbol.for("react.context");
      var Da = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var Ea = /* @__PURE__ */ Symbol.for("react.suspense");
      var Fa = /* @__PURE__ */ Symbol.for("react.suspense_list");
      var Ga = /* @__PURE__ */ Symbol.for("react.memo");
      var Ha = /* @__PURE__ */ Symbol.for("react.lazy");
      var Ia = /* @__PURE__ */ Symbol.for("react.offscreen");
      var Ja = Symbol.iterator;
      function Ka(a) {
        if (null === a || "object" !== typeof a) return null;
        a = Ja && a[Ja] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var A = Object.assign;
      var La;
      function Ma(a) {
        if (void 0 === La) try {
          throw Error();
        } catch (c) {
          var b = c.stack.trim().match(/\n( *(at )?)/);
          La = b && b[1] || "";
        }
        return "\n" + La + a;
      }
      var Na = false;
      function Oa(a, b) {
        if (!a || Na) return "";
        Na = true;
        var c = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
          if (b) if (b = function() {
            throw Error();
          }, Object.defineProperty(b.prototype, "props", { set: function() {
            throw Error();
          } }), "object" === typeof Reflect && Reflect.construct) {
            try {
              Reflect.construct(b, []);
            } catch (l) {
              var d = l;
            }
            Reflect.construct(a, [], b);
          } else {
            try {
              b.call();
            } catch (l) {
              d = l;
            }
            a.call(b.prototype);
          }
          else {
            try {
              throw Error();
            } catch (l) {
              d = l;
            }
            a();
          }
        } catch (l) {
          if (l && d && "string" === typeof l.stack) {
            for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
            for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
              if (1 !== g || 1 !== h) {
                do
                  if (g--, h--, 0 > h || e[g] !== f[h]) {
                    var k = "\n" + e[g].replace(" at new ", " at ");
                    a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                    return k;
                  }
                while (1 <= g && 0 <= h);
              }
              break;
            }
          }
        } finally {
          Na = false, Error.prepareStackTrace = c;
        }
        return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
      }
      function Pa(a) {
        switch (a.tag) {
          case 5:
            return Ma(a.type);
          case 16:
            return Ma("Lazy");
          case 13:
            return Ma("Suspense");
          case 19:
            return Ma("SuspenseList");
          case 0:
          case 2:
          case 15:
            return a = Oa(a.type, false), a;
          case 11:
            return a = Oa(a.type.render, false), a;
          case 1:
            return a = Oa(a.type, true), a;
          default:
            return "";
        }
      }
      function Qa(a) {
        if (null == a) return null;
        if ("function" === typeof a) return a.displayName || a.name || null;
        if ("string" === typeof a) return a;
        switch (a) {
          case ya:
            return "Fragment";
          case wa:
            return "Portal";
          case Aa:
            return "Profiler";
          case za:
            return "StrictMode";
          case Ea:
            return "Suspense";
          case Fa:
            return "SuspenseList";
        }
        if ("object" === typeof a) switch (a.$$typeof) {
          case Ca:
            return (a.displayName || "Context") + ".Consumer";
          case Ba:
            return (a._context.displayName || "Context") + ".Provider";
          case Da:
            var b = a.render;
            a = a.displayName;
            a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
            return a;
          case Ga:
            return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
          case Ha:
            b = a._payload;
            a = a._init;
            try {
              return Qa(a(b));
            } catch (c) {
            }
        }
        return null;
      }
      function Ra(a) {
        var b = a.type;
        switch (a.tag) {
          case 24:
            return "Cache";
          case 9:
            return (b.displayName || "Context") + ".Consumer";
          case 10:
            return (b._context.displayName || "Context") + ".Provider";
          case 18:
            return "DehydratedFragment";
          case 11:
            return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          case 7:
            return "Fragment";
          case 5:
            return b;
          case 4:
            return "Portal";
          case 3:
            return "Root";
          case 6:
            return "Text";
          case 16:
            return Qa(b);
          case 8:
            return b === za ? "StrictMode" : "Mode";
          case 22:
            return "Offscreen";
          case 12:
            return "Profiler";
          case 21:
            return "Scope";
          case 13:
            return "Suspense";
          case 19:
            return "SuspenseList";
          case 25:
            return "TracingMarker";
          case 1:
          case 0:
          case 17:
          case 2:
          case 14:
          case 15:
            if ("function" === typeof b) return b.displayName || b.name || null;
            if ("string" === typeof b) return b;
        }
        return null;
      }
      function Sa(a) {
        switch (typeof a) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return a;
          case "object":
            return a;
          default:
            return "";
        }
      }
      function Ta(a) {
        var b = a.type;
        return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
      }
      function Ua(a) {
        var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
        if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
          var e = c.get, f = c.set;
          Object.defineProperty(a, b, { configurable: true, get: function() {
            return e.call(this);
          }, set: function(a2) {
            d = "" + a2;
            f.call(this, a2);
          } });
          Object.defineProperty(a, b, { enumerable: c.enumerable });
          return { getValue: function() {
            return d;
          }, setValue: function(a2) {
            d = "" + a2;
          }, stopTracking: function() {
            a._valueTracker = null;
            delete a[b];
          } };
        }
      }
      function Va(a) {
        a._valueTracker || (a._valueTracker = Ua(a));
      }
      function Wa(a) {
        if (!a) return false;
        var b = a._valueTracker;
        if (!b) return true;
        var c = b.getValue();
        var d = "";
        a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
        a = d;
        return a !== c ? (b.setValue(a), true) : false;
      }
      function Xa(a) {
        a = a || ("undefined" !== typeof document ? document : void 0);
        if ("undefined" === typeof a) return null;
        try {
          return a.activeElement || a.body;
        } catch (b) {
          return a.body;
        }
      }
      function Ya(a, b) {
        var c = b.checked;
        return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
      }
      function Za(a, b) {
        var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
        c = Sa(null != b.value ? b.value : c);
        a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
      }
      function ab(a, b) {
        b = b.checked;
        null != b && ta(a, "checked", b, false);
      }
      function bb(a, b) {
        ab(a, b);
        var c = Sa(b.value), d = b.type;
        if (null != c) if ("number" === d) {
          if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
        } else a.value !== "" + c && (a.value = "" + c);
        else if ("submit" === d || "reset" === d) {
          a.removeAttribute("value");
          return;
        }
        b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
        null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
      }
      function db(a, b, c) {
        if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
          var d = b.type;
          if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
          b = "" + a._wrapperState.initialValue;
          c || b === a.value || (a.value = b);
          a.defaultValue = b;
        }
        c = a.name;
        "" !== c && (a.name = "");
        a.defaultChecked = !!a._wrapperState.initialChecked;
        "" !== c && (a.name = c);
      }
      function cb(a, b, c) {
        if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
      }
      var eb = Array.isArray;
      function fb(a, b, c, d) {
        a = a.options;
        if (b) {
          b = {};
          for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
          for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
        } else {
          c = "" + Sa(c);
          b = null;
          for (e = 0; e < a.length; e++) {
            if (a[e].value === c) {
              a[e].selected = true;
              d && (a[e].defaultSelected = true);
              return;
            }
            null !== b || a[e].disabled || (b = a[e]);
          }
          null !== b && (b.selected = true);
        }
      }
      function gb(a, b) {
        if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
        return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
      }
      function hb(a, b) {
        var c = b.value;
        if (null == c) {
          c = b.children;
          b = b.defaultValue;
          if (null != c) {
            if (null != b) throw Error(p(92));
            if (eb(c)) {
              if (1 < c.length) throw Error(p(93));
              c = c[0];
            }
            b = c;
          }
          null == b && (b = "");
          c = b;
        }
        a._wrapperState = { initialValue: Sa(c) };
      }
      function ib(a, b) {
        var c = Sa(b.value), d = Sa(b.defaultValue);
        null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
        null != d && (a.defaultValue = "" + d);
      }
      function jb(a) {
        var b = a.textContent;
        b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
      }
      function kb(a) {
        switch (a) {
          case "svg":
            return "http://www.w3.org/2000/svg";
          case "math":
            return "http://www.w3.org/1998/Math/MathML";
          default:
            return "http://www.w3.org/1999/xhtml";
        }
      }
      function lb(a, b) {
        return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
      }
      var mb;
      var nb = (function(a) {
        return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
          MSApp.execUnsafeLocalFunction(function() {
            return a(b, c, d, e);
          });
        } : a;
      })(function(a, b) {
        if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
        else {
          mb = mb || document.createElement("div");
          mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
          for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
          for (; b.firstChild; ) a.appendChild(b.firstChild);
        }
      });
      function ob(a, b) {
        if (b) {
          var c = a.firstChild;
          if (c && c === a.lastChild && 3 === c.nodeType) {
            c.nodeValue = b;
            return;
          }
        }
        a.textContent = b;
      }
      var pb = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      var qb = ["Webkit", "ms", "Moz", "O"];
      Object.keys(pb).forEach(function(a) {
        qb.forEach(function(b) {
          b = b + a.charAt(0).toUpperCase() + a.substring(1);
          pb[b] = pb[a];
        });
      });
      function rb(a, b, c) {
        return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
      }
      function sb(a, b) {
        a = a.style;
        for (var c in b) if (b.hasOwnProperty(c)) {
          var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
          "float" === c && (c = "cssFloat");
          d ? a.setProperty(c, e) : a[c] = e;
        }
      }
      var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
      function ub(a, b) {
        if (b) {
          if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
          if (null != b.dangerouslySetInnerHTML) {
            if (null != b.children) throw Error(p(60));
            if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
          }
          if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
        }
      }
      function vb(a, b) {
        if (-1 === a.indexOf("-")) return "string" === typeof b.is;
        switch (a) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var wb = null;
      function xb(a) {
        a = a.target || a.srcElement || window;
        a.correspondingUseElement && (a = a.correspondingUseElement);
        return 3 === a.nodeType ? a.parentNode : a;
      }
      var yb = null;
      var zb = null;
      var Ab = null;
      function Bb(a) {
        if (a = Cb(a)) {
          if ("function" !== typeof yb) throw Error(p(280));
          var b = a.stateNode;
          b && (b = Db(b), yb(a.stateNode, a.type, b));
        }
      }
      function Eb(a) {
        zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
      }
      function Fb() {
        if (zb) {
          var a = zb, b = Ab;
          Ab = zb = null;
          Bb(a);
          if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
        }
      }
      function Gb(a, b) {
        return a(b);
      }
      function Hb() {
      }
      var Ib = false;
      function Jb(a, b, c) {
        if (Ib) return a(b, c);
        Ib = true;
        try {
          return Gb(a, b, c);
        } finally {
          if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
        }
      }
      function Kb(a, b) {
        var c = a.stateNode;
        if (null === c) return null;
        var d = Db(c);
        if (null === d) return null;
        c = d[b];
        a: switch (b) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
          case "onMouseEnter":
            (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
            a = !d;
            break a;
          default:
            a = false;
        }
        if (a) return null;
        if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
        return c;
      }
      var Lb = false;
      if (ia) try {
        Mb = {};
        Object.defineProperty(Mb, "passive", { get: function() {
          Lb = true;
        } });
        window.addEventListener("test", Mb, Mb);
        window.removeEventListener("test", Mb, Mb);
      } catch (a) {
        Lb = false;
      }
      var Mb;
      function Nb(a, b, c, d, e, f, g, h, k) {
        var l = Array.prototype.slice.call(arguments, 3);
        try {
          b.apply(c, l);
        } catch (m) {
          this.onError(m);
        }
      }
      var Ob = false;
      var Pb = null;
      var Qb = false;
      var Rb = null;
      var Sb = { onError: function(a) {
        Ob = true;
        Pb = a;
      } };
      function Tb(a, b, c, d, e, f, g, h, k) {
        Ob = false;
        Pb = null;
        Nb.apply(Sb, arguments);
      }
      function Ub(a, b, c, d, e, f, g, h, k) {
        Tb.apply(this, arguments);
        if (Ob) {
          if (Ob) {
            var l = Pb;
            Ob = false;
            Pb = null;
          } else throw Error(p(198));
          Qb || (Qb = true, Rb = l);
        }
      }
      function Vb(a) {
        var b = a, c = a;
        if (a.alternate) for (; b.return; ) b = b.return;
        else {
          a = b;
          do
            b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
          while (a);
        }
        return 3 === b.tag ? c : null;
      }
      function Wb(a) {
        if (13 === a.tag) {
          var b = a.memoizedState;
          null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
          if (null !== b) return b.dehydrated;
        }
        return null;
      }
      function Xb(a) {
        if (Vb(a) !== a) throw Error(p(188));
      }
      function Yb(a) {
        var b = a.alternate;
        if (!b) {
          b = Vb(a);
          if (null === b) throw Error(p(188));
          return b !== a ? null : a;
        }
        for (var c = a, d = b; ; ) {
          var e = c.return;
          if (null === e) break;
          var f = e.alternate;
          if (null === f) {
            d = e.return;
            if (null !== d) {
              c = d;
              continue;
            }
            break;
          }
          if (e.child === f.child) {
            for (f = e.child; f; ) {
              if (f === c) return Xb(e), a;
              if (f === d) return Xb(e), b;
              f = f.sibling;
            }
            throw Error(p(188));
          }
          if (c.return !== d.return) c = e, d = f;
          else {
            for (var g = false, h = e.child; h; ) {
              if (h === c) {
                g = true;
                c = e;
                d = f;
                break;
              }
              if (h === d) {
                g = true;
                d = e;
                c = f;
                break;
              }
              h = h.sibling;
            }
            if (!g) {
              for (h = f.child; h; ) {
                if (h === c) {
                  g = true;
                  c = f;
                  d = e;
                  break;
                }
                if (h === d) {
                  g = true;
                  d = f;
                  c = e;
                  break;
                }
                h = h.sibling;
              }
              if (!g) throw Error(p(189));
            }
          }
          if (c.alternate !== d) throw Error(p(190));
        }
        if (3 !== c.tag) throw Error(p(188));
        return c.stateNode.current === c ? a : b;
      }
      function Zb(a) {
        a = Yb(a);
        return null !== a ? $b(a) : null;
      }
      function $b(a) {
        if (5 === a.tag || 6 === a.tag) return a;
        for (a = a.child; null !== a; ) {
          var b = $b(a);
          if (null !== b) return b;
          a = a.sibling;
        }
        return null;
      }
      var ac = ca.unstable_scheduleCallback;
      var bc = ca.unstable_cancelCallback;
      var cc = ca.unstable_shouldYield;
      var dc = ca.unstable_requestPaint;
      var B = ca.unstable_now;
      var ec = ca.unstable_getCurrentPriorityLevel;
      var fc = ca.unstable_ImmediatePriority;
      var gc = ca.unstable_UserBlockingPriority;
      var hc = ca.unstable_NormalPriority;
      var ic = ca.unstable_LowPriority;
      var jc = ca.unstable_IdlePriority;
      var kc = null;
      var lc = null;
      function mc(a) {
        if (lc && "function" === typeof lc.onCommitFiberRoot) try {
          lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
        } catch (b) {
        }
      }
      var oc = Math.clz32 ? Math.clz32 : nc;
      var pc = Math.log;
      var qc = Math.LN2;
      function nc(a) {
        a >>>= 0;
        return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
      }
      var rc = 64;
      var sc = 4194304;
      function tc(a) {
        switch (a & -a) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 4:
            return 4;
          case 8:
            return 8;
          case 16:
            return 16;
          case 32:
            return 32;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return a & 4194240;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return a & 130023424;
          case 134217728:
            return 134217728;
          case 268435456:
            return 268435456;
          case 536870912:
            return 536870912;
          case 1073741824:
            return 1073741824;
          default:
            return a;
        }
      }
      function uc(a, b) {
        var c = a.pendingLanes;
        if (0 === c) return 0;
        var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
        if (0 !== g) {
          var h = g & ~e;
          0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
        } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
        if (0 === d) return 0;
        if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
        0 !== (d & 4) && (d |= c & 16);
        b = a.entangledLanes;
        if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
        return d;
      }
      function vc(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 4:
            return b + 250;
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return b + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return -1;
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
            return -1;
          default:
            return -1;
        }
      }
      function wc(a, b) {
        for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
          var g = 31 - oc(f), h = 1 << g, k = e[g];
          if (-1 === k) {
            if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
          } else k <= b && (a.expiredLanes |= h);
          f &= ~h;
        }
      }
      function xc(a) {
        a = a.pendingLanes & -1073741825;
        return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
      }
      function yc() {
        var a = rc;
        rc <<= 1;
        0 === (rc & 4194240) && (rc = 64);
        return a;
      }
      function zc(a) {
        for (var b = [], c = 0; 31 > c; c++) b.push(a);
        return b;
      }
      function Ac(a, b, c) {
        a.pendingLanes |= b;
        536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
        a = a.eventTimes;
        b = 31 - oc(b);
        a[b] = c;
      }
      function Bc(a, b) {
        var c = a.pendingLanes & ~b;
        a.pendingLanes = b;
        a.suspendedLanes = 0;
        a.pingedLanes = 0;
        a.expiredLanes &= b;
        a.mutableReadLanes &= b;
        a.entangledLanes &= b;
        b = a.entanglements;
        var d = a.eventTimes;
        for (a = a.expirationTimes; 0 < c; ) {
          var e = 31 - oc(c), f = 1 << e;
          b[e] = 0;
          d[e] = -1;
          a[e] = -1;
          c &= ~f;
        }
      }
      function Cc(a, b) {
        var c = a.entangledLanes |= b;
        for (a = a.entanglements; c; ) {
          var d = 31 - oc(c), e = 1 << d;
          e & b | a[d] & b && (a[d] |= b);
          c &= ~e;
        }
      }
      var C = 0;
      function Dc(a) {
        a &= -a;
        return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
      }
      var Ec;
      var Fc;
      var Gc;
      var Hc;
      var Ic;
      var Jc = false;
      var Kc = [];
      var Lc = null;
      var Mc = null;
      var Nc = null;
      var Oc = /* @__PURE__ */ new Map();
      var Pc = /* @__PURE__ */ new Map();
      var Qc = [];
      var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
      function Sc(a, b) {
        switch (a) {
          case "focusin":
          case "focusout":
            Lc = null;
            break;
          case "dragenter":
          case "dragleave":
            Mc = null;
            break;
          case "mouseover":
          case "mouseout":
            Nc = null;
            break;
          case "pointerover":
          case "pointerout":
            Oc.delete(b.pointerId);
            break;
          case "gotpointercapture":
          case "lostpointercapture":
            Pc.delete(b.pointerId);
        }
      }
      function Tc(a, b, c, d, e, f) {
        if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
        a.eventSystemFlags |= d;
        b = a.targetContainers;
        null !== e && -1 === b.indexOf(e) && b.push(e);
        return a;
      }
      function Uc(a, b, c, d, e) {
        switch (b) {
          case "focusin":
            return Lc = Tc(Lc, a, b, c, d, e), true;
          case "dragenter":
            return Mc = Tc(Mc, a, b, c, d, e), true;
          case "mouseover":
            return Nc = Tc(Nc, a, b, c, d, e), true;
          case "pointerover":
            var f = e.pointerId;
            Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
            return true;
          case "gotpointercapture":
            return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
        }
        return false;
      }
      function Vc(a) {
        var b = Wc(a.target);
        if (null !== b) {
          var c = Vb(b);
          if (null !== c) {
            if (b = c.tag, 13 === b) {
              if (b = Wb(c), null !== b) {
                a.blockedOn = b;
                Ic(a.priority, function() {
                  Gc(c);
                });
                return;
              }
            } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
              a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
              return;
            }
          }
        }
        a.blockedOn = null;
      }
      function Xc(a) {
        if (null !== a.blockedOn) return false;
        for (var b = a.targetContainers; 0 < b.length; ) {
          var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
          if (null === c) {
            c = a.nativeEvent;
            var d = new c.constructor(c.type, c);
            wb = d;
            c.target.dispatchEvent(d);
            wb = null;
          } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
          b.shift();
        }
        return true;
      }
      function Zc(a, b, c) {
        Xc(a) && c.delete(b);
      }
      function $c() {
        Jc = false;
        null !== Lc && Xc(Lc) && (Lc = null);
        null !== Mc && Xc(Mc) && (Mc = null);
        null !== Nc && Xc(Nc) && (Nc = null);
        Oc.forEach(Zc);
        Pc.forEach(Zc);
      }
      function ad(a, b) {
        a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
      }
      function bd(a) {
        function b(b2) {
          return ad(b2, a);
        }
        if (0 < Kc.length) {
          ad(Kc[0], a);
          for (var c = 1; c < Kc.length; c++) {
            var d = Kc[c];
            d.blockedOn === a && (d.blockedOn = null);
          }
        }
        null !== Lc && ad(Lc, a);
        null !== Mc && ad(Mc, a);
        null !== Nc && ad(Nc, a);
        Oc.forEach(b);
        Pc.forEach(b);
        for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
        for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
      }
      var cd = ua.ReactCurrentBatchConfig;
      var dd = true;
      function ed(a, b, c, d) {
        var e = C, f = cd.transition;
        cd.transition = null;
        try {
          C = 1, fd(a, b, c, d);
        } finally {
          C = e, cd.transition = f;
        }
      }
      function gd(a, b, c, d) {
        var e = C, f = cd.transition;
        cd.transition = null;
        try {
          C = 4, fd(a, b, c, d);
        } finally {
          C = e, cd.transition = f;
        }
      }
      function fd(a, b, c, d) {
        if (dd) {
          var e = Yc(a, b, c, d);
          if (null === e) hd(a, b, d, id, c), Sc(a, d);
          else if (Uc(e, a, b, c, d)) d.stopPropagation();
          else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
            for (; null !== e; ) {
              var f = Cb(e);
              null !== f && Ec(f);
              f = Yc(a, b, c, d);
              null === f && hd(a, b, d, id, c);
              if (f === e) break;
              e = f;
            }
            null !== e && d.stopPropagation();
          } else hd(a, b, d, null, c);
        }
      }
      var id = null;
      function Yc(a, b, c, d) {
        id = null;
        a = xb(d);
        a = Wc(a);
        if (null !== a) if (b = Vb(a), null === b) a = null;
        else if (c = b.tag, 13 === c) {
          a = Wb(b);
          if (null !== a) return a;
          a = null;
        } else if (3 === c) {
          if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
          a = null;
        } else b !== a && (a = null);
        id = a;
        return null;
      }
      function jd(a) {
        switch (a) {
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
            return 1;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "toggle":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
            return 4;
          case "message":
            switch (ec()) {
              case fc:
                return 1;
              case gc:
                return 4;
              case hc:
              case ic:
                return 16;
              case jc:
                return 536870912;
              default:
                return 16;
            }
          default:
            return 16;
        }
      }
      var kd = null;
      var ld = null;
      var md = null;
      function nd() {
        if (md) return md;
        var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
        for (a = 0; a < c && b[a] === e[a]; a++) ;
        var g = c - a;
        for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
        return md = e.slice(a, 1 < d ? 1 - d : void 0);
      }
      function od(a) {
        var b = a.keyCode;
        "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
        10 === a && (a = 13);
        return 32 <= a || 13 === a ? a : 0;
      }
      function pd() {
        return true;
      }
      function qd() {
        return false;
      }
      function rd(a) {
        function b(b2, d, e, f, g) {
          this._reactName = b2;
          this._targetInst = e;
          this.type = d;
          this.nativeEvent = f;
          this.target = g;
          this.currentTarget = null;
          for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
          this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
          this.isPropagationStopped = qd;
          return this;
        }
        A(b.prototype, { preventDefault: function() {
          this.defaultPrevented = true;
          var a2 = this.nativeEvent;
          a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
        }, stopPropagation: function() {
          var a2 = this.nativeEvent;
          a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
        }, persist: function() {
        }, isPersistent: pd });
        return b;
      }
      var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
        return a.timeStamp || Date.now();
      }, defaultPrevented: 0, isTrusted: 0 };
      var td = rd(sd);
      var ud = A({}, sd, { view: 0, detail: 0 });
      var vd = rd(ud);
      var wd;
      var xd;
      var yd;
      var Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
        return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
      }, movementX: function(a) {
        if ("movementX" in a) return a.movementX;
        a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
        return wd;
      }, movementY: function(a) {
        return "movementY" in a ? a.movementY : xd;
      } });
      var Bd = rd(Ad);
      var Cd = A({}, Ad, { dataTransfer: 0 });
      var Dd = rd(Cd);
      var Ed = A({}, ud, { relatedTarget: 0 });
      var Fd = rd(Ed);
      var Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Hd = rd(Gd);
      var Id = A({}, sd, { clipboardData: function(a) {
        return "clipboardData" in a ? a.clipboardData : window.clipboardData;
      } });
      var Jd = rd(Id);
      var Kd = A({}, sd, { data: 0 });
      var Ld = rd(Kd);
      var Md = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
      };
      var Nd = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
      };
      var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
      function Pd(a) {
        var b = this.nativeEvent;
        return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
      }
      function zd() {
        return Pd;
      }
      var Qd = A({}, ud, { key: function(a) {
        if (a.key) {
          var b = Md[a.key] || a.key;
          if ("Unidentified" !== b) return b;
        }
        return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
      }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
        return "keypress" === a.type ? od(a) : 0;
      }, keyCode: function(a) {
        return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
      }, which: function(a) {
        return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
      } });
      var Rd = rd(Qd);
      var Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
      var Td = rd(Sd);
      var Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
      var Vd = rd(Ud);
      var Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Xd = rd(Wd);
      var Yd = A({}, Ad, {
        deltaX: function(a) {
          return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
        },
        deltaY: function(a) {
          return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
      });
      var Zd = rd(Yd);
      var $d = [9, 13, 27, 32];
      var ae = ia && "CompositionEvent" in window;
      var be = null;
      ia && "documentMode" in document && (be = document.documentMode);
      var ce = ia && "TextEvent" in window && !be;
      var de = ia && (!ae || be && 8 < be && 11 >= be);
      var ee = String.fromCharCode(32);
      var fe = false;
      function ge(a, b) {
        switch (a) {
          case "keyup":
            return -1 !== $d.indexOf(b.keyCode);
          case "keydown":
            return 229 !== b.keyCode;
          case "keypress":
          case "mousedown":
          case "focusout":
            return true;
          default:
            return false;
        }
      }
      function he(a) {
        a = a.detail;
        return "object" === typeof a && "data" in a ? a.data : null;
      }
      var ie = false;
      function je(a, b) {
        switch (a) {
          case "compositionend":
            return he(b);
          case "keypress":
            if (32 !== b.which) return null;
            fe = true;
            return ee;
          case "textInput":
            return a = b.data, a === ee && fe ? null : a;
          default:
            return null;
        }
      }
      function ke(a, b) {
        if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
        switch (a) {
          case "paste":
            return null;
          case "keypress":
            if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
              if (b.char && 1 < b.char.length) return b.char;
              if (b.which) return String.fromCharCode(b.which);
            }
            return null;
          case "compositionend":
            return de && "ko" !== b.locale ? null : b.data;
          default:
            return null;
        }
      }
      var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
      function me(a) {
        var b = a && a.nodeName && a.nodeName.toLowerCase();
        return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
      }
      function ne(a, b, c, d) {
        Eb(d);
        b = oe(b, "onChange");
        0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
      }
      var pe = null;
      var qe = null;
      function re(a) {
        se(a, 0);
      }
      function te(a) {
        var b = ue(a);
        if (Wa(b)) return a;
      }
      function ve(a, b) {
        if ("change" === a) return b;
      }
      var we = false;
      if (ia) {
        if (ia) {
          ye = "oninput" in document;
          if (!ye) {
            ze = document.createElement("div");
            ze.setAttribute("oninput", "return;");
            ye = "function" === typeof ze.oninput;
          }
          xe = ye;
        } else xe = false;
        we = xe && (!document.documentMode || 9 < document.documentMode);
      }
      var xe;
      var ye;
      var ze;
      function Ae() {
        pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
      }
      function Be(a) {
        if ("value" === a.propertyName && te(qe)) {
          var b = [];
          ne(b, qe, a, xb(a));
          Jb(re, b);
        }
      }
      function Ce(a, b, c) {
        "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
      }
      function De(a) {
        if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
      }
      function Ee(a, b) {
        if ("click" === a) return te(b);
      }
      function Fe(a, b) {
        if ("input" === a || "change" === a) return te(b);
      }
      function Ge(a, b) {
        return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
      }
      var He = "function" === typeof Object.is ? Object.is : Ge;
      function Ie(a, b) {
        if (He(a, b)) return true;
        if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
        var c = Object.keys(a), d = Object.keys(b);
        if (c.length !== d.length) return false;
        for (d = 0; d < c.length; d++) {
          var e = c[d];
          if (!ja.call(b, e) || !He(a[e], b[e])) return false;
        }
        return true;
      }
      function Je(a) {
        for (; a && a.firstChild; ) a = a.firstChild;
        return a;
      }
      function Ke(a, b) {
        var c = Je(a);
        a = 0;
        for (var d; c; ) {
          if (3 === c.nodeType) {
            d = a + c.textContent.length;
            if (a <= b && d >= b) return { node: c, offset: b - a };
            a = d;
          }
          a: {
            for (; c; ) {
              if (c.nextSibling) {
                c = c.nextSibling;
                break a;
              }
              c = c.parentNode;
            }
            c = void 0;
          }
          c = Je(c);
        }
      }
      function Le(a, b) {
        return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
      }
      function Me() {
        for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
          try {
            var c = "string" === typeof b.contentWindow.location.href;
          } catch (d) {
            c = false;
          }
          if (c) a = b.contentWindow;
          else break;
          b = Xa(a.document);
        }
        return b;
      }
      function Ne(a) {
        var b = a && a.nodeName && a.nodeName.toLowerCase();
        return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
      }
      function Oe(a) {
        var b = Me(), c = a.focusedElem, d = a.selectionRange;
        if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
          if (null !== d && Ne(c)) {
            if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
            else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
              a = a.getSelection();
              var e = c.textContent.length, f = Math.min(d.start, e);
              d = void 0 === d.end ? f : Math.min(d.end, e);
              !a.extend && f > d && (e = d, d = f, f = e);
              e = Ke(c, f);
              var g = Ke(
                c,
                d
              );
              e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
            }
          }
          b = [];
          for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
          "function" === typeof c.focus && c.focus();
          for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
        }
      }
      var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
      var Qe = null;
      var Re = null;
      var Se = null;
      var Te = false;
      function Ue(a, b, c) {
        var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
        Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
      }
      function Ve(a, b) {
        var c = {};
        c[a.toLowerCase()] = b.toLowerCase();
        c["Webkit" + a] = "webkit" + b;
        c["Moz" + a] = "moz" + b;
        return c;
      }
      var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
      var Xe = {};
      var Ye = {};
      ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
      function Ze(a) {
        if (Xe[a]) return Xe[a];
        if (!We[a]) return a;
        var b = We[a], c;
        for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
        return a;
      }
      var $e = Ze("animationend");
      var af = Ze("animationiteration");
      var bf = Ze("animationstart");
      var cf = Ze("transitionend");
      var df = /* @__PURE__ */ new Map();
      var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
      function ff(a, b) {
        df.set(a, b);
        fa(b, [a]);
      }
      for (gf = 0; gf < ef.length; gf++) {
        hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
        ff(jf, "on" + kf);
      }
      var hf;
      var jf;
      var kf;
      var gf;
      ff($e, "onAnimationEnd");
      ff(af, "onAnimationIteration");
      ff(bf, "onAnimationStart");
      ff("dblclick", "onDoubleClick");
      ff("focusin", "onFocus");
      ff("focusout", "onBlur");
      ff(cf, "onTransitionEnd");
      ha("onMouseEnter", ["mouseout", "mouseover"]);
      ha("onMouseLeave", ["mouseout", "mouseover"]);
      ha("onPointerEnter", ["pointerout", "pointerover"]);
      ha("onPointerLeave", ["pointerout", "pointerover"]);
      fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
      fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
      fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
      fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
      var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
      var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
      function nf(a, b, c) {
        var d = a.type || "unknown-event";
        a.currentTarget = c;
        Ub(d, b, void 0, a);
        a.currentTarget = null;
      }
      function se(a, b) {
        b = 0 !== (b & 4);
        for (var c = 0; c < a.length; c++) {
          var d = a[c], e = d.event;
          d = d.listeners;
          a: {
            var f = void 0;
            if (b) for (var g = d.length - 1; 0 <= g; g--) {
              var h = d[g], k = h.instance, l = h.currentTarget;
              h = h.listener;
              if (k !== f && e.isPropagationStopped()) break a;
              nf(e, h, l);
              f = k;
            }
            else for (g = 0; g < d.length; g++) {
              h = d[g];
              k = h.instance;
              l = h.currentTarget;
              h = h.listener;
              if (k !== f && e.isPropagationStopped()) break a;
              nf(e, h, l);
              f = k;
            }
          }
        }
        if (Qb) throw a = Rb, Qb = false, Rb = null, a;
      }
      function D(a, b) {
        var c = b[of];
        void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
        var d = a + "__bubble";
        c.has(d) || (pf(b, a, 2, false), c.add(d));
      }
      function qf(a, b, c) {
        var d = 0;
        b && (d |= 4);
        pf(c, a, d, b);
      }
      var rf = "_reactListening" + Math.random().toString(36).slice(2);
      function sf(a) {
        if (!a[rf]) {
          a[rf] = true;
          da.forEach(function(b2) {
            "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
          });
          var b = 9 === a.nodeType ? a : a.ownerDocument;
          null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
        }
      }
      function pf(a, b, c, d) {
        switch (jd(b)) {
          case 1:
            var e = ed;
            break;
          case 4:
            e = gd;
            break;
          default:
            e = fd;
        }
        c = e.bind(null, b, c, a);
        e = void 0;
        !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
        d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
      }
      function hd(a, b, c, d, e) {
        var f = d;
        if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
          if (null === d) return;
          var g = d.tag;
          if (3 === g || 4 === g) {
            var h = d.stateNode.containerInfo;
            if (h === e || 8 === h.nodeType && h.parentNode === e) break;
            if (4 === g) for (g = d.return; null !== g; ) {
              var k = g.tag;
              if (3 === k || 4 === k) {
                if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
              }
              g = g.return;
            }
            for (; null !== h; ) {
              g = Wc(h);
              if (null === g) return;
              k = g.tag;
              if (5 === k || 6 === k) {
                d = f = g;
                continue a;
              }
              h = h.parentNode;
            }
          }
          d = d.return;
        }
        Jb(function() {
          var d2 = f, e2 = xb(c), g2 = [];
          a: {
            var h2 = df.get(a);
            if (void 0 !== h2) {
              var k2 = td, n = a;
              switch (a) {
                case "keypress":
                  if (0 === od(c)) break a;
                case "keydown":
                case "keyup":
                  k2 = Rd;
                  break;
                case "focusin":
                  n = "focus";
                  k2 = Fd;
                  break;
                case "focusout":
                  n = "blur";
                  k2 = Fd;
                  break;
                case "beforeblur":
                case "afterblur":
                  k2 = Fd;
                  break;
                case "click":
                  if (2 === c.button) break a;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                  k2 = Bd;
                  break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                  k2 = Dd;
                  break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                  k2 = Vd;
                  break;
                case $e:
                case af:
                case bf:
                  k2 = Hd;
                  break;
                case cf:
                  k2 = Xd;
                  break;
                case "scroll":
                  k2 = vd;
                  break;
                case "wheel":
                  k2 = Zd;
                  break;
                case "copy":
                case "cut":
                case "paste":
                  k2 = Jd;
                  break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                  k2 = Td;
              }
              var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
              t = [];
              for (var w = d2, u; null !== w; ) {
                u = w;
                var F = u.stateNode;
                5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
                if (J) break;
                w = w.return;
              }
              0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
            }
          }
          if (0 === (b & 7)) {
            a: {
              h2 = "mouseover" === a || "pointerover" === a;
              k2 = "mouseout" === a || "pointerout" === a;
              if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
              if (k2 || h2) {
                h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
                if (k2) {
                  if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
                } else k2 = null, n = d2;
                if (k2 !== n) {
                  t = Bd;
                  F = "onMouseLeave";
                  x = "onMouseEnter";
                  w = "mouse";
                  if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
                  J = null == k2 ? h2 : ue(k2);
                  u = null == n ? h2 : ue(n);
                  h2 = new t(F, w + "leave", k2, c, e2);
                  h2.target = J;
                  h2.relatedTarget = u;
                  F = null;
                  Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
                  J = F;
                  if (k2 && n) b: {
                    t = k2;
                    x = n;
                    w = 0;
                    for (u = t; u; u = vf(u)) w++;
                    u = 0;
                    for (F = x; F; F = vf(F)) u++;
                    for (; 0 < w - u; ) t = vf(t), w--;
                    for (; 0 < u - w; ) x = vf(x), u--;
                    for (; w--; ) {
                      if (t === x || null !== x && t === x.alternate) break b;
                      t = vf(t);
                      x = vf(x);
                    }
                    t = null;
                  }
                  else t = null;
                  null !== k2 && wf(g2, h2, k2, t, false);
                  null !== n && null !== J && wf(g2, J, n, t, true);
                }
              }
            }
            a: {
              h2 = d2 ? ue(d2) : window;
              k2 = h2.nodeName && h2.nodeName.toLowerCase();
              if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
              else if (me(h2)) if (we) na = Fe;
              else {
                na = De;
                var xa = Ce;
              }
              else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
              if (na && (na = na(a, d2))) {
                ne(g2, na, c, e2);
                break a;
              }
              xa && xa(a, h2, d2);
              "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
            }
            xa = d2 ? ue(d2) : window;
            switch (a) {
              case "focusin":
                if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
                break;
              case "focusout":
                Se = Re = Qe = null;
                break;
              case "mousedown":
                Te = true;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                Te = false;
                Ue(g2, c, e2);
                break;
              case "selectionchange":
                if (Pe) break;
              case "keydown":
              case "keyup":
                Ue(g2, c, e2);
            }
            var $a;
            if (ae) b: {
              switch (a) {
                case "compositionstart":
                  var ba = "onCompositionStart";
                  break b;
                case "compositionend":
                  ba = "onCompositionEnd";
                  break b;
                case "compositionupdate":
                  ba = "onCompositionUpdate";
                  break b;
              }
              ba = void 0;
            }
            else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
            ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
            if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
          }
          se(g2, b);
        });
      }
      function tf(a, b, c) {
        return { instance: a, listener: b, currentTarget: c };
      }
      function oe(a, b) {
        for (var c = b + "Capture", d = []; null !== a; ) {
          var e = a, f = e.stateNode;
          5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
          a = a.return;
        }
        return d;
      }
      function vf(a) {
        if (null === a) return null;
        do
          a = a.return;
        while (a && 5 !== a.tag);
        return a ? a : null;
      }
      function wf(a, b, c, d, e) {
        for (var f = b._reactName, g = []; null !== c && c !== d; ) {
          var h = c, k = h.alternate, l = h.stateNode;
          if (null !== k && k === d) break;
          5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
          c = c.return;
        }
        0 !== g.length && a.push({ event: b, listeners: g });
      }
      var xf = /\r\n?/g;
      var yf = /\u0000|\uFFFD/g;
      function zf(a) {
        return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
      }
      function Af(a, b, c) {
        b = zf(b);
        if (zf(a) !== b && c) throw Error(p(425));
      }
      function Bf() {
      }
      var Cf = null;
      var Df = null;
      function Ef(a, b) {
        return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
      }
      var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
      var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
      var Hf = "function" === typeof Promise ? Promise : void 0;
      var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
        return Hf.resolve(null).then(a).catch(If);
      } : Ff;
      function If(a) {
        setTimeout(function() {
          throw a;
        });
      }
      function Kf(a, b) {
        var c = b, d = 0;
        do {
          var e = c.nextSibling;
          a.removeChild(c);
          if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
            if (0 === d) {
              a.removeChild(e);
              bd(b);
              return;
            }
            d--;
          } else "$" !== c && "$?" !== c && "$!" !== c || d++;
          c = e;
        } while (c);
        bd(b);
      }
      function Lf(a) {
        for (; null != a; a = a.nextSibling) {
          var b = a.nodeType;
          if (1 === b || 3 === b) break;
          if (8 === b) {
            b = a.data;
            if ("$" === b || "$!" === b || "$?" === b) break;
            if ("/$" === b) return null;
          }
        }
        return a;
      }
      function Mf(a) {
        a = a.previousSibling;
        for (var b = 0; a; ) {
          if (8 === a.nodeType) {
            var c = a.data;
            if ("$" === c || "$!" === c || "$?" === c) {
              if (0 === b) return a;
              b--;
            } else "/$" === c && b++;
          }
          a = a.previousSibling;
        }
        return null;
      }
      var Nf = Math.random().toString(36).slice(2);
      var Of = "__reactFiber$" + Nf;
      var Pf = "__reactProps$" + Nf;
      var uf = "__reactContainer$" + Nf;
      var of = "__reactEvents$" + Nf;
      var Qf = "__reactListeners$" + Nf;
      var Rf = "__reactHandles$" + Nf;
      function Wc(a) {
        var b = a[Of];
        if (b) return b;
        for (var c = a.parentNode; c; ) {
          if (b = c[uf] || c[Of]) {
            c = b.alternate;
            if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
              if (c = a[Of]) return c;
              a = Mf(a);
            }
            return b;
          }
          a = c;
          c = a.parentNode;
        }
        return null;
      }
      function Cb(a) {
        a = a[Of] || a[uf];
        return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
      }
      function ue(a) {
        if (5 === a.tag || 6 === a.tag) return a.stateNode;
        throw Error(p(33));
      }
      function Db(a) {
        return a[Pf] || null;
      }
      var Sf = [];
      var Tf = -1;
      function Uf(a) {
        return { current: a };
      }
      function E(a) {
        0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
      }
      function G(a, b) {
        Tf++;
        Sf[Tf] = a.current;
        a.current = b;
      }
      var Vf = {};
      var H = Uf(Vf);
      var Wf = Uf(false);
      var Xf = Vf;
      function Yf(a, b) {
        var c = a.type.contextTypes;
        if (!c) return Vf;
        var d = a.stateNode;
        if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
        var e = {}, f;
        for (f in c) e[f] = b[f];
        d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
        return e;
      }
      function Zf(a) {
        a = a.childContextTypes;
        return null !== a && void 0 !== a;
      }
      function $f() {
        E(Wf);
        E(H);
      }
      function ag(a, b, c) {
        if (H.current !== Vf) throw Error(p(168));
        G(H, b);
        G(Wf, c);
      }
      function bg(a, b, c) {
        var d = a.stateNode;
        b = b.childContextTypes;
        if ("function" !== typeof d.getChildContext) return c;
        d = d.getChildContext();
        for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
        return A({}, c, d);
      }
      function cg(a) {
        a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
        Xf = H.current;
        G(H, a);
        G(Wf, Wf.current);
        return true;
      }
      function dg(a, b, c) {
        var d = a.stateNode;
        if (!d) throw Error(p(169));
        c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
        G(Wf, c);
      }
      var eg = null;
      var fg = false;
      var gg = false;
      function hg(a) {
        null === eg ? eg = [a] : eg.push(a);
      }
      function ig(a) {
        fg = true;
        hg(a);
      }
      function jg() {
        if (!gg && null !== eg) {
          gg = true;
          var a = 0, b = C;
          try {
            var c = eg;
            for (C = 1; a < c.length; a++) {
              var d = c[a];
              do
                d = d(true);
              while (null !== d);
            }
            eg = null;
            fg = false;
          } catch (e) {
            throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
          } finally {
            C = b, gg = false;
          }
        }
        return null;
      }
      var kg = [];
      var lg = 0;
      var mg = null;
      var ng = 0;
      var og = [];
      var pg = 0;
      var qg = null;
      var rg = 1;
      var sg = "";
      function tg(a, b) {
        kg[lg++] = ng;
        kg[lg++] = mg;
        mg = a;
        ng = b;
      }
      function ug(a, b, c) {
        og[pg++] = rg;
        og[pg++] = sg;
        og[pg++] = qg;
        qg = a;
        var d = rg;
        a = sg;
        var e = 32 - oc(d) - 1;
        d &= ~(1 << e);
        c += 1;
        var f = 32 - oc(b) + e;
        if (30 < f) {
          var g = e - e % 5;
          f = (d & (1 << g) - 1).toString(32);
          d >>= g;
          e -= g;
          rg = 1 << 32 - oc(b) + e | c << e | d;
          sg = f + a;
        } else rg = 1 << f | c << e | d, sg = a;
      }
      function vg(a) {
        null !== a.return && (tg(a, 1), ug(a, 1, 0));
      }
      function wg(a) {
        for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
        for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
      }
      var xg = null;
      var yg = null;
      var I = false;
      var zg = null;
      function Ag(a, b) {
        var c = Bg(5, null, null, 0);
        c.elementType = "DELETED";
        c.stateNode = b;
        c.return = a;
        b = a.deletions;
        null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
      }
      function Cg(a, b) {
        switch (a.tag) {
          case 5:
            var c = a.type;
            b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
            return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
          case 6:
            return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
          case 13:
            return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
          default:
            return false;
        }
      }
      function Dg(a) {
        return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
      }
      function Eg(a) {
        if (I) {
          var b = yg;
          if (b) {
            var c = b;
            if (!Cg(a, b)) {
              if (Dg(a)) throw Error(p(418));
              b = Lf(c.nextSibling);
              var d = xg;
              b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
            }
          } else {
            if (Dg(a)) throw Error(p(418));
            a.flags = a.flags & -4097 | 2;
            I = false;
            xg = a;
          }
        }
      }
      function Fg(a) {
        for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
        xg = a;
      }
      function Gg(a) {
        if (a !== xg) return false;
        if (!I) return Fg(a), I = true, false;
        var b;
        (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
        if (b && (b = yg)) {
          if (Dg(a)) throw Hg(), Error(p(418));
          for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
        }
        Fg(a);
        if (13 === a.tag) {
          a = a.memoizedState;
          a = null !== a ? a.dehydrated : null;
          if (!a) throw Error(p(317));
          a: {
            a = a.nextSibling;
            for (b = 0; a; ) {
              if (8 === a.nodeType) {
                var c = a.data;
                if ("/$" === c) {
                  if (0 === b) {
                    yg = Lf(a.nextSibling);
                    break a;
                  }
                  b--;
                } else "$" !== c && "$!" !== c && "$?" !== c || b++;
              }
              a = a.nextSibling;
            }
            yg = null;
          }
        } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
        return true;
      }
      function Hg() {
        for (var a = yg; a; ) a = Lf(a.nextSibling);
      }
      function Ig() {
        yg = xg = null;
        I = false;
      }
      function Jg(a) {
        null === zg ? zg = [a] : zg.push(a);
      }
      var Kg = ua.ReactCurrentBatchConfig;
      function Lg(a, b, c) {
        a = c.ref;
        if (null !== a && "function" !== typeof a && "object" !== typeof a) {
          if (c._owner) {
            c = c._owner;
            if (c) {
              if (1 !== c.tag) throw Error(p(309));
              var d = c.stateNode;
            }
            if (!d) throw Error(p(147, a));
            var e = d, f = "" + a;
            if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
            b = function(a2) {
              var b2 = e.refs;
              null === a2 ? delete b2[f] : b2[f] = a2;
            };
            b._stringRef = f;
            return b;
          }
          if ("string" !== typeof a) throw Error(p(284));
          if (!c._owner) throw Error(p(290, a));
        }
        return a;
      }
      function Mg(a, b) {
        a = Object.prototype.toString.call(b);
        throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
      }
      function Ng(a) {
        var b = a._init;
        return b(a._payload);
      }
      function Og(a) {
        function b(b2, c2) {
          if (a) {
            var d2 = b2.deletions;
            null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
          }
        }
        function c(c2, d2) {
          if (!a) return null;
          for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
          return null;
        }
        function d(a2, b2) {
          for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
          return a2;
        }
        function e(a2, b2) {
          a2 = Pg(a2, b2);
          a2.index = 0;
          a2.sibling = null;
          return a2;
        }
        function f(b2, c2, d2) {
          b2.index = d2;
          if (!a) return b2.flags |= 1048576, c2;
          d2 = b2.alternate;
          if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
          b2.flags |= 2;
          return c2;
        }
        function g(b2) {
          a && null === b2.alternate && (b2.flags |= 2);
          return b2;
        }
        function h(a2, b2, c2, d2) {
          if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
          b2 = e(b2, c2);
          b2.return = a2;
          return b2;
        }
        function k(a2, b2, c2, d2) {
          var f2 = c2.type;
          if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
          if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
          d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
          d2.ref = Lg(a2, b2, c2);
          d2.return = a2;
          return d2;
        }
        function l(a2, b2, c2, d2) {
          if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
          b2 = e(b2, c2.children || []);
          b2.return = a2;
          return b2;
        }
        function m(a2, b2, c2, d2, f2) {
          if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
          b2 = e(b2, c2);
          b2.return = a2;
          return b2;
        }
        function q(a2, b2, c2) {
          if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
          if ("object" === typeof b2 && null !== b2) {
            switch (b2.$$typeof) {
              case va:
                return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
              case wa:
                return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
              case Ha:
                var d2 = b2._init;
                return q(a2, d2(b2._payload), c2);
            }
            if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
            Mg(a2, b2);
          }
          return null;
        }
        function r(a2, b2, c2, d2) {
          var e2 = null !== b2 ? b2.key : null;
          if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
          if ("object" === typeof c2 && null !== c2) {
            switch (c2.$$typeof) {
              case va:
                return c2.key === e2 ? k(a2, b2, c2, d2) : null;
              case wa:
                return c2.key === e2 ? l(a2, b2, c2, d2) : null;
              case Ha:
                return e2 = c2._init, r(
                  a2,
                  b2,
                  e2(c2._payload),
                  d2
                );
            }
            if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
            Mg(a2, c2);
          }
          return null;
        }
        function y(a2, b2, c2, d2, e2) {
          if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
          if ("object" === typeof d2 && null !== d2) {
            switch (d2.$$typeof) {
              case va:
                return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
              case wa:
                return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
              case Ha:
                var f2 = d2._init;
                return y(a2, b2, c2, f2(d2._payload), e2);
            }
            if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
            Mg(b2, d2);
          }
          return null;
        }
        function n(e2, g2, h2, k2) {
          for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
            u.index > w ? (x = u, u = null) : x = u.sibling;
            var n2 = r(e2, u, h2[w], k2);
            if (null === n2) {
              null === u && (u = x);
              break;
            }
            a && u && null === n2.alternate && b(e2, u);
            g2 = f(n2, g2, w);
            null === m2 ? l2 = n2 : m2.sibling = n2;
            m2 = n2;
            u = x;
          }
          if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
          if (null === u) {
            for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
            I && tg(e2, w);
            return l2;
          }
          for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
          a && u.forEach(function(a2) {
            return b(e2, a2);
          });
          I && tg(e2, w);
          return l2;
        }
        function t(e2, g2, h2, k2) {
          var l2 = Ka(h2);
          if ("function" !== typeof l2) throw Error(p(150));
          h2 = l2.call(h2);
          if (null == h2) throw Error(p(151));
          for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
            m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
            var t2 = r(e2, m2, n2.value, k2);
            if (null === t2) {
              null === m2 && (m2 = x);
              break;
            }
            a && m2 && null === t2.alternate && b(e2, m2);
            g2 = f(t2, g2, w);
            null === u ? l2 = t2 : u.sibling = t2;
            u = t2;
            m2 = x;
          }
          if (n2.done) return c(
            e2,
            m2
          ), I && tg(e2, w), l2;
          if (null === m2) {
            for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
            I && tg(e2, w);
            return l2;
          }
          for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
          a && m2.forEach(function(a2) {
            return b(e2, a2);
          });
          I && tg(e2, w);
          return l2;
        }
        function J(a2, d2, f2, h2) {
          "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
          if ("object" === typeof f2 && null !== f2) {
            switch (f2.$$typeof) {
              case va:
                a: {
                  for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                    if (l2.key === k2) {
                      k2 = f2.type;
                      if (k2 === ya) {
                        if (7 === l2.tag) {
                          c(a2, l2.sibling);
                          d2 = e(l2, f2.props.children);
                          d2.return = a2;
                          a2 = d2;
                          break a;
                        }
                      } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                        c(a2, l2.sibling);
                        d2 = e(l2, f2.props);
                        d2.ref = Lg(a2, l2, f2);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                      c(a2, l2);
                      break;
                    } else b(a2, l2);
                    l2 = l2.sibling;
                  }
                  f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
                }
                return g(a2);
              case wa:
                a: {
                  for (l2 = f2.key; null !== d2; ) {
                    if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                      c(a2, d2.sibling);
                      d2 = e(d2, f2.children || []);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    } else {
                      c(a2, d2);
                      break;
                    }
                    else b(a2, d2);
                    d2 = d2.sibling;
                  }
                  d2 = Sg(f2, a2.mode, h2);
                  d2.return = a2;
                  a2 = d2;
                }
                return g(a2);
              case Ha:
                return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
            }
            if (eb(f2)) return n(a2, d2, f2, h2);
            if (Ka(f2)) return t(a2, d2, f2, h2);
            Mg(a2, f2);
          }
          return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
        }
        return J;
      }
      var Ug = Og(true);
      var Vg = Og(false);
      var Wg = Uf(null);
      var Xg = null;
      var Yg = null;
      var Zg = null;
      function $g() {
        Zg = Yg = Xg = null;
      }
      function ah(a) {
        var b = Wg.current;
        E(Wg);
        a._currentValue = b;
      }
      function bh(a, b, c) {
        for (; null !== a; ) {
          var d = a.alternate;
          (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
          if (a === c) break;
          a = a.return;
        }
      }
      function ch(a, b) {
        Xg = a;
        Zg = Yg = null;
        a = a.dependencies;
        null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
      }
      function eh(a) {
        var b = a._currentValue;
        if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
          if (null === Xg) throw Error(p(308));
          Yg = a;
          Xg.dependencies = { lanes: 0, firstContext: a };
        } else Yg = Yg.next = a;
        return b;
      }
      var fh = null;
      function gh(a) {
        null === fh ? fh = [a] : fh.push(a);
      }
      function hh(a, b, c, d) {
        var e = b.interleaved;
        null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
        b.interleaved = c;
        return ih(a, d);
      }
      function ih(a, b) {
        a.lanes |= b;
        var c = a.alternate;
        null !== c && (c.lanes |= b);
        c = a;
        for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
        return 3 === c.tag ? c.stateNode : null;
      }
      var jh = false;
      function kh(a) {
        a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
      }
      function lh(a, b) {
        a = a.updateQueue;
        b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
      }
      function mh(a, b) {
        return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
      }
      function nh(a, b, c) {
        var d = a.updateQueue;
        if (null === d) return null;
        d = d.shared;
        if (0 !== (K & 2)) {
          var e = d.pending;
          null === e ? b.next = b : (b.next = e.next, e.next = b);
          d.pending = b;
          return ih(a, c);
        }
        e = d.interleaved;
        null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
        d.interleaved = b;
        return ih(a, c);
      }
      function oh(a, b, c) {
        b = b.updateQueue;
        if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
          var d = b.lanes;
          d &= a.pendingLanes;
          c |= d;
          b.lanes = c;
          Cc(a, c);
        }
      }
      function ph(a, b) {
        var c = a.updateQueue, d = a.alternate;
        if (null !== d && (d = d.updateQueue, c === d)) {
          var e = null, f = null;
          c = c.firstBaseUpdate;
          if (null !== c) {
            do {
              var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
              null === f ? e = f = g : f = f.next = g;
              c = c.next;
            } while (null !== c);
            null === f ? e = f = b : f = f.next = b;
          } else e = f = b;
          c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
          a.updateQueue = c;
          return;
        }
        a = c.lastBaseUpdate;
        null === a ? c.firstBaseUpdate = b : a.next = b;
        c.lastBaseUpdate = b;
      }
      function qh(a, b, c, d) {
        var e = a.updateQueue;
        jh = false;
        var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
        if (null !== h) {
          e.shared.pending = null;
          var k = h, l = k.next;
          k.next = null;
          null === g ? f = l : g.next = l;
          g = k;
          var m = a.alternate;
          null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
        }
        if (null !== f) {
          var q = e.baseState;
          g = 0;
          m = l = k = null;
          h = f;
          do {
            var r = h.lane, y = h.eventTime;
            if ((d & r) === r) {
              null !== m && (m = m.next = {
                eventTime: y,
                lane: 0,
                tag: h.tag,
                payload: h.payload,
                callback: h.callback,
                next: null
              });
              a: {
                var n = a, t = h;
                r = b;
                y = c;
                switch (t.tag) {
                  case 1:
                    n = t.payload;
                    if ("function" === typeof n) {
                      q = n.call(y, q, r);
                      break a;
                    }
                    q = n;
                    break a;
                  case 3:
                    n.flags = n.flags & -65537 | 128;
                  case 0:
                    n = t.payload;
                    r = "function" === typeof n ? n.call(y, q, r) : n;
                    if (null === r || void 0 === r) break a;
                    q = A({}, q, r);
                    break a;
                  case 2:
                    jh = true;
                }
              }
              null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
            } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
            h = h.next;
            if (null === h) if (h = e.shared.pending, null === h) break;
            else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
          } while (1);
          null === m && (k = q);
          e.baseState = k;
          e.firstBaseUpdate = l;
          e.lastBaseUpdate = m;
          b = e.shared.interleaved;
          if (null !== b) {
            e = b;
            do
              g |= e.lane, e = e.next;
            while (e !== b);
          } else null === f && (e.shared.lanes = 0);
          rh |= g;
          a.lanes = g;
          a.memoizedState = q;
        }
      }
      function sh(a, b, c) {
        a = b.effects;
        b.effects = null;
        if (null !== a) for (b = 0; b < a.length; b++) {
          var d = a[b], e = d.callback;
          if (null !== e) {
            d.callback = null;
            d = c;
            if ("function" !== typeof e) throw Error(p(191, e));
            e.call(d);
          }
        }
      }
      var th = {};
      var uh = Uf(th);
      var vh = Uf(th);
      var wh = Uf(th);
      function xh(a) {
        if (a === th) throw Error(p(174));
        return a;
      }
      function yh(a, b) {
        G(wh, b);
        G(vh, a);
        G(uh, th);
        a = b.nodeType;
        switch (a) {
          case 9:
          case 11:
            b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
            break;
          default:
            a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
        }
        E(uh);
        G(uh, b);
      }
      function zh() {
        E(uh);
        E(vh);
        E(wh);
      }
      function Ah(a) {
        xh(wh.current);
        var b = xh(uh.current);
        var c = lb(b, a.type);
        b !== c && (G(vh, a), G(uh, c));
      }
      function Bh(a) {
        vh.current === a && (E(uh), E(vh));
      }
      var L = Uf(0);
      function Ch(a) {
        for (var b = a; null !== b; ) {
          if (13 === b.tag) {
            var c = b.memoizedState;
            if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
          } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
            if (0 !== (b.flags & 128)) return b;
          } else if (null !== b.child) {
            b.child.return = b;
            b = b.child;
            continue;
          }
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return null;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
        return null;
      }
      var Dh = [];
      function Eh() {
        for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
        Dh.length = 0;
      }
      var Fh = ua.ReactCurrentDispatcher;
      var Gh = ua.ReactCurrentBatchConfig;
      var Hh = 0;
      var M = null;
      var N = null;
      var O = null;
      var Ih = false;
      var Jh = false;
      var Kh = 0;
      var Lh = 0;
      function P() {
        throw Error(p(321));
      }
      function Mh(a, b) {
        if (null === b) return false;
        for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
        return true;
      }
      function Nh(a, b, c, d, e, f) {
        Hh = f;
        M = b;
        b.memoizedState = null;
        b.updateQueue = null;
        b.lanes = 0;
        Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
        a = c(d, e);
        if (Jh) {
          f = 0;
          do {
            Jh = false;
            Kh = 0;
            if (25 <= f) throw Error(p(301));
            f += 1;
            O = N = null;
            b.updateQueue = null;
            Fh.current = Qh;
            a = c(d, e);
          } while (Jh);
        }
        Fh.current = Rh;
        b = null !== N && null !== N.next;
        Hh = 0;
        O = N = M = null;
        Ih = false;
        if (b) throw Error(p(300));
        return a;
      }
      function Sh() {
        var a = 0 !== Kh;
        Kh = 0;
        return a;
      }
      function Th() {
        var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
        return O;
      }
      function Uh() {
        if (null === N) {
          var a = M.alternate;
          a = null !== a ? a.memoizedState : null;
        } else a = N.next;
        var b = null === O ? M.memoizedState : O.next;
        if (null !== b) O = b, N = a;
        else {
          if (null === a) throw Error(p(310));
          N = a;
          a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
          null === O ? M.memoizedState = O = a : O = O.next = a;
        }
        return O;
      }
      function Vh(a, b) {
        return "function" === typeof b ? b(a) : b;
      }
      function Wh(a) {
        var b = Uh(), c = b.queue;
        if (null === c) throw Error(p(311));
        c.lastRenderedReducer = a;
        var d = N, e = d.baseQueue, f = c.pending;
        if (null !== f) {
          if (null !== e) {
            var g = e.next;
            e.next = f.next;
            f.next = g;
          }
          d.baseQueue = e = f;
          c.pending = null;
        }
        if (null !== e) {
          f = e.next;
          d = d.baseState;
          var h = g = null, k = null, l = f;
          do {
            var m = l.lane;
            if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
            else {
              var q = {
                lane: m,
                action: l.action,
                hasEagerState: l.hasEagerState,
                eagerState: l.eagerState,
                next: null
              };
              null === k ? (h = k = q, g = d) : k = k.next = q;
              M.lanes |= m;
              rh |= m;
            }
            l = l.next;
          } while (null !== l && l !== f);
          null === k ? g = d : k.next = h;
          He(d, b.memoizedState) || (dh = true);
          b.memoizedState = d;
          b.baseState = g;
          b.baseQueue = k;
          c.lastRenderedState = d;
        }
        a = c.interleaved;
        if (null !== a) {
          e = a;
          do
            f = e.lane, M.lanes |= f, rh |= f, e = e.next;
          while (e !== a);
        } else null === e && (c.lanes = 0);
        return [b.memoizedState, c.dispatch];
      }
      function Xh(a) {
        var b = Uh(), c = b.queue;
        if (null === c) throw Error(p(311));
        c.lastRenderedReducer = a;
        var d = c.dispatch, e = c.pending, f = b.memoizedState;
        if (null !== e) {
          c.pending = null;
          var g = e = e.next;
          do
            f = a(f, g.action), g = g.next;
          while (g !== e);
          He(f, b.memoizedState) || (dh = true);
          b.memoizedState = f;
          null === b.baseQueue && (b.baseState = f);
          c.lastRenderedState = f;
        }
        return [f, d];
      }
      function Yh() {
      }
      function Zh(a, b) {
        var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
        f && (d.memoizedState = e, dh = true);
        d = d.queue;
        $h(ai.bind(null, c, d, a), [a]);
        if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
          c.flags |= 2048;
          bi(9, ci.bind(null, c, d, e, b), void 0, null);
          if (null === Q) throw Error(p(349));
          0 !== (Hh & 30) || di(c, b, e);
        }
        return e;
      }
      function di(a, b, c) {
        a.flags |= 16384;
        a = { getSnapshot: b, value: c };
        b = M.updateQueue;
        null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
      }
      function ci(a, b, c, d) {
        b.value = c;
        b.getSnapshot = d;
        ei(b) && fi(a);
      }
      function ai(a, b, c) {
        return c(function() {
          ei(b) && fi(a);
        });
      }
      function ei(a) {
        var b = a.getSnapshot;
        a = a.value;
        try {
          var c = b();
          return !He(a, c);
        } catch (d) {
          return true;
        }
      }
      function fi(a) {
        var b = ih(a, 1);
        null !== b && gi(b, a, 1, -1);
      }
      function hi(a) {
        var b = Th();
        "function" === typeof a && (a = a());
        b.memoizedState = b.baseState = a;
        a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
        b.queue = a;
        a = a.dispatch = ii.bind(null, M, a);
        return [b.memoizedState, a];
      }
      function bi(a, b, c, d) {
        a = { tag: a, create: b, destroy: c, deps: d, next: null };
        b = M.updateQueue;
        null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
        return a;
      }
      function ji() {
        return Uh().memoizedState;
      }
      function ki(a, b, c, d) {
        var e = Th();
        M.flags |= a;
        e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
      }
      function li(a, b, c, d) {
        var e = Uh();
        d = void 0 === d ? null : d;
        var f = void 0;
        if (null !== N) {
          var g = N.memoizedState;
          f = g.destroy;
          if (null !== d && Mh(d, g.deps)) {
            e.memoizedState = bi(b, c, f, d);
            return;
          }
        }
        M.flags |= a;
        e.memoizedState = bi(1 | b, c, f, d);
      }
      function mi(a, b) {
        return ki(8390656, 8, a, b);
      }
      function $h(a, b) {
        return li(2048, 8, a, b);
      }
      function ni(a, b) {
        return li(4, 2, a, b);
      }
      function oi(a, b) {
        return li(4, 4, a, b);
      }
      function pi(a, b) {
        if ("function" === typeof b) return a = a(), b(a), function() {
          b(null);
        };
        if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
          b.current = null;
        };
      }
      function qi(a, b, c) {
        c = null !== c && void 0 !== c ? c.concat([a]) : null;
        return li(4, 4, pi.bind(null, b, a), c);
      }
      function ri() {
      }
      function si(a, b) {
        var c = Uh();
        b = void 0 === b ? null : b;
        var d = c.memoizedState;
        if (null !== d && null !== b && Mh(b, d[1])) return d[0];
        c.memoizedState = [a, b];
        return a;
      }
      function ti(a, b) {
        var c = Uh();
        b = void 0 === b ? null : b;
        var d = c.memoizedState;
        if (null !== d && null !== b && Mh(b, d[1])) return d[0];
        a = a();
        c.memoizedState = [a, b];
        return a;
      }
      function ui(a, b, c) {
        if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
        He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
        return b;
      }
      function vi(a, b) {
        var c = C;
        C = 0 !== c && 4 > c ? c : 4;
        a(true);
        var d = Gh.transition;
        Gh.transition = {};
        try {
          a(false), b();
        } finally {
          C = c, Gh.transition = d;
        }
      }
      function wi() {
        return Uh().memoizedState;
      }
      function xi(a, b, c) {
        var d = yi(a);
        c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
        if (zi(a)) Ai(b, c);
        else if (c = hh(a, b, c, d), null !== c) {
          var e = R();
          gi(c, a, d, e);
          Bi(c, b, d);
        }
      }
      function ii(a, b, c) {
        var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
        if (zi(a)) Ai(b, e);
        else {
          var f = a.alternate;
          if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
            var g = b.lastRenderedState, h = f(g, c);
            e.hasEagerState = true;
            e.eagerState = h;
            if (He(h, g)) {
              var k = b.interleaved;
              null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
              b.interleaved = e;
              return;
            }
          } catch (l) {
          } finally {
          }
          c = hh(a, b, e, d);
          null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
        }
      }
      function zi(a) {
        var b = a.alternate;
        return a === M || null !== b && b === M;
      }
      function Ai(a, b) {
        Jh = Ih = true;
        var c = a.pending;
        null === c ? b.next = b : (b.next = c.next, c.next = b);
        a.pending = b;
      }
      function Bi(a, b, c) {
        if (0 !== (c & 4194240)) {
          var d = b.lanes;
          d &= a.pendingLanes;
          c |= d;
          b.lanes = c;
          Cc(a, c);
        }
      }
      var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false };
      var Oh = { readContext: eh, useCallback: function(a, b) {
        Th().memoizedState = [a, void 0 === b ? null : b];
        return a;
      }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
        c = null !== c && void 0 !== c ? c.concat([a]) : null;
        return ki(
          4194308,
          4,
          pi.bind(null, b, a),
          c
        );
      }, useLayoutEffect: function(a, b) {
        return ki(4194308, 4, a, b);
      }, useInsertionEffect: function(a, b) {
        return ki(4, 2, a, b);
      }, useMemo: function(a, b) {
        var c = Th();
        b = void 0 === b ? null : b;
        a = a();
        c.memoizedState = [a, b];
        return a;
      }, useReducer: function(a, b, c) {
        var d = Th();
        b = void 0 !== c ? c(b) : b;
        d.memoizedState = d.baseState = b;
        a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
        d.queue = a;
        a = a.dispatch = xi.bind(null, M, a);
        return [d.memoizedState, a];
      }, useRef: function(a) {
        var b = Th();
        a = { current: a };
        return b.memoizedState = a;
      }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
        return Th().memoizedState = a;
      }, useTransition: function() {
        var a = hi(false), b = a[0];
        a = vi.bind(null, a[1]);
        Th().memoizedState = a;
        return [b, a];
      }, useMutableSource: function() {
      }, useSyncExternalStore: function(a, b, c) {
        var d = M, e = Th();
        if (I) {
          if (void 0 === c) throw Error(p(407));
          c = c();
        } else {
          c = b();
          if (null === Q) throw Error(p(349));
          0 !== (Hh & 30) || di(d, b, c);
        }
        e.memoizedState = c;
        var f = { value: c, getSnapshot: b };
        e.queue = f;
        mi(ai.bind(
          null,
          d,
          f,
          a
        ), [a]);
        d.flags |= 2048;
        bi(9, ci.bind(null, d, f, c, b), void 0, null);
        return c;
      }, useId: function() {
        var a = Th(), b = Q.identifierPrefix;
        if (I) {
          var c = sg;
          var d = rg;
          c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
          b = ":" + b + "R" + c;
          c = Kh++;
          0 < c && (b += "H" + c.toString(32));
          b += ":";
        } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
        return a.memoizedState = b;
      }, unstable_isNewReconciler: false };
      var Ph = {
        readContext: eh,
        useCallback: si,
        useContext: eh,
        useEffect: $h,
        useImperativeHandle: qi,
        useInsertionEffect: ni,
        useLayoutEffect: oi,
        useMemo: ti,
        useReducer: Wh,
        useRef: ji,
        useState: function() {
          return Wh(Vh);
        },
        useDebugValue: ri,
        useDeferredValue: function(a) {
          var b = Uh();
          return ui(b, N.memoizedState, a);
        },
        useTransition: function() {
          var a = Wh(Vh)[0], b = Uh().memoizedState;
          return [a, b];
        },
        useMutableSource: Yh,
        useSyncExternalStore: Zh,
        useId: wi,
        unstable_isNewReconciler: false
      };
      var Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
        return Xh(Vh);
      }, useDebugValue: ri, useDeferredValue: function(a) {
        var b = Uh();
        return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
      }, useTransition: function() {
        var a = Xh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
      function Ci(a, b) {
        if (a && a.defaultProps) {
          b = A({}, b);
          a = a.defaultProps;
          for (var c in a) void 0 === b[c] && (b[c] = a[c]);
          return b;
        }
        return b;
      }
      function Di(a, b, c, d) {
        b = a.memoizedState;
        c = c(d, b);
        c = null === c || void 0 === c ? b : A({}, b, c);
        a.memoizedState = c;
        0 === a.lanes && (a.updateQueue.baseState = c);
      }
      var Ei = { isMounted: function(a) {
        return (a = a._reactInternals) ? Vb(a) === a : false;
      }, enqueueSetState: function(a, b, c) {
        a = a._reactInternals;
        var d = R(), e = yi(a), f = mh(d, e);
        f.payload = b;
        void 0 !== c && null !== c && (f.callback = c);
        b = nh(a, f, e);
        null !== b && (gi(b, a, e, d), oh(b, a, e));
      }, enqueueReplaceState: function(a, b, c) {
        a = a._reactInternals;
        var d = R(), e = yi(a), f = mh(d, e);
        f.tag = 1;
        f.payload = b;
        void 0 !== c && null !== c && (f.callback = c);
        b = nh(a, f, e);
        null !== b && (gi(b, a, e, d), oh(b, a, e));
      }, enqueueForceUpdate: function(a, b) {
        a = a._reactInternals;
        var c = R(), d = yi(a), e = mh(c, d);
        e.tag = 2;
        void 0 !== b && null !== b && (e.callback = b);
        b = nh(a, e, d);
        null !== b && (gi(b, a, d, c), oh(b, a, d));
      } };
      function Fi(a, b, c, d, e, f, g) {
        a = a.stateNode;
        return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
      }
      function Gi(a, b, c) {
        var d = false, e = Vf;
        var f = b.contextType;
        "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
        b = new b(c, f);
        a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
        b.updater = Ei;
        a.stateNode = b;
        b._reactInternals = a;
        d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
        return b;
      }
      function Hi(a, b, c, d) {
        a = b.state;
        "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
        "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
        b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
      }
      function Ii(a, b, c, d) {
        var e = a.stateNode;
        e.props = c;
        e.state = a.memoizedState;
        e.refs = {};
        kh(a);
        var f = b.contextType;
        "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
        e.state = a.memoizedState;
        f = b.getDerivedStateFromProps;
        "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
        "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
        "function" === typeof e.componentDidMount && (a.flags |= 4194308);
      }
      function Ji(a, b) {
        try {
          var c = "", d = b;
          do
            c += Pa(d), d = d.return;
          while (d);
          var e = c;
        } catch (f) {
          e = "\nError generating stack: " + f.message + "\n" + f.stack;
        }
        return { value: a, source: b, stack: e, digest: null };
      }
      function Ki(a, b, c) {
        return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
      }
      function Li(a, b) {
        try {
          console.error(b.value);
        } catch (c) {
          setTimeout(function() {
            throw c;
          });
        }
      }
      var Mi = "function" === typeof WeakMap ? WeakMap : Map;
      function Ni(a, b, c) {
        c = mh(-1, c);
        c.tag = 3;
        c.payload = { element: null };
        var d = b.value;
        c.callback = function() {
          Oi || (Oi = true, Pi = d);
          Li(a, b);
        };
        return c;
      }
      function Qi(a, b, c) {
        c = mh(-1, c);
        c.tag = 3;
        var d = a.type.getDerivedStateFromError;
        if ("function" === typeof d) {
          var e = b.value;
          c.payload = function() {
            return d(e);
          };
          c.callback = function() {
            Li(a, b);
          };
        }
        var f = a.stateNode;
        null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
          Li(a, b);
          "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
          var c2 = b.stack;
          this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
        });
        return c;
      }
      function Si(a, b, c) {
        var d = a.pingCache;
        if (null === d) {
          d = a.pingCache = new Mi();
          var e = /* @__PURE__ */ new Set();
          d.set(b, e);
        } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
        e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
      }
      function Ui(a) {
        do {
          var b;
          if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
          if (b) return a;
          a = a.return;
        } while (null !== a);
        return null;
      }
      function Vi(a, b, c, d, e) {
        if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
        a.flags |= 65536;
        a.lanes = e;
        return a;
      }
      var Wi = ua.ReactCurrentOwner;
      var dh = false;
      function Xi(a, b, c, d) {
        b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
      }
      function Yi(a, b, c, d, e) {
        c = c.render;
        var f = b.ref;
        ch(b, e);
        d = Nh(a, b, c, d, f, e);
        c = Sh();
        if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
        I && c && vg(b);
        b.flags |= 1;
        Xi(a, b, d, e);
        return b.child;
      }
      function $i(a, b, c, d, e) {
        if (null === a) {
          var f = c.type;
          if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
          a = Rg(c.type, null, d, b, b.mode, e);
          a.ref = b.ref;
          a.return = b;
          return b.child = a;
        }
        f = a.child;
        if (0 === (a.lanes & e)) {
          var g = f.memoizedProps;
          c = c.compare;
          c = null !== c ? c : Ie;
          if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
        }
        b.flags |= 1;
        a = Pg(f, d);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      function bj(a, b, c, d, e) {
        if (null !== a) {
          var f = a.memoizedProps;
          if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
          else return b.lanes = a.lanes, Zi(a, b, e);
        }
        return cj(a, b, c, d, e);
      }
      function dj(a, b, c) {
        var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
        if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
        else {
          if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
          b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
          d = null !== f ? f.baseLanes : c;
          G(ej, fj);
          fj |= d;
        }
        else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
        Xi(a, b, e, c);
        return b.child;
      }
      function gj(a, b) {
        var c = b.ref;
        if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
      }
      function cj(a, b, c, d, e) {
        var f = Zf(c) ? Xf : H.current;
        f = Yf(b, f);
        ch(b, e);
        c = Nh(a, b, c, d, f, e);
        d = Sh();
        if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
        I && d && vg(b);
        b.flags |= 1;
        Xi(a, b, c, e);
        return b.child;
      }
      function hj(a, b, c, d, e) {
        if (Zf(c)) {
          var f = true;
          cg(b);
        } else f = false;
        ch(b, e);
        if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
        else if (null === a) {
          var g = b.stateNode, h = b.memoizedProps;
          g.props = h;
          var k = g.context, l = c.contextType;
          "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
          var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
          q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
          jh = false;
          var r = b.memoizedState;
          g.state = r;
          qh(b, d, g, e);
          k = b.memoizedState;
          h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
        } else {
          g = b.stateNode;
          lh(a, b);
          h = b.memoizedProps;
          l = b.type === b.elementType ? h : Ci(b.type, h);
          g.props = l;
          q = b.pendingProps;
          r = g.context;
          k = c.contextType;
          "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
          var y = c.getDerivedStateFromProps;
          (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
          jh = false;
          r = b.memoizedState;
          g.state = r;
          qh(b, d, g, e);
          var n = b.memoizedState;
          h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
        }
        return jj(a, b, c, d, f, e);
      }
      function jj(a, b, c, d, e, f) {
        gj(a, b);
        var g = 0 !== (b.flags & 128);
        if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
        d = b.stateNode;
        Wi.current = b;
        var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
        b.flags |= 1;
        null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
        b.memoizedState = d.state;
        e && dg(b, c, true);
        return b.child;
      }
      function kj(a) {
        var b = a.stateNode;
        b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
        yh(a, b.containerInfo);
      }
      function lj(a, b, c, d, e) {
        Ig();
        Jg(e);
        b.flags |= 256;
        Xi(a, b, c, d);
        return b.child;
      }
      var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
      function nj(a) {
        return { baseLanes: a, cachePool: null, transitions: null };
      }
      function oj(a, b, c) {
        var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
        (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
        if (h) f = true, b.flags &= -129;
        else if (null === a || null !== a.memoizedState) e |= 1;
        G(L, e & 1);
        if (null === a) {
          Eg(b);
          a = b.memoizedState;
          if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
          g = d.children;
          a = d.fallback;
          return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
        }
        e = a.memoizedState;
        if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
        if (f) {
          f = d.fallback;
          g = b.mode;
          e = a.child;
          h = e.sibling;
          var k = { mode: "hidden", children: d.children };
          0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
          null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
          f.return = b;
          d.return = b;
          d.sibling = f;
          b.child = d;
          d = f;
          f = b.child;
          g = a.child.memoizedState;
          g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
          f.memoizedState = g;
          f.childLanes = a.childLanes & ~c;
          b.memoizedState = mj;
          return d;
        }
        f = a.child;
        a = f.sibling;
        d = Pg(f, { mode: "visible", children: d.children });
        0 === (b.mode & 1) && (d.lanes = c);
        d.return = b;
        d.sibling = null;
        null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
        b.child = d;
        b.memoizedState = null;
        return d;
      }
      function qj(a, b) {
        b = pj({ mode: "visible", children: b }, a.mode, 0, null);
        b.return = a;
        return a.child = b;
      }
      function sj(a, b, c, d) {
        null !== d && Jg(d);
        Ug(b, a.child, null, c);
        a = qj(b, b.pendingProps.children);
        a.flags |= 2;
        b.memoizedState = null;
        return a;
      }
      function rj(a, b, c, d, e, f, g) {
        if (c) {
          if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
          if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
          f = d.fallback;
          e = b.mode;
          d = pj({ mode: "visible", children: d.children }, e, 0, null);
          f = Tg(f, e, g, null);
          f.flags |= 2;
          d.return = b;
          f.return = b;
          d.sibling = f;
          b.child = d;
          0 !== (b.mode & 1) && Ug(b, a.child, null, g);
          b.child.memoizedState = nj(g);
          b.memoizedState = mj;
          return f;
        }
        if (0 === (b.mode & 1)) return sj(a, b, g, null);
        if ("$!" === e.data) {
          d = e.nextSibling && e.nextSibling.dataset;
          if (d) var h = d.dgst;
          d = h;
          f = Error(p(419));
          d = Ki(f, d, void 0);
          return sj(a, b, g, d);
        }
        h = 0 !== (g & a.childLanes);
        if (dh || h) {
          d = Q;
          if (null !== d) {
            switch (g & -g) {
              case 4:
                e = 2;
                break;
              case 16:
                e = 8;
                break;
              case 64:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
              case 67108864:
                e = 32;
                break;
              case 536870912:
                e = 268435456;
                break;
              default:
                e = 0;
            }
            e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
            0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
          }
          tj();
          d = Ki(Error(p(421)));
          return sj(a, b, g, d);
        }
        if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
        a = f.treeContext;
        yg = Lf(e.nextSibling);
        xg = b;
        I = true;
        zg = null;
        null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
        b = qj(b, d.children);
        b.flags |= 4096;
        return b;
      }
      function vj(a, b, c) {
        a.lanes |= b;
        var d = a.alternate;
        null !== d && (d.lanes |= b);
        bh(a.return, b, c);
      }
      function wj(a, b, c, d, e) {
        var f = a.memoizedState;
        null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
      }
      function xj(a, b, c) {
        var d = b.pendingProps, e = d.revealOrder, f = d.tail;
        Xi(a, b, d.children, c);
        d = L.current;
        if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
        else {
          if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
            if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
            else if (19 === a.tag) vj(a, c, b);
            else if (null !== a.child) {
              a.child.return = a;
              a = a.child;
              continue;
            }
            if (a === b) break a;
            for (; null === a.sibling; ) {
              if (null === a.return || a.return === b) break a;
              a = a.return;
            }
            a.sibling.return = a.return;
            a = a.sibling;
          }
          d &= 1;
        }
        G(L, d);
        if (0 === (b.mode & 1)) b.memoizedState = null;
        else switch (e) {
          case "forwards":
            c = b.child;
            for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
            c = e;
            null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
            wj(b, false, e, c, f);
            break;
          case "backwards":
            c = null;
            e = b.child;
            for (b.child = null; null !== e; ) {
              a = e.alternate;
              if (null !== a && null === Ch(a)) {
                b.child = e;
                break;
              }
              a = e.sibling;
              e.sibling = c;
              c = e;
              e = a;
            }
            wj(b, true, c, null, f);
            break;
          case "together":
            wj(b, false, null, null, void 0);
            break;
          default:
            b.memoizedState = null;
        }
        return b.child;
      }
      function ij(a, b) {
        0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
      }
      function Zi(a, b, c) {
        null !== a && (b.dependencies = a.dependencies);
        rh |= b.lanes;
        if (0 === (c & b.childLanes)) return null;
        if (null !== a && b.child !== a.child) throw Error(p(153));
        if (null !== b.child) {
          a = b.child;
          c = Pg(a, a.pendingProps);
          b.child = c;
          for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
          c.sibling = null;
        }
        return b.child;
      }
      function yj(a, b, c) {
        switch (b.tag) {
          case 3:
            kj(b);
            Ig();
            break;
          case 5:
            Ah(b);
            break;
          case 1:
            Zf(b.type) && cg(b);
            break;
          case 4:
            yh(b, b.stateNode.containerInfo);
            break;
          case 10:
            var d = b.type._context, e = b.memoizedProps.value;
            G(Wg, d._currentValue);
            d._currentValue = e;
            break;
          case 13:
            d = b.memoizedState;
            if (null !== d) {
              if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
              if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
              G(L, L.current & 1);
              a = Zi(a, b, c);
              return null !== a ? a.sibling : null;
            }
            G(L, L.current & 1);
            break;
          case 19:
            d = 0 !== (c & b.childLanes);
            if (0 !== (a.flags & 128)) {
              if (d) return xj(a, b, c);
              b.flags |= 128;
            }
            e = b.memoizedState;
            null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
            G(L, L.current);
            if (d) break;
            else return null;
          case 22:
          case 23:
            return b.lanes = 0, dj(a, b, c);
        }
        return Zi(a, b, c);
      }
      var zj;
      var Aj;
      var Bj;
      var Cj;
      zj = function(a, b) {
        for (var c = b.child; null !== c; ) {
          if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
          else if (4 !== c.tag && null !== c.child) {
            c.child.return = c;
            c = c.child;
            continue;
          }
          if (c === b) break;
          for (; null === c.sibling; ) {
            if (null === c.return || c.return === b) return;
            c = c.return;
          }
          c.sibling.return = c.return;
          c = c.sibling;
        }
      };
      Aj = function() {
      };
      Bj = function(a, b, c, d) {
        var e = a.memoizedProps;
        if (e !== d) {
          a = b.stateNode;
          xh(uh.current);
          var f = null;
          switch (c) {
            case "input":
              e = Ya(a, e);
              d = Ya(a, d);
              f = [];
              break;
            case "select":
              e = A({}, e, { value: void 0 });
              d = A({}, d, { value: void 0 });
              f = [];
              break;
            case "textarea":
              e = gb(a, e);
              d = gb(a, d);
              f = [];
              break;
            default:
              "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
          }
          ub(c, d);
          var g;
          c = null;
          for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
            var h = e[l];
            for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
          } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
          for (l in d) {
            var k = d[l];
            h = null != e ? e[l] : void 0;
            if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
              for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
              for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
            } else c || (f || (f = []), f.push(
              l,
              c
            )), c = k;
            else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
          }
          c && (f = f || []).push("style", c);
          var l = f;
          if (b.updateQueue = l) b.flags |= 4;
        }
      };
      Cj = function(a, b, c, d) {
        c !== d && (b.flags |= 4);
      };
      function Dj(a, b) {
        if (!I) switch (a.tailMode) {
          case "hidden":
            b = a.tail;
            for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
            null === c ? a.tail = null : c.sibling = null;
            break;
          case "collapsed":
            c = a.tail;
            for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
            null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
        }
      }
      function S(a) {
        var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
        if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
        else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
        a.subtreeFlags |= d;
        a.childLanes = c;
        return b;
      }
      function Ej(a, b, c) {
        var d = b.pendingProps;
        wg(b);
        switch (b.tag) {
          case 2:
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
            return S(b), null;
          case 1:
            return Zf(b.type) && $f(), S(b), null;
          case 3:
            d = b.stateNode;
            zh();
            E(Wf);
            E(H);
            Eh();
            d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
            if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
            Aj(a, b);
            S(b);
            return null;
          case 5:
            Bh(b);
            var e = xh(wh.current);
            c = b.type;
            if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
            else {
              if (!d) {
                if (null === b.stateNode) throw Error(p(166));
                S(b);
                return null;
              }
              a = xh(uh.current);
              if (Gg(b)) {
                d = b.stateNode;
                c = b.type;
                var f = b.memoizedProps;
                d[Of] = b;
                d[Pf] = f;
                a = 0 !== (b.mode & 1);
                switch (c) {
                  case "dialog":
                    D("cancel", d);
                    D("close", d);
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", d);
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], d);
                    break;
                  case "source":
                    D("error", d);
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      d
                    );
                    D("load", d);
                    break;
                  case "details":
                    D("toggle", d);
                    break;
                  case "input":
                    Za(d, f);
                    D("invalid", d);
                    break;
                  case "select":
                    d._wrapperState = { wasMultiple: !!f.multiple };
                    D("invalid", d);
                    break;
                  case "textarea":
                    hb(d, f), D("invalid", d);
                }
                ub(c, f);
                e = null;
                for (var g in f) if (f.hasOwnProperty(g)) {
                  var h = f[g];
                  "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                    d.textContent,
                    h,
                    a
                  ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
                }
                switch (c) {
                  case "input":
                    Va(d);
                    db(d, f, true);
                    break;
                  case "textarea":
                    Va(d);
                    jb(d);
                    break;
                  case "select":
                  case "option":
                    break;
                  default:
                    "function" === typeof f.onClick && (d.onclick = Bf);
                }
                d = e;
                b.updateQueue = d;
                null !== d && (b.flags |= 4);
              } else {
                g = 9 === e.nodeType ? e : e.ownerDocument;
                "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
                "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
                a[Of] = b;
                a[Pf] = d;
                zj(a, b, false, false);
                b.stateNode = a;
                a: {
                  g = vb(c, d);
                  switch (c) {
                    case "dialog":
                      D("cancel", a);
                      D("close", a);
                      e = d;
                      break;
                    case "iframe":
                    case "object":
                    case "embed":
                      D("load", a);
                      e = d;
                      break;
                    case "video":
                    case "audio":
                      for (e = 0; e < lf.length; e++) D(lf[e], a);
                      e = d;
                      break;
                    case "source":
                      D("error", a);
                      e = d;
                      break;
                    case "img":
                    case "image":
                    case "link":
                      D(
                        "error",
                        a
                      );
                      D("load", a);
                      e = d;
                      break;
                    case "details":
                      D("toggle", a);
                      e = d;
                      break;
                    case "input":
                      Za(a, d);
                      e = Ya(a, d);
                      D("invalid", a);
                      break;
                    case "option":
                      e = d;
                      break;
                    case "select":
                      a._wrapperState = { wasMultiple: !!d.multiple };
                      e = A({}, d, { value: void 0 });
                      D("invalid", a);
                      break;
                    case "textarea":
                      hb(a, d);
                      e = gb(a, d);
                      D("invalid", a);
                      break;
                    default:
                      e = d;
                  }
                  ub(c, e);
                  h = e;
                  for (f in h) if (h.hasOwnProperty(f)) {
                    var k = h[f];
                    "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
                  }
                  switch (c) {
                    case "input":
                      Va(a);
                      db(a, d, false);
                      break;
                    case "textarea":
                      Va(a);
                      jb(a);
                      break;
                    case "option":
                      null != d.value && a.setAttribute("value", "" + Sa(d.value));
                      break;
                    case "select":
                      a.multiple = !!d.multiple;
                      f = d.value;
                      null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                        a,
                        !!d.multiple,
                        d.defaultValue,
                        true
                      );
                      break;
                    default:
                      "function" === typeof e.onClick && (a.onclick = Bf);
                  }
                  switch (c) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      d = !!d.autoFocus;
                      break a;
                    case "img":
                      d = true;
                      break a;
                    default:
                      d = false;
                  }
                }
                d && (b.flags |= 4);
              }
              null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
            }
            S(b);
            return null;
          case 6:
            if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
            else {
              if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
              c = xh(wh.current);
              xh(uh.current);
              if (Gg(b)) {
                d = b.stateNode;
                c = b.memoizedProps;
                d[Of] = b;
                if (f = d.nodeValue !== c) {
                  if (a = xg, null !== a) switch (a.tag) {
                    case 3:
                      Af(d.nodeValue, c, 0 !== (a.mode & 1));
                      break;
                    case 5:
                      true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  }
                }
                f && (b.flags |= 4);
              } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
            }
            S(b);
            return null;
          case 13:
            E(L);
            d = b.memoizedState;
            if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
              if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
              else if (f = Gg(b), null !== d && null !== d.dehydrated) {
                if (null === a) {
                  if (!f) throw Error(p(318));
                  f = b.memoizedState;
                  f = null !== f ? f.dehydrated : null;
                  if (!f) throw Error(p(317));
                  f[Of] = b;
                } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
                S(b);
                f = false;
              } else null !== zg && (Fj(zg), zg = null), f = true;
              if (!f) return b.flags & 65536 ? b : null;
            }
            if (0 !== (b.flags & 128)) return b.lanes = c, b;
            d = null !== d;
            d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
            null !== b.updateQueue && (b.flags |= 4);
            S(b);
            return null;
          case 4:
            return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
          case 10:
            return ah(b.type._context), S(b), null;
          case 17:
            return Zf(b.type) && $f(), S(b), null;
          case 19:
            E(L);
            f = b.memoizedState;
            if (null === f) return S(b), null;
            d = 0 !== (b.flags & 128);
            g = f.rendering;
            if (null === g) if (d) Dj(f, false);
            else {
              if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
                g = Ch(a);
                if (null !== g) {
                  b.flags |= 128;
                  Dj(f, false);
                  d = g.updateQueue;
                  null !== d && (b.updateQueue = d, b.flags |= 4);
                  b.subtreeFlags = 0;
                  d = c;
                  for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                  G(L, L.current & 1 | 2);
                  return b.child;
                }
                a = a.sibling;
              }
              null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
            }
            else {
              if (!d) if (a = Ch(g), null !== a) {
                if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
              } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
              f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
            }
            if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
            S(b);
            return null;
          case 22:
          case 23:
            return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
          case 24:
            return null;
          case 25:
            return null;
        }
        throw Error(p(156, b.tag));
      }
      function Ij(a, b) {
        wg(b);
        switch (b.tag) {
          case 1:
            return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
          case 3:
            return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
          case 5:
            return Bh(b), null;
          case 13:
            E(L);
            a = b.memoizedState;
            if (null !== a && null !== a.dehydrated) {
              if (null === b.alternate) throw Error(p(340));
              Ig();
            }
            a = b.flags;
            return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
          case 19:
            return E(L), null;
          case 4:
            return zh(), null;
          case 10:
            return ah(b.type._context), null;
          case 22:
          case 23:
            return Hj(), null;
          case 24:
            return null;
          default:
            return null;
        }
      }
      var Jj = false;
      var U = false;
      var Kj = "function" === typeof WeakSet ? WeakSet : Set;
      var V = null;
      function Lj(a, b) {
        var c = a.ref;
        if (null !== c) if ("function" === typeof c) try {
          c(null);
        } catch (d) {
          W(a, b, d);
        }
        else c.current = null;
      }
      function Mj(a, b, c) {
        try {
          c();
        } catch (d) {
          W(a, b, d);
        }
      }
      var Nj = false;
      function Oj(a, b) {
        Cf = dd;
        a = Me();
        if (Ne(a)) {
          if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
          else a: {
            c = (c = a.ownerDocument) && c.defaultView || window;
            var d = c.getSelection && c.getSelection();
            if (d && 0 !== d.rangeCount) {
              c = d.anchorNode;
              var e = d.anchorOffset, f = d.focusNode;
              d = d.focusOffset;
              try {
                c.nodeType, f.nodeType;
              } catch (F) {
                c = null;
                break a;
              }
              var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
              b: for (; ; ) {
                for (var y; ; ) {
                  q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
                  q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
                  3 === q.nodeType && (g += q.nodeValue.length);
                  if (null === (y = q.firstChild)) break;
                  r = q;
                  q = y;
                }
                for (; ; ) {
                  if (q === a) break b;
                  r === c && ++l === e && (h = g);
                  r === f && ++m === d && (k = g);
                  if (null !== (y = q.nextSibling)) break;
                  q = r;
                  r = q.parentNode;
                }
                q = y;
              }
              c = -1 === h || -1 === k ? null : { start: h, end: k };
            } else c = null;
          }
          c = c || { start: 0, end: 0 };
        } else c = null;
        Df = { focusedElem: a, selectionRange: c };
        dd = false;
        for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
        else for (; null !== V; ) {
          b = V;
          try {
            var n = b.alternate;
            if (0 !== (b.flags & 1024)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n) {
                  var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
                  x.__reactInternalSnapshotBeforeUpdate = w;
                }
                break;
              case 3:
                var u = b.stateNode.containerInfo;
                1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p(163));
            }
          } catch (F) {
            W(b, b.return, F);
          }
          a = b.sibling;
          if (null !== a) {
            a.return = b.return;
            V = a;
            break;
          }
          V = b.return;
        }
        n = Nj;
        Nj = false;
        return n;
      }
      function Pj(a, b, c) {
        var d = b.updateQueue;
        d = null !== d ? d.lastEffect : null;
        if (null !== d) {
          var e = d = d.next;
          do {
            if ((e.tag & a) === a) {
              var f = e.destroy;
              e.destroy = void 0;
              void 0 !== f && Mj(b, c, f);
            }
            e = e.next;
          } while (e !== d);
        }
      }
      function Qj(a, b) {
        b = b.updateQueue;
        b = null !== b ? b.lastEffect : null;
        if (null !== b) {
          var c = b = b.next;
          do {
            if ((c.tag & a) === a) {
              var d = c.create;
              c.destroy = d();
            }
            c = c.next;
          } while (c !== b);
        }
      }
      function Rj(a) {
        var b = a.ref;
        if (null !== b) {
          var c = a.stateNode;
          switch (a.tag) {
            case 5:
              a = c;
              break;
            default:
              a = c;
          }
          "function" === typeof b ? b(a) : b.current = a;
        }
      }
      function Sj(a) {
        var b = a.alternate;
        null !== b && (a.alternate = null, Sj(b));
        a.child = null;
        a.deletions = null;
        a.sibling = null;
        5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
        a.stateNode = null;
        a.return = null;
        a.dependencies = null;
        a.memoizedProps = null;
        a.memoizedState = null;
        a.pendingProps = null;
        a.stateNode = null;
        a.updateQueue = null;
      }
      function Tj(a) {
        return 5 === a.tag || 3 === a.tag || 4 === a.tag;
      }
      function Uj(a) {
        a: for (; ; ) {
          for (; null === a.sibling; ) {
            if (null === a.return || Tj(a.return)) return null;
            a = a.return;
          }
          a.sibling.return = a.return;
          for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
            if (a.flags & 2) continue a;
            if (null === a.child || 4 === a.tag) continue a;
            else a.child.return = a, a = a.child;
          }
          if (!(a.flags & 2)) return a.stateNode;
        }
      }
      function Vj(a, b, c) {
        var d = a.tag;
        if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
        else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
      }
      function Wj(a, b, c) {
        var d = a.tag;
        if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
        else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
      }
      var X2 = null;
      var Xj = false;
      function Yj(a, b, c) {
        for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
      }
      function Zj(a, b, c) {
        if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
          lc.onCommitFiberUnmount(kc, c);
        } catch (h) {
        }
        switch (c.tag) {
          case 5:
            U || Lj(c, b);
          case 6:
            var d = X2, e = Xj;
            X2 = null;
            Yj(a, b, c);
            X2 = d;
            Xj = e;
            null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X2.removeChild(c.stateNode));
            break;
          case 18:
            null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X2, c.stateNode));
            break;
          case 4:
            d = X2;
            e = Xj;
            X2 = c.stateNode.containerInfo;
            Xj = true;
            Yj(a, b, c);
            X2 = d;
            Xj = e;
            break;
          case 0:
          case 11:
          case 14:
          case 15:
            if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
              e = d = d.next;
              do {
                var f = e, g = f.destroy;
                f = f.tag;
                void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
                e = e.next;
              } while (e !== d);
            }
            Yj(a, b, c);
            break;
          case 1:
            if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
              d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
            } catch (h) {
              W(c, b, h);
            }
            Yj(a, b, c);
            break;
          case 21:
            Yj(a, b, c);
            break;
          case 22:
            c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
            break;
          default:
            Yj(a, b, c);
        }
      }
      function ak(a) {
        var b = a.updateQueue;
        if (null !== b) {
          a.updateQueue = null;
          var c = a.stateNode;
          null === c && (c = a.stateNode = new Kj());
          b.forEach(function(b2) {
            var d = bk.bind(null, a, b2);
            c.has(b2) || (c.add(b2), b2.then(d, d));
          });
        }
      }
      function ck(a, b) {
        var c = b.deletions;
        if (null !== c) for (var d = 0; d < c.length; d++) {
          var e = c[d];
          try {
            var f = a, g = b, h = g;
            a: for (; null !== h; ) {
              switch (h.tag) {
                case 5:
                  X2 = h.stateNode;
                  Xj = false;
                  break a;
                case 3:
                  X2 = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
                case 4:
                  X2 = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
              }
              h = h.return;
            }
            if (null === X2) throw Error(p(160));
            Zj(f, g, e);
            X2 = null;
            Xj = false;
            var k = e.alternate;
            null !== k && (k.return = null);
            e.return = null;
          } catch (l) {
            W(e, b, l);
          }
        }
        if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
      }
      function dk(a, b) {
        var c = a.alternate, d = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            ck(b, a);
            ek(a);
            if (d & 4) {
              try {
                Pj(3, a, a.return), Qj(3, a);
              } catch (t) {
                W(a, a.return, t);
              }
              try {
                Pj(5, a, a.return);
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 1:
            ck(b, a);
            ek(a);
            d & 512 && null !== c && Lj(c, c.return);
            break;
          case 5:
            ck(b, a);
            ek(a);
            d & 512 && null !== c && Lj(c, c.return);
            if (a.flags & 32) {
              var e = a.stateNode;
              try {
                ob(e, "");
              } catch (t) {
                W(a, a.return, t);
              }
            }
            if (d & 4 && (e = a.stateNode, null != e)) {
              var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
              a.updateQueue = null;
              if (null !== k) try {
                "input" === h && "radio" === f.type && null != f.name && ab(e, f);
                vb(h, g);
                var l = vb(h, f);
                for (g = 0; g < k.length; g += 2) {
                  var m = k[g], q = k[g + 1];
                  "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
                }
                switch (h) {
                  case "input":
                    bb(e, f);
                    break;
                  case "textarea":
                    ib(e, f);
                    break;
                  case "select":
                    var r = e._wrapperState.wasMultiple;
                    e._wrapperState.wasMultiple = !!f.multiple;
                    var y = f.value;
                    null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                      e,
                      !!f.multiple,
                      f.defaultValue,
                      true
                    ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
                }
                e[Pf] = f;
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 6:
            ck(b, a);
            ek(a);
            if (d & 4) {
              if (null === a.stateNode) throw Error(p(162));
              e = a.stateNode;
              f = a.memoizedProps;
              try {
                e.nodeValue = f;
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 3:
            ck(b, a);
            ek(a);
            if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
              bd(b.containerInfo);
            } catch (t) {
              W(a, a.return, t);
            }
            break;
          case 4:
            ck(b, a);
            ek(a);
            break;
          case 13:
            ck(b, a);
            ek(a);
            e = a.child;
            e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
            d & 4 && ak(a);
            break;
          case 22:
            m = null !== c && null !== c.memoizedState;
            a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
            ek(a);
            if (d & 8192) {
              l = null !== a.memoizedState;
              if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
                for (q = V = m; null !== V; ) {
                  r = V;
                  y = r.child;
                  switch (r.tag) {
                    case 0:
                    case 11:
                    case 14:
                    case 15:
                      Pj(4, r, r.return);
                      break;
                    case 1:
                      Lj(r, r.return);
                      var n = r.stateNode;
                      if ("function" === typeof n.componentWillUnmount) {
                        d = r;
                        c = r.return;
                        try {
                          b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                        } catch (t) {
                          W(d, c, t);
                        }
                      }
                      break;
                    case 5:
                      Lj(r, r.return);
                      break;
                    case 22:
                      if (null !== r.memoizedState) {
                        gk(q);
                        continue;
                      }
                  }
                  null !== y ? (y.return = r, V = y) : gk(q);
                }
                m = m.sibling;
              }
              a: for (m = null, q = a; ; ) {
                if (5 === q.tag) {
                  if (null === m) {
                    m = q;
                    try {
                      e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                    } catch (t) {
                      W(a, a.return, t);
                    }
                  }
                } else if (6 === q.tag) {
                  if (null === m) try {
                    q.stateNode.nodeValue = l ? "" : q.memoizedProps;
                  } catch (t) {
                    W(a, a.return, t);
                  }
                } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
                  q.child.return = q;
                  q = q.child;
                  continue;
                }
                if (q === a) break a;
                for (; null === q.sibling; ) {
                  if (null === q.return || q.return === a) break a;
                  m === q && (m = null);
                  q = q.return;
                }
                m === q && (m = null);
                q.sibling.return = q.return;
                q = q.sibling;
              }
            }
            break;
          case 19:
            ck(b, a);
            ek(a);
            d & 4 && ak(a);
            break;
          case 21:
            break;
          default:
            ck(
              b,
              a
            ), ek(a);
        }
      }
      function ek(a) {
        var b = a.flags;
        if (b & 2) {
          try {
            a: {
              for (var c = a.return; null !== c; ) {
                if (Tj(c)) {
                  var d = c;
                  break a;
                }
                c = c.return;
              }
              throw Error(p(160));
            }
            switch (d.tag) {
              case 5:
                var e = d.stateNode;
                d.flags & 32 && (ob(e, ""), d.flags &= -33);
                var f = Uj(a);
                Wj(a, f, e);
                break;
              case 3:
              case 4:
                var g = d.stateNode.containerInfo, h = Uj(a);
                Vj(a, h, g);
                break;
              default:
                throw Error(p(161));
            }
          } catch (k) {
            W(a, a.return, k);
          }
          a.flags &= -3;
        }
        b & 4096 && (a.flags &= -4097);
      }
      function hk(a, b, c) {
        V = a;
        ik(a, b, c);
      }
      function ik(a, b, c) {
        for (var d = 0 !== (a.mode & 1); null !== V; ) {
          var e = V, f = e.child;
          if (22 === e.tag && d) {
            var g = null !== e.memoizedState || Jj;
            if (!g) {
              var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
              h = Jj;
              var l = U;
              Jj = g;
              if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
              for (; null !== f; ) V = f, ik(f, b, c), f = f.sibling;
              V = e;
              Jj = h;
              U = l;
            }
            kk(a, b, c);
          } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a, b, c);
        }
      }
      function kk(a) {
        for (; null !== V; ) {
          var b = V;
          if (0 !== (b.flags & 8772)) {
            var c = b.alternate;
            try {
              if (0 !== (b.flags & 8772)) switch (b.tag) {
                case 0:
                case 11:
                case 15:
                  U || Qj(5, b);
                  break;
                case 1:
                  var d = b.stateNode;
                  if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                  else {
                    var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                    d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                  }
                  var f = b.updateQueue;
                  null !== f && sh(b, f, d);
                  break;
                case 3:
                  var g = b.updateQueue;
                  if (null !== g) {
                    c = null;
                    if (null !== b.child) switch (b.child.tag) {
                      case 5:
                        c = b.child.stateNode;
                        break;
                      case 1:
                        c = b.child.stateNode;
                    }
                    sh(b, g, c);
                  }
                  break;
                case 5:
                  var h = b.stateNode;
                  if (null === c && b.flags & 4) {
                    c = h;
                    var k = b.memoizedProps;
                    switch (b.type) {
                      case "button":
                      case "input":
                      case "select":
                      case "textarea":
                        k.autoFocus && c.focus();
                        break;
                      case "img":
                        k.src && (c.src = k.src);
                    }
                  }
                  break;
                case 6:
                  break;
                case 4:
                  break;
                case 12:
                  break;
                case 13:
                  if (null === b.memoizedState) {
                    var l = b.alternate;
                    if (null !== l) {
                      var m = l.memoizedState;
                      if (null !== m) {
                        var q = m.dehydrated;
                        null !== q && bd(q);
                      }
                    }
                  }
                  break;
                case 19:
                case 17:
                case 21:
                case 22:
                case 23:
                case 25:
                  break;
                default:
                  throw Error(p(163));
              }
              U || b.flags & 512 && Rj(b);
            } catch (r) {
              W(b, b.return, r);
            }
          }
          if (b === a) {
            V = null;
            break;
          }
          c = b.sibling;
          if (null !== c) {
            c.return = b.return;
            V = c;
            break;
          }
          V = b.return;
        }
      }
      function gk(a) {
        for (; null !== V; ) {
          var b = V;
          if (b === a) {
            V = null;
            break;
          }
          var c = b.sibling;
          if (null !== c) {
            c.return = b.return;
            V = c;
            break;
          }
          V = b.return;
        }
      }
      function jk(a) {
        for (; null !== V; ) {
          var b = V;
          try {
            switch (b.tag) {
              case 0:
              case 11:
              case 15:
                var c = b.return;
                try {
                  Qj(4, b);
                } catch (k) {
                  W(b, c, k);
                }
                break;
              case 1:
                var d = b.stateNode;
                if ("function" === typeof d.componentDidMount) {
                  var e = b.return;
                  try {
                    d.componentDidMount();
                  } catch (k) {
                    W(b, e, k);
                  }
                }
                var f = b.return;
                try {
                  Rj(b);
                } catch (k) {
                  W(b, f, k);
                }
                break;
              case 5:
                var g = b.return;
                try {
                  Rj(b);
                } catch (k) {
                  W(b, g, k);
                }
            }
          } catch (k) {
            W(b, b.return, k);
          }
          if (b === a) {
            V = null;
            break;
          }
          var h = b.sibling;
          if (null !== h) {
            h.return = b.return;
            V = h;
            break;
          }
          V = b.return;
        }
      }
      var lk = Math.ceil;
      var mk = ua.ReactCurrentDispatcher;
      var nk = ua.ReactCurrentOwner;
      var ok = ua.ReactCurrentBatchConfig;
      var K = 0;
      var Q = null;
      var Y = null;
      var Z = 0;
      var fj = 0;
      var ej = Uf(0);
      var T = 0;
      var pk = null;
      var rh = 0;
      var qk = 0;
      var rk = 0;
      var sk = null;
      var tk = null;
      var fk = 0;
      var Gj = Infinity;
      var uk = null;
      var Oi = false;
      var Pi = null;
      var Ri = null;
      var vk = false;
      var wk = null;
      var xk = 0;
      var yk = 0;
      var zk = null;
      var Ak = -1;
      var Bk = 0;
      function R() {
        return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
      }
      function yi(a) {
        if (0 === (a.mode & 1)) return 1;
        if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
        if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
        a = C;
        if (0 !== a) return a;
        a = window.event;
        a = void 0 === a ? 16 : jd(a.type);
        return a;
      }
      function gi(a, b, c, d) {
        if (50 < yk) throw yk = 0, zk = null, Error(p(185));
        Ac(a, c, d);
        if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
      }
      function Dk(a, b) {
        var c = a.callbackNode;
        wc(a, b);
        var d = uc(a, a === Q ? Z : 0);
        if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
        else if (b = d & -d, a.callbackPriority !== b) {
          null != c && bc(c);
          if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
            0 === (K & 6) && jg();
          }), c = null;
          else {
            switch (Dc(d)) {
              case 1:
                c = fc;
                break;
              case 4:
                c = gc;
                break;
              case 16:
                c = hc;
                break;
              case 536870912:
                c = jc;
                break;
              default:
                c = hc;
            }
            c = Fk(c, Gk.bind(null, a));
          }
          a.callbackPriority = b;
          a.callbackNode = c;
        }
      }
      function Gk(a, b) {
        Ak = -1;
        Bk = 0;
        if (0 !== (K & 6)) throw Error(p(327));
        var c = a.callbackNode;
        if (Hk() && a.callbackNode !== c) return null;
        var d = uc(a, a === Q ? Z : 0);
        if (0 === d) return null;
        if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
        else {
          b = d;
          var e = K;
          K |= 2;
          var f = Jk();
          if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
          do
            try {
              Lk();
              break;
            } catch (h) {
              Mk(a, h);
            }
          while (1);
          $g();
          mk.current = f;
          K = e;
          null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
        }
        if (0 !== b) {
          2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
          if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          if (6 === b) Ck(a, d);
          else {
            e = a.current.alternate;
            if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
            a.finishedWork = e;
            a.finishedLanes = d;
            switch (b) {
              case 0:
              case 1:
                throw Error(p(345));
              case 2:
                Pk(a, tk, uk);
                break;
              case 3:
                Ck(a, d);
                if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                  if (0 !== uc(a, 0)) break;
                  e = a.suspendedLanes;
                  if ((e & d) !== d) {
                    R();
                    a.pingedLanes |= a.suspendedLanes & e;
                    break;
                  }
                  a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                  break;
                }
                Pk(a, tk, uk);
                break;
              case 4:
                Ck(a, d);
                if ((d & 4194240) === d) break;
                b = a.eventTimes;
                for (e = -1; 0 < d; ) {
                  var g = 31 - oc(d);
                  f = 1 << g;
                  g = b[g];
                  g > e && (e = g);
                  d &= ~f;
                }
                d = e;
                d = B() - d;
                d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
                if (10 < d) {
                  a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                  break;
                }
                Pk(a, tk, uk);
                break;
              case 5:
                Pk(a, tk, uk);
                break;
              default:
                throw Error(p(329));
            }
          }
        }
        Dk(a, B());
        return a.callbackNode === c ? Gk.bind(null, a) : null;
      }
      function Nk(a, b) {
        var c = sk;
        a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
        a = Ik(a, b);
        2 !== a && (b = tk, tk = c, null !== b && Fj(b));
        return a;
      }
      function Fj(a) {
        null === tk ? tk = a : tk.push.apply(tk, a);
      }
      function Ok(a) {
        for (var b = a; ; ) {
          if (b.flags & 16384) {
            var c = b.updateQueue;
            if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
              var e = c[d], f = e.getSnapshot;
              e = e.value;
              try {
                if (!He(f(), e)) return false;
              } catch (g) {
                return false;
              }
            }
          }
          c = b.child;
          if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
          else {
            if (b === a) break;
            for (; null === b.sibling; ) {
              if (null === b.return || b.return === a) return true;
              b = b.return;
            }
            b.sibling.return = b.return;
            b = b.sibling;
          }
        }
        return true;
      }
      function Ck(a, b) {
        b &= ~rk;
        b &= ~qk;
        a.suspendedLanes |= b;
        a.pingedLanes &= ~b;
        for (a = a.expirationTimes; 0 < b; ) {
          var c = 31 - oc(b), d = 1 << c;
          a[c] = -1;
          b &= ~d;
        }
      }
      function Ek(a) {
        if (0 !== (K & 6)) throw Error(p(327));
        Hk();
        var b = uc(a, 0);
        if (0 === (b & 1)) return Dk(a, B()), null;
        var c = Ik(a, b);
        if (0 !== a.tag && 2 === c) {
          var d = xc(a);
          0 !== d && (b = d, c = Nk(a, d));
        }
        if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
        if (6 === c) throw Error(p(345));
        a.finishedWork = a.current.alternate;
        a.finishedLanes = b;
        Pk(a, tk, uk);
        Dk(a, B());
        return null;
      }
      function Qk(a, b) {
        var c = K;
        K |= 1;
        try {
          return a(b);
        } finally {
          K = c, 0 === K && (Gj = B() + 500, fg && jg());
        }
      }
      function Rk(a) {
        null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
        var b = K;
        K |= 1;
        var c = ok.transition, d = C;
        try {
          if (ok.transition = null, C = 1, a) return a();
        } finally {
          C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
        }
      }
      function Hj() {
        fj = ej.current;
        E(ej);
      }
      function Kk(a, b) {
        a.finishedWork = null;
        a.finishedLanes = 0;
        var c = a.timeoutHandle;
        -1 !== c && (a.timeoutHandle = -1, Gf(c));
        if (null !== Y) for (c = Y.return; null !== c; ) {
          var d = c;
          wg(d);
          switch (d.tag) {
            case 1:
              d = d.type.childContextTypes;
              null !== d && void 0 !== d && $f();
              break;
            case 3:
              zh();
              E(Wf);
              E(H);
              Eh();
              break;
            case 5:
              Bh(d);
              break;
            case 4:
              zh();
              break;
            case 13:
              E(L);
              break;
            case 19:
              E(L);
              break;
            case 10:
              ah(d.type._context);
              break;
            case 22:
            case 23:
              Hj();
          }
          c = c.return;
        }
        Q = a;
        Y = a = Pg(a.current, null);
        Z = fj = b;
        T = 0;
        pk = null;
        rk = qk = rh = 0;
        tk = sk = null;
        if (null !== fh) {
          for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
            c.interleaved = null;
            var e = d.next, f = c.pending;
            if (null !== f) {
              var g = f.next;
              f.next = e;
              d.next = g;
            }
            c.pending = d;
          }
          fh = null;
        }
        return a;
      }
      function Mk(a, b) {
        do {
          var c = Y;
          try {
            $g();
            Fh.current = Rh;
            if (Ih) {
              for (var d = M.memoizedState; null !== d; ) {
                var e = d.queue;
                null !== e && (e.pending = null);
                d = d.next;
              }
              Ih = false;
            }
            Hh = 0;
            O = N = M = null;
            Jh = false;
            Kh = 0;
            nk.current = null;
            if (null === c || null === c.return) {
              T = 1;
              pk = b;
              Y = null;
              break;
            }
            a: {
              var f = a, g = c.return, h = c, k = b;
              b = Z;
              h.flags |= 32768;
              if (null !== k && "object" === typeof k && "function" === typeof k.then) {
                var l = k, m = h, q = m.tag;
                if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                  var r = m.alternate;
                  r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
                }
                var y = Ui(g);
                if (null !== y) {
                  y.flags &= -257;
                  Vi(y, g, h, f, b);
                  y.mode & 1 && Si(f, l, b);
                  b = y;
                  k = l;
                  var n = b.updateQueue;
                  if (null === n) {
                    var t = /* @__PURE__ */ new Set();
                    t.add(k);
                    b.updateQueue = t;
                  } else n.add(k);
                  break a;
                } else {
                  if (0 === (b & 1)) {
                    Si(f, l, b);
                    tj();
                    break a;
                  }
                  k = Error(p(426));
                }
              } else if (I && h.mode & 1) {
                var J = Ui(g);
                if (null !== J) {
                  0 === (J.flags & 65536) && (J.flags |= 256);
                  Vi(J, g, h, f, b);
                  Jg(Ji(k, h));
                  break a;
                }
              }
              f = k = Ji(k, h);
              4 !== T && (T = 2);
              null === sk ? sk = [f] : sk.push(f);
              f = g;
              do {
                switch (f.tag) {
                  case 3:
                    f.flags |= 65536;
                    b &= -b;
                    f.lanes |= b;
                    var x = Ni(f, k, b);
                    ph(f, x);
                    break a;
                  case 1:
                    h = k;
                    var w = f.type, u = f.stateNode;
                    if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                      f.flags |= 65536;
                      b &= -b;
                      f.lanes |= b;
                      var F = Qi(f, h, b);
                      ph(f, F);
                      break a;
                    }
                }
                f = f.return;
              } while (null !== f);
            }
            Sk(c);
          } catch (na) {
            b = na;
            Y === c && null !== c && (Y = c = c.return);
            continue;
          }
          break;
        } while (1);
      }
      function Jk() {
        var a = mk.current;
        mk.current = Rh;
        return null === a ? Rh : a;
      }
      function tj() {
        if (0 === T || 3 === T || 2 === T) T = 4;
        null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
      }
      function Ik(a, b) {
        var c = K;
        K |= 2;
        var d = Jk();
        if (Q !== a || Z !== b) uk = null, Kk(a, b);
        do
          try {
            Tk();
            break;
          } catch (e) {
            Mk(a, e);
          }
        while (1);
        $g();
        K = c;
        mk.current = d;
        if (null !== Y) throw Error(p(261));
        Q = null;
        Z = 0;
        return T;
      }
      function Tk() {
        for (; null !== Y; ) Uk(Y);
      }
      function Lk() {
        for (; null !== Y && !cc(); ) Uk(Y);
      }
      function Uk(a) {
        var b = Vk(a.alternate, a, fj);
        a.memoizedProps = a.pendingProps;
        null === b ? Sk(a) : Y = b;
        nk.current = null;
      }
      function Sk(a) {
        var b = a;
        do {
          var c = b.alternate;
          a = b.return;
          if (0 === (b.flags & 32768)) {
            if (c = Ej(c, b, fj), null !== c) {
              Y = c;
              return;
            }
          } else {
            c = Ij(c, b);
            if (null !== c) {
              c.flags &= 32767;
              Y = c;
              return;
            }
            if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
            else {
              T = 6;
              Y = null;
              return;
            }
          }
          b = b.sibling;
          if (null !== b) {
            Y = b;
            return;
          }
          Y = b = a;
        } while (null !== b);
        0 === T && (T = 5);
      }
      function Pk(a, b, c) {
        var d = C, e = ok.transition;
        try {
          ok.transition = null, C = 1, Wk(a, b, c, d);
        } finally {
          ok.transition = e, C = d;
        }
        return null;
      }
      function Wk(a, b, c, d) {
        do
          Hk();
        while (null !== wk);
        if (0 !== (K & 6)) throw Error(p(327));
        c = a.finishedWork;
        var e = a.finishedLanes;
        if (null === c) return null;
        a.finishedWork = null;
        a.finishedLanes = 0;
        if (c === a.current) throw Error(p(177));
        a.callbackNode = null;
        a.callbackPriority = 0;
        var f = c.lanes | c.childLanes;
        Bc(a, f);
        a === Q && (Y = Q = null, Z = 0);
        0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
          Hk();
          return null;
        }));
        f = 0 !== (c.flags & 15990);
        if (0 !== (c.subtreeFlags & 15990) || f) {
          f = ok.transition;
          ok.transition = null;
          var g = C;
          C = 1;
          var h = K;
          K |= 4;
          nk.current = null;
          Oj(a, c);
          dk(c, a);
          Oe(Df);
          dd = !!Cf;
          Df = Cf = null;
          a.current = c;
          hk(c, a, e);
          dc();
          K = h;
          C = g;
          ok.transition = f;
        } else a.current = c;
        vk && (vk = false, wk = a, xk = e);
        f = a.pendingLanes;
        0 === f && (Ri = null);
        mc(c.stateNode, d);
        Dk(a, B());
        if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
        if (Oi) throw Oi = false, a = Pi, Pi = null, a;
        0 !== (xk & 1) && 0 !== a.tag && Hk();
        f = a.pendingLanes;
        0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
        jg();
        return null;
      }
      function Hk() {
        if (null !== wk) {
          var a = Dc(xk), b = ok.transition, c = C;
          try {
            ok.transition = null;
            C = 16 > a ? 16 : a;
            if (null === wk) var d = false;
            else {
              a = wk;
              wk = null;
              xk = 0;
              if (0 !== (K & 6)) throw Error(p(331));
              var e = K;
              K |= 4;
              for (V = a.current; null !== V; ) {
                var f = V, g = f.child;
                if (0 !== (V.flags & 16)) {
                  var h = f.deletions;
                  if (null !== h) {
                    for (var k = 0; k < h.length; k++) {
                      var l = h[k];
                      for (V = l; null !== V; ) {
                        var m = V;
                        switch (m.tag) {
                          case 0:
                          case 11:
                          case 15:
                            Pj(8, m, f);
                        }
                        var q = m.child;
                        if (null !== q) q.return = m, V = q;
                        else for (; null !== V; ) {
                          m = V;
                          var r = m.sibling, y = m.return;
                          Sj(m);
                          if (m === l) {
                            V = null;
                            break;
                          }
                          if (null !== r) {
                            r.return = y;
                            V = r;
                            break;
                          }
                          V = y;
                        }
                      }
                    }
                    var n = f.alternate;
                    if (null !== n) {
                      var t = n.child;
                      if (null !== t) {
                        n.child = null;
                        do {
                          var J = t.sibling;
                          t.sibling = null;
                          t = J;
                        } while (null !== t);
                      }
                    }
                    V = f;
                  }
                }
                if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
                else b: for (; null !== V; ) {
                  f = V;
                  if (0 !== (f.flags & 2048)) switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(9, f, f.return);
                  }
                  var x = f.sibling;
                  if (null !== x) {
                    x.return = f.return;
                    V = x;
                    break b;
                  }
                  V = f.return;
                }
              }
              var w = a.current;
              for (V = w; null !== V; ) {
                g = V;
                var u = g.child;
                if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
                else b: for (g = w; null !== V; ) {
                  h = V;
                  if (0 !== (h.flags & 2048)) try {
                    switch (h.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Qj(9, h);
                    }
                  } catch (na) {
                    W(h, h.return, na);
                  }
                  if (h === g) {
                    V = null;
                    break b;
                  }
                  var F = h.sibling;
                  if (null !== F) {
                    F.return = h.return;
                    V = F;
                    break b;
                  }
                  V = h.return;
                }
              }
              K = e;
              jg();
              if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
                lc.onPostCommitFiberRoot(kc, a);
              } catch (na) {
              }
              d = true;
            }
            return d;
          } finally {
            C = c, ok.transition = b;
          }
        }
        return false;
      }
      function Xk(a, b, c) {
        b = Ji(c, b);
        b = Ni(a, b, 1);
        a = nh(a, b, 1);
        b = R();
        null !== a && (Ac(a, 1, b), Dk(a, b));
      }
      function W(a, b, c) {
        if (3 === a.tag) Xk(a, a, c);
        else for (; null !== b; ) {
          if (3 === b.tag) {
            Xk(b, a, c);
            break;
          } else if (1 === b.tag) {
            var d = b.stateNode;
            if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
              a = Ji(c, a);
              a = Qi(b, a, 1);
              b = nh(b, a, 1);
              a = R();
              null !== b && (Ac(b, 1, a), Dk(b, a));
              break;
            }
          }
          b = b.return;
        }
      }
      function Ti(a, b, c) {
        var d = a.pingCache;
        null !== d && d.delete(b);
        b = R();
        a.pingedLanes |= a.suspendedLanes & c;
        Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
        Dk(a, b);
      }
      function Yk(a, b) {
        0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
        var c = R();
        a = ih(a, b);
        null !== a && (Ac(a, b, c), Dk(a, c));
      }
      function uj(a) {
        var b = a.memoizedState, c = 0;
        null !== b && (c = b.retryLane);
        Yk(a, c);
      }
      function bk(a, b) {
        var c = 0;
        switch (a.tag) {
          case 13:
            var d = a.stateNode;
            var e = a.memoizedState;
            null !== e && (c = e.retryLane);
            break;
          case 19:
            d = a.stateNode;
            break;
          default:
            throw Error(p(314));
        }
        null !== d && d.delete(b);
        Yk(a, c);
      }
      var Vk;
      Vk = function(a, b, c) {
        if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
        else {
          if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
          dh = 0 !== (a.flags & 131072) ? true : false;
        }
        else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
        b.lanes = 0;
        switch (b.tag) {
          case 2:
            var d = b.type;
            ij(a, b);
            a = b.pendingProps;
            var e = Yf(b, H.current);
            ch(b, c);
            e = Nh(null, b, d, a, e, c);
            var f = Sh();
            b.flags |= 1;
            "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
            return b;
          case 16:
            d = b.elementType;
            a: {
              ij(a, b);
              a = b.pendingProps;
              e = d._init;
              d = e(d._payload);
              b.type = d;
              e = b.tag = Zk(d);
              a = Ci(d, a);
              switch (e) {
                case 0:
                  b = cj(null, b, d, a, c);
                  break a;
                case 1:
                  b = hj(null, b, d, a, c);
                  break a;
                case 11:
                  b = Yi(null, b, d, a, c);
                  break a;
                case 14:
                  b = $i(null, b, d, Ci(d.type, a), c);
                  break a;
              }
              throw Error(p(
                306,
                d,
                ""
              ));
            }
            return b;
          case 0:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
          case 1:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
          case 3:
            a: {
              kj(b);
              if (null === a) throw Error(p(387));
              d = b.pendingProps;
              f = b.memoizedState;
              e = f.element;
              lh(a, b);
              qh(b, d, null, c);
              var g = b.memoizedState;
              d = g.element;
              if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
                e = Ji(Error(p(423)), b);
                b = lj(a, b, d, c, e);
                break a;
              } else if (d !== e) {
                e = Ji(Error(p(424)), b);
                b = lj(a, b, d, c, e);
                break a;
              } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
              else {
                Ig();
                if (d === e) {
                  b = Zi(a, b, c);
                  break a;
                }
                Xi(a, b, d, c);
              }
              b = b.child;
            }
            return b;
          case 5:
            return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
          case 6:
            return null === a && Eg(b), null;
          case 13:
            return oj(a, b, c);
          case 4:
            return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
          case 11:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
          case 7:
            return Xi(a, b, b.pendingProps, c), b.child;
          case 8:
            return Xi(a, b, b.pendingProps.children, c), b.child;
          case 12:
            return Xi(a, b, b.pendingProps.children, c), b.child;
          case 10:
            a: {
              d = b.type._context;
              e = b.pendingProps;
              f = b.memoizedProps;
              g = e.value;
              G(Wg, d._currentValue);
              d._currentValue = g;
              if (null !== f) if (He(f.value, g)) {
                if (f.children === e.children && !Wf.current) {
                  b = Zi(a, b, c);
                  break a;
                }
              } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
                var h = f.dependencies;
                if (null !== h) {
                  g = f.child;
                  for (var k = h.firstContext; null !== k; ) {
                    if (k.context === d) {
                      if (1 === f.tag) {
                        k = mh(-1, c & -c);
                        k.tag = 2;
                        var l = f.updateQueue;
                        if (null !== l) {
                          l = l.shared;
                          var m = l.pending;
                          null === m ? k.next = k : (k.next = m.next, m.next = k);
                          l.pending = k;
                        }
                      }
                      f.lanes |= c;
                      k = f.alternate;
                      null !== k && (k.lanes |= c);
                      bh(
                        f.return,
                        c,
                        b
                      );
                      h.lanes |= c;
                      break;
                    }
                    k = k.next;
                  }
                } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
                else if (18 === f.tag) {
                  g = f.return;
                  if (null === g) throw Error(p(341));
                  g.lanes |= c;
                  h = g.alternate;
                  null !== h && (h.lanes |= c);
                  bh(g, c, b);
                  g = f.sibling;
                } else g = f.child;
                if (null !== g) g.return = f;
                else for (g = f; null !== g; ) {
                  if (g === b) {
                    g = null;
                    break;
                  }
                  f = g.sibling;
                  if (null !== f) {
                    f.return = g.return;
                    g = f;
                    break;
                  }
                  g = g.return;
                }
                f = g;
              }
              Xi(a, b, e.children, c);
              b = b.child;
            }
            return b;
          case 9:
            return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
          case 14:
            return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
          case 15:
            return bj(a, b, b.type, b.pendingProps, c);
          case 17:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
          case 19:
            return xj(a, b, c);
          case 22:
            return dj(a, b, c);
        }
        throw Error(p(156, b.tag));
      };
      function Fk(a, b) {
        return ac(a, b);
      }
      function $k(a, b, c, d) {
        this.tag = a;
        this.key = c;
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = b;
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
        this.mode = d;
        this.subtreeFlags = this.flags = 0;
        this.deletions = null;
        this.childLanes = this.lanes = 0;
        this.alternate = null;
      }
      function Bg(a, b, c, d) {
        return new $k(a, b, c, d);
      }
      function aj(a) {
        a = a.prototype;
        return !(!a || !a.isReactComponent);
      }
      function Zk(a) {
        if ("function" === typeof a) return aj(a) ? 1 : 0;
        if (void 0 !== a && null !== a) {
          a = a.$$typeof;
          if (a === Da) return 11;
          if (a === Ga) return 14;
        }
        return 2;
      }
      function Pg(a, b) {
        var c = a.alternate;
        null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
        c.flags = a.flags & 14680064;
        c.childLanes = a.childLanes;
        c.lanes = a.lanes;
        c.child = a.child;
        c.memoizedProps = a.memoizedProps;
        c.memoizedState = a.memoizedState;
        c.updateQueue = a.updateQueue;
        b = a.dependencies;
        c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
        c.sibling = a.sibling;
        c.index = a.index;
        c.ref = a.ref;
        return c;
      }
      function Rg(a, b, c, d, e, f) {
        var g = 2;
        d = a;
        if ("function" === typeof a) aj(a) && (g = 1);
        else if ("string" === typeof a) g = 5;
        else a: switch (a) {
          case ya:
            return Tg(c.children, e, f, b);
          case za:
            g = 8;
            e |= 8;
            break;
          case Aa:
            return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
          case Ea:
            return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
          case Fa:
            return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
          case Ia:
            return pj(c, e, f, b);
          default:
            if ("object" === typeof a && null !== a) switch (a.$$typeof) {
              case Ba:
                g = 10;
                break a;
              case Ca:
                g = 9;
                break a;
              case Da:
                g = 11;
                break a;
              case Ga:
                g = 14;
                break a;
              case Ha:
                g = 16;
                d = null;
                break a;
            }
            throw Error(p(130, null == a ? a : typeof a, ""));
        }
        b = Bg(g, c, b, e);
        b.elementType = a;
        b.type = d;
        b.lanes = f;
        return b;
      }
      function Tg(a, b, c, d) {
        a = Bg(7, a, d, b);
        a.lanes = c;
        return a;
      }
      function pj(a, b, c, d) {
        a = Bg(22, a, d, b);
        a.elementType = Ia;
        a.lanes = c;
        a.stateNode = { isHidden: false };
        return a;
      }
      function Qg(a, b, c) {
        a = Bg(6, a, null, b);
        a.lanes = c;
        return a;
      }
      function Sg(a, b, c) {
        b = Bg(4, null !== a.children ? a.children : [], a.key, b);
        b.lanes = c;
        b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
        return b;
      }
      function al(a, b, c, d, e) {
        this.tag = b;
        this.containerInfo = a;
        this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
        this.timeoutHandle = -1;
        this.callbackNode = this.pendingContext = this.context = null;
        this.callbackPriority = 0;
        this.eventTimes = zc(0);
        this.expirationTimes = zc(-1);
        this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
        this.entanglements = zc(0);
        this.identifierPrefix = d;
        this.onRecoverableError = e;
        this.mutableSourceEagerHydrationData = null;
      }
      function bl(a, b, c, d, e, f, g, h, k) {
        a = new al(a, b, c, h, k);
        1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
        f = Bg(3, null, null, b);
        a.current = f;
        f.stateNode = a;
        f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
        kh(f);
        return a;
      }
      function cl(a, b, c) {
        var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
      }
      function dl(a) {
        if (!a) return Vf;
        a = a._reactInternals;
        a: {
          if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
          var b = a;
          do {
            switch (b.tag) {
              case 3:
                b = b.stateNode.context;
                break a;
              case 1:
                if (Zf(b.type)) {
                  b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                  break a;
                }
            }
            b = b.return;
          } while (null !== b);
          throw Error(p(171));
        }
        if (1 === a.tag) {
          var c = a.type;
          if (Zf(c)) return bg(a, c, b);
        }
        return b;
      }
      function el(a, b, c, d, e, f, g, h, k) {
        a = bl(c, d, true, a, e, f, g, h, k);
        a.context = dl(null);
        c = a.current;
        d = R();
        e = yi(c);
        f = mh(d, e);
        f.callback = void 0 !== b && null !== b ? b : null;
        nh(c, f, e);
        a.current.lanes = e;
        Ac(a, e, d);
        Dk(a, d);
        return a;
      }
      function fl(a, b, c, d) {
        var e = b.current, f = R(), g = yi(e);
        c = dl(c);
        null === b.context ? b.context = c : b.pendingContext = c;
        b = mh(f, g);
        b.payload = { element: a };
        d = void 0 === d ? null : d;
        null !== d && (b.callback = d);
        a = nh(e, b, g);
        null !== a && (gi(a, e, g, f), oh(a, e, g));
        return g;
      }
      function gl(a) {
        a = a.current;
        if (!a.child) return null;
        switch (a.child.tag) {
          case 5:
            return a.child.stateNode;
          default:
            return a.child.stateNode;
        }
      }
      function hl(a, b) {
        a = a.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          var c = a.retryLane;
          a.retryLane = 0 !== c && c < b ? c : b;
        }
      }
      function il(a, b) {
        hl(a, b);
        (a = a.alternate) && hl(a, b);
      }
      function jl() {
        return null;
      }
      var kl = "function" === typeof reportError ? reportError : function(a) {
        console.error(a);
      };
      function ll(a) {
        this._internalRoot = a;
      }
      ml.prototype.render = ll.prototype.render = function(a) {
        var b = this._internalRoot;
        if (null === b) throw Error(p(409));
        fl(a, b, null, null);
      };
      ml.prototype.unmount = ll.prototype.unmount = function() {
        var a = this._internalRoot;
        if (null !== a) {
          this._internalRoot = null;
          var b = a.containerInfo;
          Rk(function() {
            fl(null, a, null, null);
          });
          b[uf] = null;
        }
      };
      function ml(a) {
        this._internalRoot = a;
      }
      ml.prototype.unstable_scheduleHydration = function(a) {
        if (a) {
          var b = Hc();
          a = { blockedOn: null, target: a, priority: b };
          for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
          Qc.splice(c, 0, a);
          0 === c && Vc(a);
        }
      };
      function nl(a) {
        return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
      }
      function ol(a) {
        return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
      }
      function pl() {
      }
      function ql(a, b, c, d, e) {
        if (e) {
          if ("function" === typeof d) {
            var f = d;
            d = function() {
              var a2 = gl(g);
              f.call(a2);
            };
          }
          var g = el(b, d, a, 0, null, false, false, "", pl);
          a._reactRootContainer = g;
          a[uf] = g.current;
          sf(8 === a.nodeType ? a.parentNode : a);
          Rk();
          return g;
        }
        for (; e = a.lastChild; ) a.removeChild(e);
        if ("function" === typeof d) {
          var h = d;
          d = function() {
            var a2 = gl(k);
            h.call(a2);
          };
        }
        var k = bl(a, 0, false, null, null, false, false, "", pl);
        a._reactRootContainer = k;
        a[uf] = k.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk(function() {
          fl(b, k, c, d);
        });
        return k;
      }
      function rl(a, b, c, d, e) {
        var f = c._reactRootContainer;
        if (f) {
          var g = f;
          if ("function" === typeof e) {
            var h = e;
            e = function() {
              var a2 = gl(g);
              h.call(a2);
            };
          }
          fl(b, g, a, e);
        } else g = ql(c, b, a, e, d);
        return gl(g);
      }
      Ec = function(a) {
        switch (a.tag) {
          case 3:
            var b = a.stateNode;
            if (b.current.memoizedState.isDehydrated) {
              var c = tc(b.pendingLanes);
              0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
            }
            break;
          case 13:
            Rk(function() {
              var b2 = ih(a, 1);
              if (null !== b2) {
                var c2 = R();
                gi(b2, a, 1, c2);
              }
            }), il(a, 1);
        }
      };
      Fc = function(a) {
        if (13 === a.tag) {
          var b = ih(a, 134217728);
          if (null !== b) {
            var c = R();
            gi(b, a, 134217728, c);
          }
          il(a, 134217728);
        }
      };
      Gc = function(a) {
        if (13 === a.tag) {
          var b = yi(a), c = ih(a, b);
          if (null !== c) {
            var d = R();
            gi(c, a, b, d);
          }
          il(a, b);
        }
      };
      Hc = function() {
        return C;
      };
      Ic = function(a, b) {
        var c = C;
        try {
          return C = a, b();
        } finally {
          C = c;
        }
      };
      yb = function(a, b, c) {
        switch (b) {
          case "input":
            bb(a, c);
            b = c.name;
            if ("radio" === c.type && null != b) {
              for (c = a; c.parentNode; ) c = c.parentNode;
              c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
              for (b = 0; b < c.length; b++) {
                var d = c[b];
                if (d !== a && d.form === a.form) {
                  var e = Db(d);
                  if (!e) throw Error(p(90));
                  Wa(d);
                  bb(d, e);
                }
              }
            }
            break;
          case "textarea":
            ib(a, c);
            break;
          case "select":
            b = c.value, null != b && fb(a, !!c.multiple, b, false);
        }
      };
      Gb = Qk;
      Hb = Rk;
      var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] };
      var tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
      var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
        a = Zb(a);
        return null === a ? null : a.stateNode;
      }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!vl.isDisabled && vl.supportsFiber) try {
          kc = vl.inject(ul), lc = vl;
        } catch (a) {
        }
      }
      var vl;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
      exports.createPortal = function(a, b) {
        var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!nl(b)) throw Error(p(200));
        return cl(a, b, null, c);
      };
      exports.createRoot = function(a, b) {
        if (!nl(a)) throw Error(p(299));
        var c = false, d = "", e = kl;
        null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
        b = bl(a, 1, false, null, null, c, false, d, e);
        a[uf] = b.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        return new ll(b);
      };
      exports.findDOMNode = function(a) {
        if (null == a) return null;
        if (1 === a.nodeType) return a;
        var b = a._reactInternals;
        if (void 0 === b) {
          if ("function" === typeof a.render) throw Error(p(188));
          a = Object.keys(a).join(",");
          throw Error(p(268, a));
        }
        a = Zb(b);
        a = null === a ? null : a.stateNode;
        return a;
      };
      exports.flushSync = function(a) {
        return Rk(a);
      };
      exports.hydrate = function(a, b, c) {
        if (!ol(b)) throw Error(p(200));
        return rl(null, a, b, true, c);
      };
      exports.hydrateRoot = function(a, b, c) {
        if (!nl(a)) throw Error(p(405));
        var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
        null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
        b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
        a[uf] = b.current;
        sf(a);
        if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
          c,
          e
        );
        return new ml(b);
      };
      exports.render = function(a, b, c) {
        if (!ol(b)) throw Error(p(200));
        return rl(null, a, b, false, c);
      };
      exports.unmountComponentAtNode = function(a) {
        if (!ol(a)) throw Error(p(40));
        return a._reactRootContainer ? (Rk(function() {
          rl(null, null, a, false, function() {
            a._reactRootContainer = null;
            a[uf] = null;
          });
        }), true) : false;
      };
      exports.unstable_batchedUpdates = Qk;
      exports.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
        if (!ol(c)) throw Error(p(200));
        if (null == a || void 0 === a._reactInternals) throw Error(p(38));
        return rl(a, b, c, false, d);
      };
      exports.version = "18.3.1-next-f1338f8080-20240426";
    }
  });

  // node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/client.js
  var require_client = __commonJS({
    "node_modules/react-dom/client.js"(exports) {
      "use strict";
      var m = require_react_dom();
      if (true) {
        exports.createRoot = m.createRoot;
        exports.hydrateRoot = m.hydrateRoot;
      } else {
        i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        exports.createRoot = function(c, o) {
          i.usingClientEntryPoint = true;
          try {
            return m.createRoot(c, o);
          } finally {
            i.usingClientEntryPoint = false;
          }
        };
        exports.hydrateRoot = function(c, h, o) {
          i.usingClientEntryPoint = true;
          try {
            return m.hydrateRoot(c, h, o);
          } finally {
            i.usingClientEntryPoint = false;
          }
        };
      }
      var i;
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
  var toKebabCase;
  var init_toKebabCase = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs"() {
      toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
  function toLucideIconData(iconName, iconNode, aliases = []) {
    if (iconNode == null) {
      throw new Error("[lucide]: iconNode is required when icon name is used");
    }
    return {
      name: toKebabCase(iconName),
      size: 24,
      node: iconNode,
      ...aliases.length > 0 ? { aliases } : {}
    };
  }
  var init_toLucideIconData = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs"() {
      init_toKebabCase();
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
  var toCamelCase;
  var init_toCamelCase = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs"() {
      toCamelCase = (string) => {
        let out = "";
        let upperNext = false;
        for (const ch of string) {
          if (ch === "-" || ch === "_" || ch <= " ") {
            upperNext = out.length > 0;
            continue;
          }
          if (out.length === 0) {
            out += ch.toLowerCase();
          } else {
            out += upperNext ? ch.toUpperCase() : ch;
          }
          upperNext = false;
        }
        return out;
      };
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
  var toPascalCase;
  var init_toPascalCase = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs"() {
      init_toCamelCase();
      toPascalCase = (string) => {
        const camelCase = toCamelCase(string);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
      };
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
  var mergeClasses;
  var init_mergeClasses = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs"() {
      mergeClasses = (...classes) => classes.filter((className, index, array) => {
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
      }).join(" ").trim();
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
  var defaultAttributes;
  var init_defaultAttributes = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs"() {
      defaultAttributes = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      };
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
  function isDefined(value) {
    return value !== null && value !== void 0;
  }
  function buildLucideIconNode(icon, params = {}) {
    const attributeNames = params.attributeNames ?? {};
    const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
    const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
    const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
    const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
    const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
    const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
    const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
    const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
    const attributes = {
      ...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
        attrs[getAttributeName(attrName)] = value;
        return attrs;
      }, {}),
      ..."color" in params && params.color && {
        [getAttributeName("stroke")]: params.color
      },
      ..."size" in params && isDefined(params.size) && {
        [getAttributeName("width")]: params.size,
        [getAttributeName("height")]: params.size
      },
      ..."width" in params && isDefined(params.width) && {
        [getAttributeName("width")]: params.width
      },
      ..."height" in params && isDefined(params.height) && {
        [getAttributeName("height")]: params.height
      },
      [getAttributeName("stroke-width")]: calculatedStrokeWidth,
      ...className && {
        [getAttributeName("class")]: className
      },
      [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
      ...params.hasA11yProp === false ? {
        [getAttributeName("aria-hidden")]: "true"
      } : {},
      ..."attributes" in params && params.attributes
    };
    return [
      "svg",
      attributes,
      icon.node.map((child) => {
        const [name, attrs, children] = child;
        const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
        return children ? [name, nextAttrs, children] : [name, nextAttrs];
      })
    ];
  }
  var init_buildLucideIconNode = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs"() {
      init_defaultAttributes();
      init_mergeClasses();
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
  function buildLucideIconForReact(icon, params = {}) {
    return buildLucideIconNode(icon, {
      ...params,
      attributeNames: {
        ...params.attributeNames,
        class: "className",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "vector-effect": "vectorEffect"
      }
    });
  }
  var init_buildLucideIconForReact = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs"() {
      init_buildLucideIconNode();
    }
  });

  // node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
  var hasA11yProp;
  var init_hasA11yProp = __esm({
    "node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs"() {
      hasA11yProp = (props) => {
        for (const prop in props) {
          if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
          }
        }
        return false;
      };
    }
  });

  // node_modules/lucide-react/dist/esm/context.mjs
  var import_react, LucideContext, useLucideContext;
  var init_context = __esm({
    "node_modules/lucide-react/dist/esm/context.mjs"() {
      "use strict";
      "use client";
      import_react = __toESM(require_react(), 1);
      LucideContext = (0, import_react.createContext)({});
      useLucideContext = () => (0, import_react.useContext)(LucideContext);
    }
  });

  // node_modules/lucide-react/dist/esm/Icon.mjs
  var import_react2, Icon;
  var init_Icon = __esm({
    "node_modules/lucide-react/dist/esm/Icon.mjs"() {
      "use strict";
      "use client";
      import_react2 = __toESM(require_react(), 1);
      init_mergeClasses();
      init_buildLucideIconForReact();
      init_hasA11yProp();
      init_context();
      Icon = (0, import_react2.forwardRef)(
        ({
          color,
          size,
          width,
          height,
          strokeWidth,
          absoluteStrokeWidth,
          nonScalingStroke,
          className = "",
          children,
          iconNode = [],
          icon = {
            node: iconNode,
            aliases: [],
            size: 24
          },
          ...rest
        }, ref) => {
          const {
            size: contextSize = 24,
            strokeWidth: contextStrokeWidth = 2,
            absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
            nonScalingStroke: contextNonScalingStroke = false,
            color: contextColor = "currentColor",
            className: contextClass = ""
          } = useLucideContext() ?? {};
          const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
          const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
            color: color ?? contextColor,
            width: width ?? size ?? contextSize,
            height: height ?? size ?? contextSize,
            strokeWidth: strokeWidth ?? contextStrokeWidth,
            absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
            nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
            className: mergeClasses(contextClass, className),
            hasA11yProp: hasAccessibleProp,
            attributes: rest
          });
          return (0, import_react2.createElement)(
            name,
            {
              ref,
              ...svgAttributes
            },
            [
              ...builtIconNode.map(([tag, attrs]) => (0, import_react2.createElement)(tag, attrs)),
              ...Array.isArray(children) ? children : [children]
            ]
          );
        }
      );
    }
  });

  // node_modules/lucide-react/dist/esm/createLucideIcon.mjs
  function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
    const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
    const Component = (0, import_react3.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react3.createElement)(Icon, {
        ref,
        icon: iconData,
        className,
        ...props
      })
    );
    if (iconData.name) {
      Component.displayName = toPascalCase(iconData.name);
    }
    return Component;
  }
  var import_react3;
  var init_createLucideIcon = __esm({
    "node_modules/lucide-react/dist/esm/createLucideIcon.mjs"() {
      import_react3 = __toESM(require_react(), 1);
      init_toLucideIconData();
      init_toPascalCase();
      init_Icon();
    }
  });

  // node_modules/lucide-react/dist/esm/icons/bell-ring.mjs
  var __iconData, BellRing;
  var init_bell_ring = __esm({
    "node_modules/lucide-react/dist/esm/icons/bell-ring.mjs"() {
      init_createLucideIcon();
      __iconData = {
        name: "bell-ring",
        size: 24,
        node: [
          ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
          ["path", { d: "M22 8c0-2.3-.8-4.3-2-6", key: "5bb3ad" }],
          [
            "path",
            {
              d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
              key: "11g9vi"
            }
          ],
          ["path", { d: "M4 2C2.8 3.7 2 5.7 2 8", key: "tap9e0" }]
        ]
      };
      __iconData.node;
      BellRing = createLucideIcon(__iconData);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/bell.mjs
  var __iconData2, Bell;
  var init_bell = __esm({
    "node_modules/lucide-react/dist/esm/icons/bell.mjs"() {
      init_createLucideIcon();
      __iconData2 = {
        name: "bell",
        size: 24,
        node: [
          ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
          [
            "path",
            {
              d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
              key: "11g9vi"
            }
          ]
        ]
      };
      __iconData2.node;
      Bell = createLucideIcon(__iconData2);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/book-open.mjs
  var __iconData3, BookOpen;
  var init_book_open = __esm({
    "node_modules/lucide-react/dist/esm/icons/book-open.mjs"() {
      init_createLucideIcon();
      __iconData3 = {
        name: "book-open",
        size: 24,
        node: [
          ["path", { d: "M12 5v16", key: "1f6ucr" }],
          [
            "path",
            {
              d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
              key: "1fyvmf"
            }
          ]
        ]
      };
      __iconData3.node;
      BookOpen = createLucideIcon(__iconData3);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/calendar.mjs
  var __iconData4, Calendar;
  var init_calendar = __esm({
    "node_modules/lucide-react/dist/esm/icons/calendar.mjs"() {
      init_createLucideIcon();
      __iconData4 = {
        name: "calendar",
        size: 24,
        node: [
          ["path", { d: "M8 2v3", key: "1ioesn" }],
          ["path", { d: "M16 2v3", key: "otl347" }],
          ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }],
          ["path", { d: "M3 9h18", key: "1pudct" }]
        ]
      };
      __iconData4.node;
      Calendar = createLucideIcon(__iconData4);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/circle-alert.mjs
  var __iconData5, CircleAlert;
  var init_circle_alert = __esm({
    "node_modules/lucide-react/dist/esm/icons/circle-alert.mjs"() {
      init_createLucideIcon();
      __iconData5 = {
        name: "circle-alert",
        size: 24,
        node: [
          ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
          ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
          ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
        ],
        aliases: ["alert-circle"]
      };
      __iconData5.node;
      CircleAlert = createLucideIcon(__iconData5);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/circle-check.mjs
  var __iconData6, CircleCheck;
  var init_circle_check = __esm({
    "node_modules/lucide-react/dist/esm/icons/circle-check.mjs"() {
      init_createLucideIcon();
      __iconData6 = {
        name: "circle-check",
        size: 24,
        node: [
          ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
          ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }]
        ],
        aliases: ["check-circle-2"]
      };
      __iconData6.node;
      CircleCheck = createLucideIcon(__iconData6);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/droplet.mjs
  var __iconData7, Droplet;
  var init_droplet = __esm({
    "node_modules/lucide-react/dist/esm/icons/droplet.mjs"() {
      init_createLucideIcon();
      __iconData7 = {
        name: "droplet",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
              key: "c7niix"
            }
          ]
        ]
      };
      __iconData7.node;
      Droplet = createLucideIcon(__iconData7);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/file-text.mjs
  var __iconData8, FileText;
  var init_file_text = __esm({
    "node_modules/lucide-react/dist/esm/icons/file-text.mjs"() {
      init_createLucideIcon();
      __iconData8 = {
        name: "file-text",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
              key: "1oefj6"
            }
          ],
          ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
          ["path", { d: "M10 9H8", key: "b1mrlr" }],
          ["path", { d: "M16 13H8", key: "t4e002" }],
          ["path", { d: "M16 17H8", key: "z1uh3a" }]
        ]
      };
      __iconData8.node;
      FileText = createLucideIcon(__iconData8);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/flame.mjs
  var __iconData9, Flame;
  var init_flame = __esm({
    "node_modules/lucide-react/dist/esm/icons/flame.mjs"() {
      init_createLucideIcon();
      __iconData9 = {
        name: "flame",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
              key: "1slcih"
            }
          ]
        ]
      };
      __iconData9.node;
      Flame = createLucideIcon(__iconData9);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/flower-2.mjs
  var __iconData10, Flower2;
  var init_flower_2 = __esm({
    "node_modules/lucide-react/dist/esm/icons/flower-2.mjs"() {
      init_createLucideIcon();
      __iconData10 = {
        name: "flower-2",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",
              key: "3pnvol"
            }
          ],
          ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
          ["path", { d: "M12 10v12", key: "6ubwww" }],
          ["path", { d: "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z", key: "9hd38g" }],
          ["path", { d: "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z", key: "ufn41s" }]
        ]
      };
      __iconData10.node;
      Flower2 = createLucideIcon(__iconData10);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/globe.mjs
  var __iconData11, Globe;
  var init_globe = __esm({
    "node_modules/lucide-react/dist/esm/icons/globe.mjs"() {
      init_createLucideIcon();
      __iconData11 = {
        name: "globe",
        size: 24,
        node: [
          ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
          ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
          ["path", { d: "M2 12h20", key: "9i4pu4" }]
        ]
      };
      __iconData11.node;
      Globe = createLucideIcon(__iconData11);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/heart.mjs
  var __iconData12, Heart;
  var init_heart = __esm({
    "node_modules/lucide-react/dist/esm/icons/heart.mjs"() {
      init_createLucideIcon();
      __iconData12 = {
        name: "heart",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
              key: "mvr1a0"
            }
          ]
        ]
      };
      __iconData12.node;
      Heart = createLucideIcon(__iconData12);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/house.mjs
  var __iconData13, House;
  var init_house = __esm({
    "node_modules/lucide-react/dist/esm/icons/house.mjs"() {
      init_createLucideIcon();
      __iconData13 = {
        name: "house",
        size: 24,
        node: [
          ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
          [
            "path",
            {
              d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
              key: "r6nss1"
            }
          ]
        ],
        aliases: ["home"]
      };
      __iconData13.node;
      House = createLucideIcon(__iconData13);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/mic-off.mjs
  var __iconData14, MicOff;
  var init_mic_off = __esm({
    "node_modules/lucide-react/dist/esm/icons/mic-off.mjs"() {
      init_createLucideIcon();
      __iconData14 = {
        name: "mic-off",
        size: 24,
        node: [
          ["path", { d: "M12 19v3", key: "npa21l" }],
          ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
          ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
          ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
          ["path", { d: "m2 2 20 20", key: "1ooewy" }],
          ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
        ]
      };
      __iconData14.node;
      MicOff = createLucideIcon(__iconData14);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/mic.mjs
  var __iconData15, Mic;
  var init_mic = __esm({
    "node_modules/lucide-react/dist/esm/icons/mic.mjs"() {
      init_createLucideIcon();
      __iconData15 = {
        name: "mic",
        size: 24,
        node: [
          ["path", { d: "M12 19v3", key: "npa21l" }],
          ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
          ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
        ]
      };
      __iconData15.node;
      Mic = createLucideIcon(__iconData15);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/moon.mjs
  var __iconData16, Moon;
  var init_moon = __esm({
    "node_modules/lucide-react/dist/esm/icons/moon.mjs"() {
      init_createLucideIcon();
      __iconData16 = {
        name: "moon",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
              key: "kfwtm"
            }
          ]
        ]
      };
      __iconData16.node;
      Moon = createLucideIcon(__iconData16);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/music.mjs
  var __iconData17, Music;
  var init_music = __esm({
    "node_modules/lucide-react/dist/esm/icons/music.mjs"() {
      init_createLucideIcon();
      __iconData17 = {
        name: "music",
        size: 24,
        node: [
          ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
          ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
          ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
        ]
      };
      __iconData17.node;
      Music = createLucideIcon(__iconData17);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/pause.mjs
  var __iconData18, Pause;
  var init_pause = __esm({
    "node_modules/lucide-react/dist/esm/icons/pause.mjs"() {
      init_createLucideIcon();
      __iconData18 = {
        name: "pause",
        size: 24,
        node: [
          ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
          ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
        ]
      };
      __iconData18.node;
      Pause = createLucideIcon(__iconData18);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/pen-line.mjs
  var __iconData19, PenLine;
  var init_pen_line = __esm({
    "node_modules/lucide-react/dist/esm/icons/pen-line.mjs"() {
      init_createLucideIcon();
      __iconData19 = {
        name: "pen-line",
        size: 24,
        node: [
          ["path", { d: "M13 21h8", key: "1jsn5i" }],
          [
            "path",
            {
              d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
              key: "1a8usu"
            }
          ]
        ],
        aliases: ["edit-3"]
      };
      __iconData19.node;
      PenLine = createLucideIcon(__iconData19);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/phone.mjs
  var __iconData20, Phone;
  var init_phone = __esm({
    "node_modules/lucide-react/dist/esm/icons/phone.mjs"() {
      init_createLucideIcon();
      __iconData20 = {
        name: "phone",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
              key: "9njp5v"
            }
          ]
        ]
      };
      __iconData20.node;
      Phone = createLucideIcon(__iconData20);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/play.mjs
  var __iconData21, Play;
  var init_play = __esm({
    "node_modules/lucide-react/dist/esm/icons/play.mjs"() {
      init_createLucideIcon();
      __iconData21 = {
        name: "play",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
              key: "10ikf1"
            }
          ]
        ]
      };
      __iconData21.node;
      Play = createLucideIcon(__iconData21);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/plus.mjs
  var __iconData22, Plus;
  var init_plus = __esm({
    "node_modules/lucide-react/dist/esm/icons/plus.mjs"() {
      init_createLucideIcon();
      __iconData22 = {
        name: "plus",
        size: 24,
        node: [
          ["path", { d: "M5 12h14", key: "1ays0h" }],
          ["path", { d: "M12 5v14", key: "s699le" }]
        ]
      };
      __iconData22.node;
      Plus = createLucideIcon(__iconData22);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/save.mjs
  var __iconData23, Save;
  var init_save = __esm({
    "node_modules/lucide-react/dist/esm/icons/save.mjs"() {
      init_createLucideIcon();
      __iconData23 = {
        name: "save",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
              key: "1c8476"
            }
          ],
          ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
          ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
        ]
      };
      __iconData23.node;
      Save = createLucideIcon(__iconData23);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/search.mjs
  var __iconData24, Search;
  var init_search = __esm({
    "node_modules/lucide-react/dist/esm/icons/search.mjs"() {
      init_createLucideIcon();
      __iconData24 = {
        name: "search",
        size: 24,
        node: [
          ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
          ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
        ]
      };
      __iconData24.node;
      Search = createLucideIcon(__iconData24);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/send.mjs
  var __iconData25, Send;
  var init_send = __esm({
    "node_modules/lucide-react/dist/esm/icons/send.mjs"() {
      init_createLucideIcon();
      __iconData25 = {
        name: "send",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
              key: "1ffxy3"
            }
          ],
          ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
        ]
      };
      __iconData25.node;
      Send = createLucideIcon(__iconData25);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/settings.mjs
  var __iconData26, Settings;
  var init_settings = __esm({
    "node_modules/lucide-react/dist/esm/icons/settings.mjs"() {
      init_createLucideIcon();
      __iconData26 = {
        name: "settings",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
              key: "1i5ecw"
            }
          ],
          ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
        ]
      };
      __iconData26.node;
      Settings = createLucideIcon(__iconData26);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/skip-back.mjs
  var __iconData27, SkipBack;
  var init_skip_back = __esm({
    "node_modules/lucide-react/dist/esm/icons/skip-back.mjs"() {
      init_createLucideIcon();
      __iconData27 = {
        name: "skip-back",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
              key: "15892j"
            }
          ],
          ["path", { d: "M3 20V4", key: "1ptbpl" }]
        ]
      };
      __iconData27.node;
      SkipBack = createLucideIcon(__iconData27);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/skip-forward.mjs
  var __iconData28, SkipForward;
  var init_skip_forward = __esm({
    "node_modules/lucide-react/dist/esm/icons/skip-forward.mjs"() {
      init_createLucideIcon();
      __iconData28 = {
        name: "skip-forward",
        size: 24,
        node: [
          ["path", { d: "M21 4v16", key: "7j8fe9" }],
          [
            "path",
            {
              d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
              key: "zs4d6"
            }
          ]
        ]
      };
      __iconData28.node;
      SkipForward = createLucideIcon(__iconData28);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/sparkles.mjs
  var __iconData29, Sparkles;
  var init_sparkles = __esm({
    "node_modules/lucide-react/dist/esm/icons/sparkles.mjs"() {
      init_createLucideIcon();
      __iconData29 = {
        name: "sparkles",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
              key: "1s2grr"
            }
          ],
          ["path", { d: "M20 2v4", key: "1rf3ol" }],
          ["path", { d: "M22 4h-4", key: "gwowj6" }],
          ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
        ],
        aliases: ["stars"]
      };
      __iconData29.node;
      Sparkles = createLucideIcon(__iconData29);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/star.mjs
  var __iconData30, Star;
  var init_star = __esm({
    "node_modules/lucide-react/dist/esm/icons/star.mjs"() {
      init_createLucideIcon();
      __iconData30 = {
        name: "star",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
              key: "r04s7s"
            }
          ]
        ]
      };
      __iconData30.node;
      Star = createLucideIcon(__iconData30);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/trending-up.mjs
  var __iconData31, TrendingUp;
  var init_trending_up = __esm({
    "node_modules/lucide-react/dist/esm/icons/trending-up.mjs"() {
      init_createLucideIcon();
      __iconData31 = {
        name: "trending-up",
        size: 24,
        node: [
          ["path", { d: "M16 7h6v6", key: "box55l" }],
          ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
        ]
      };
      __iconData31.node;
      TrendingUp = createLucideIcon(__iconData31);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/user.mjs
  var __iconData32, User;
  var init_user = __esm({
    "node_modules/lucide-react/dist/esm/icons/user.mjs"() {
      init_createLucideIcon();
      __iconData32 = {
        name: "user",
        size: 24,
        node: [
          ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
          ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
        ]
      };
      __iconData32.node;
      User = createLucideIcon(__iconData32);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/utensils.mjs
  var __iconData33, Utensils;
  var init_utensils = __esm({
    "node_modules/lucide-react/dist/esm/icons/utensils.mjs"() {
      init_createLucideIcon();
      __iconData33 = {
        name: "utensils",
        size: 24,
        node: [
          ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", key: "cjf0a3" }],
          ["path", { d: "M7 2v20", key: "1473qp" }],
          ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", key: "j28e5" }]
        ],
        aliases: ["fork-knife"]
      };
      __iconData33.node;
      Utensils = createLucideIcon(__iconData33);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/video-off.mjs
  var __iconData34, VideoOff;
  var init_video_off = __esm({
    "node_modules/lucide-react/dist/esm/icons/video-off.mjs"() {
      init_createLucideIcon();
      __iconData34 = {
        name: "video-off",
        size: 24,
        node: [
          [
            "path",
            { d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196", key: "w8jjjt" }
          ],
          ["path", { d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2", key: "1xawa7" }],
          ["path", { d: "m2 2 20 20", key: "1ooewy" }]
        ]
      };
      __iconData34.node;
      VideoOff = createLucideIcon(__iconData34);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/video.mjs
  var __iconData35, Video;
  var init_video = __esm({
    "node_modules/lucide-react/dist/esm/icons/video.mjs"() {
      init_createLucideIcon();
      __iconData35 = {
        name: "video",
        size: 24,
        node: [
          [
            "path",
            {
              d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
              key: "ftymec"
            }
          ],
          ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
        ]
      };
      __iconData35.node;
      Video = createLucideIcon(__iconData35);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/volume-2.mjs
  var __iconData36, Volume2;
  var init_volume_2 = __esm({
    "node_modules/lucide-react/dist/esm/icons/volume-2.mjs"() {
      init_createLucideIcon();
      __iconData36 = {
        name: "volume-2",
        size: 24,
        node: [
          [
            "path",
            {
              d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
              key: "uqj9uw"
            }
          ],
          ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
          ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
        ]
      };
      __iconData36.node;
      Volume2 = createLucideIcon(__iconData36);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/wind.mjs
  var __iconData37, Wind;
  var init_wind = __esm({
    "node_modules/lucide-react/dist/esm/icons/wind.mjs"() {
      init_createLucideIcon();
      __iconData37 = {
        name: "wind",
        size: 24,
        node: [
          ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
          ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
          ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
        ]
      };
      __iconData37.node;
      Wind = createLucideIcon(__iconData37);
    }
  });

  // node_modules/lucide-react/dist/esm/icons/x.mjs
  var __iconData38, X;
  var init_x = __esm({
    "node_modules/lucide-react/dist/esm/icons/x.mjs"() {
      init_createLucideIcon();
      __iconData38 = {
        name: "x",
        size: 24,
        node: [
          ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
          ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
        ]
      };
      __iconData38.node;
      X = createLucideIcon(__iconData38);
    }
  });

  // node_modules/lucide-react/dist/esm/lucide-react.mjs
  var init_lucide_react = __esm({
    "node_modules/lucide-react/dist/esm/lucide-react.mjs"() {
      "use strict";
      init_circle_alert();
      init_circle_check();
      init_house();
      init_pen_line();
      init_sparkles();
      init_utensils();
      init_bell_ring();
      init_bell();
      init_book_open();
      init_calendar();
      init_droplet();
      init_file_text();
      init_flame();
      init_flower_2();
      init_globe();
      init_heart();
      init_mic_off();
      init_mic();
      init_moon();
      init_music();
      init_pause();
      init_phone();
      init_play();
      init_plus();
      init_save();
      init_search();
      init_send();
      init_settings();
      init_skip_back();
      init_skip_forward();
      init_star();
      init_trending_up();
      init_user();
      init_video_off();
      init_video();
      init_volume_2();
      init_wind();
      init_x();
    }
  });

  // src/components/Sidebar.jsx
  function Sidebar({ currentTab, setCurrentTab, lang = "en" }) {
    const navItems = [
      { id: "home", label: "Home", labelTa: "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1", icon: House },
      { id: "classes", label: "Yoga Classes", labelTa: "\u0BAF\u0BCB\u0B95\u0BBE \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", icon: Flower2 },
      { id: "live", label: "Live Classes", labelTa: "\u0BB2\u0BC8\u0BB5\u0BCD \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", icon: Video },
      { id: "reminders", label: "Reminders", labelTa: "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD", icon: Bell },
      { id: "notes", label: "Yoga Notes", labelTa: "\u0BAF\u0BCB\u0B95\u0BBE \u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", icon: FileText },
      { id: "attendance", label: "Attendance", labelTa: "\u0BB5\u0BB0\u0BC1\u0B95\u0BC8\u0BAA\u0BCD \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1", icon: Calendar },
      { id: "relaxation", label: "Relaxation", labelTa: "\u0BB0\u0BBF\u0BB2\u0BBE\u0B95\u0BCD\u0B9A\u0BC7\u0BB7\u0BA9\u0BCD", icon: Music },
      { id: "profile", label: "Profile", labelTa: "\u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD", icon: User }
    ];
    return /* @__PURE__ */ import_react4.default.createElement("aside", { className: "app-sidebar-nav" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "sidebar-brand-container", onClick: () => setCurrentTab("home") }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "brand-lotus-circle" }, /* @__PURE__ */ import_react4.default.createElement("svg", { viewBox: "0 0 24 24", className: "sidebar-lotus-svg" }, /* @__PURE__ */ import_react4.default.createElement("path", { d: "M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" }))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "brand-text-block" }, /* @__PURE__ */ import_react4.default.createElement("h1", { className: "brand-name-title" }, "NITHYA"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "brand-subtitle" }, "Yoga & Wellness"))), /* @__PURE__ */ import_react4.default.createElement("nav", { className: "sidebar-menu-list" }, navItems.map((item) => {
      const Icon2 = item.icon;
      const isActive = currentTab === item.id;
      return /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          key: item.id,
          type: "button",
          className: `sidebar-menu-item ${isActive ? "active" : ""}`,
          onClick: () => setCurrentTab(item.id)
        },
        /* @__PURE__ */ import_react4.default.createElement(Icon2, { size: 18, className: "menu-icon" }),
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "menu-label" }, lang === "ta" ? item.labelTa : item.label)
      );
    })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "sidebar-bottom-wellness-card" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "bottom-card-bg-overlay" }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bottom-card-content" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "bottom-card-lotus" }, /* @__PURE__ */ import_react4.default.createElement("svg", { viewBox: "0 0 24 24", className: "lotus-tiny-svg" }, /* @__PURE__ */ import_react4.default.createElement("path", { d: "M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" }))), /* @__PURE__ */ import_react4.default.createElement("p", { className: "bottom-card-quote" }, lang === "ta" ? "\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0BA9 \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BC7 \u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BBE\u0BA9 \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD..." : "A healthier you is a happier you..."), /* @__PURE__ */ import_react4.default.createElement("span", { className: "bottom-card-heart" }, "\u2661"))));
  }
  var import_react4;
  var init_Sidebar = __esm({
    "src/components/Sidebar.jsx"() {
      import_react4 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/Header.jsx
  function Header({
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
    lang,
    setLang,
    user,
    onOpenNotifications,
    onTestSound
  }) {
    return /* @__PURE__ */ import_react5.default.createElement("header", { className: "dashboard-top-header" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "header-search-wrapper" }, /* @__PURE__ */ import_react5.default.createElement(Search, { size: 16, className: "search-icon-left" }), /* @__PURE__ */ import_react5.default.createElement(
      "input",
      {
        type: "text",
        className: "header-search-input",
        placeholder: lang === "ta" ? "\u0BA4\u0BC7\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD (\u0BAF\u0BCB\u0B95\u0BBE, \u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD, \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD)..." : "Search anything...",
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value)
      }
    ), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "search-submit-btn", "aria-label": "Search" }, /* @__PURE__ */ import_react5.default.createElement(Search, { size: 14 }))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "header-tools-cluster" }, /* @__PURE__ */ import_react5.default.createElement(
      "button",
      {
        type: "button",
        className: "header-tool-btn lang-pill-btn",
        onClick: () => setLang(lang === "ta" ? "en" : "ta"),
        title: "Toggle Language"
      },
      /* @__PURE__ */ import_react5.default.createElement(Globe, { size: 15 }),
      /* @__PURE__ */ import_react5.default.createElement("span", { className: "lang-text-short" }, lang === "ta" ? "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD" : "EN")
    ), /* @__PURE__ */ import_react5.default.createElement(
      "button",
      {
        type: "button",
        className: "header-tool-btn",
        onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
        title: "Toggle Theme"
      },
      /* @__PURE__ */ import_react5.default.createElement(Sparkles, { size: 17, className: "sparkle-icon" })
    ), /* @__PURE__ */ import_react5.default.createElement(
      "button",
      {
        type: "button",
        className: "header-tool-btn notif-bell-btn",
        onClick: onTestSound,
        title: "Notifications"
      },
      /* @__PURE__ */ import_react5.default.createElement(Bell, { size: 17 }),
      /* @__PURE__ */ import_react5.default.createElement("span", { className: "red-notification-dot" })
    ), /* @__PURE__ */ import_react5.default.createElement("div", { className: "header-user-badge" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "user-avatar-circle" }, user.avatar ? /* @__PURE__ */ import_react5.default.createElement("img", { src: user.avatar, alt: user.name }) : /* @__PURE__ */ import_react5.default.createElement("span", null, user.name.charAt(0))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "user-greeting-meta" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "welcome-tag" }, lang === "ta" ? "\u0BB5\u0BA3\u0B95\u0BCD\u0B95\u0BAE\u0BCD," : "Welcome,"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "user-name-bold" }, user.name)))));
  }
  var import_react5;
  var init_Header = __esm({
    "src/components/Header.jsx"() {
      import_react5 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/HeroSection.jsx
  function HeroSection({
    user,
    onJoinLive,
    onViewSchedule,
    lang = "en"
  }) {
    return /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-section-grid" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-banner-card" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-banner-bg" }, /* @__PURE__ */ import_react6.default.createElement(
      "img",
      {
        src: "assets/images/hero-yoga.jpg",
        alt: "Yoga & Wellness Meditation",
        className: "hero-img-cover"
      }
    ), /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-gradient-overlay" })), /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-floating-quote" }, /* @__PURE__ */ import_react6.default.createElement("span", null, "Good"), /* @__PURE__ */ import_react6.default.createElement("span", { className: "heart-icon" }, "\u2661"), /* @__PURE__ */ import_react6.default.createElement("br", null), /* @__PURE__ */ import_react6.default.createElement("span", null, "Vibes"), /* @__PURE__ */ import_react6.default.createElement("br", null), /* @__PURE__ */ import_react6.default.createElement("span", { className: "script-only" }, "Only")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-content-body" }, /* @__PURE__ */ import_react6.default.createElement("h2", { className: "hero-headline-title" }, /* @__PURE__ */ import_react6.default.createElement("span", null, "Move \u2022 Breathe \u2022"), /* @__PURE__ */ import_react6.default.createElement("br", null), /* @__PURE__ */ import_react6.default.createElement("span", null, "Remember \u2022 Relax")), /* @__PURE__ */ import_react6.default.createElement("p", { className: "hero-supporting-sub" }, lang === "ta" ? "\u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 \u0BA8\u0BBE\u0BB3\u0BC1\u0BAE\u0BCD \u0B8E\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF \u0B85\u0B9F\u0BBF\u0B95\u0BB3\u0BCD, \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BBE\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD." : "Small steps every day lead to a healthier and happier you."), /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-cta-buttons-row" }, /* @__PURE__ */ import_react6.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-hero-primary",
        onClick: onJoinLive
      },
      /* @__PURE__ */ import_react6.default.createElement("span", { className: "btn-play-circle" }, "\u25B6"),
      /* @__PURE__ */ import_react6.default.createElement("span", null, lang === "ta" ? "\u0BB2\u0BC8\u0BB5\u0BCD \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0BB2\u0BCD \u0B87\u0BA3\u0BC8\u0B95" : "Join Live Class")
    ), /* @__PURE__ */ import_react6.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-hero-secondary",
        onClick: onViewSchedule
      },
      /* @__PURE__ */ import_react6.default.createElement(Calendar, { size: 16 }),
      /* @__PURE__ */ import_react6.default.createElement("span", null, lang === "ta" ? "\u0B87\u0BA9\u0BCD\u0BB1\u0BC8\u0BAF \u0B85\u0B9F\u0BCD\u0B9F\u0BB5\u0BA3\u0BC8" : "View Today's Schedule")
    )))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "hero-user-stat-card" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "user-profile-header-mini" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "user-round-avatar" }, /* @__PURE__ */ import_react6.default.createElement("span", null, user.name.charAt(0))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "user-heading-meta" }, /* @__PURE__ */ import_react6.default.createElement("h3", { className: "user-greeting-name" }, lang === "ta" ? `\u0BB5\u0BA3\u0B95\u0BCD\u0B95\u0BAE\u0BCD, ${user.name}` : `Hello, ${user.name}`), /* @__PURE__ */ import_react6.default.createElement("p", { className: "user-subtitle-care" }, lang === "ta" ? "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B87\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Stay consistent. Stay healthy."))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "user-stats-2x2-grid" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-box tile-teal" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-icon-wrap teal-bg" }, /* @__PURE__ */ import_react6.default.createElement(Flower2, { size: 18, className: "text-teal" })), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-text" }, /* @__PURE__ */ import_react6.default.createElement("strong", { className: "stat-number" }, user.classesAttended || 12), /* @__PURE__ */ import_react6.default.createElement("span", { className: "stat-label" }, lang === "ta" ? "\u0B95\u0BB2\u0BA8\u0BCD\u0BA4\u0BC1\u0B95\u0BCA\u0BA3\u0BCD\u0B9F \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD" : "Classes Attended"))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-box tile-blue" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-icon-wrap blue-bg" }, /* @__PURE__ */ import_react6.default.createElement(Calendar, { size: 18, className: "text-blue" })), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-text" }, /* @__PURE__ */ import_react6.default.createElement("strong", { className: "stat-number" }, user.attendanceRate || 85, "%"), /* @__PURE__ */ import_react6.default.createElement("span", { className: "stat-label" }, lang === "ta" ? "\u0BB5\u0BB0\u0BC1\u0B95\u0BC8 \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BAE\u0BCD" : "Attendance Rate"))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-box tile-orange" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-icon-wrap orange-bg" }, /* @__PURE__ */ import_react6.default.createElement(Flame, { size: 18, className: "text-orange" })), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-text" }, /* @__PURE__ */ import_react6.default.createElement("strong", { className: "stat-number" }, user.dayStreak || 7), /* @__PURE__ */ import_react6.default.createElement("span", { className: "stat-label" }, lang === "ta" ? "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD \u0BA8\u0BBE\u0B9F\u0BCD\u0B95\u0BB3\u0BCD" : "Day Streak"))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-box tile-gold" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-icon-wrap gold-bg" }, /* @__PURE__ */ import_react6.default.createElement(Star, { size: 18, className: "text-gold" })), /* @__PURE__ */ import_react6.default.createElement("div", { className: "stat-tile-text" }, /* @__PURE__ */ import_react6.default.createElement("strong", { className: "stat-number" }, user.level || "Beginner"), /* @__PURE__ */ import_react6.default.createElement("span", { className: "stat-label" }, lang === "ta" ? "\u0BA8\u0BBF\u0BB2\u0BC8" : "Level"))))));
  }
  var import_react6;
  var init_HeroSection = __esm({
    "src/components/HeroSection.jsx"() {
      import_react6 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/utils/audioEngine.js
  var SoundEngine, audioEngine;
  var init_audioEngine = __esm({
    "src/utils/audioEngine.js"() {
      SoundEngine = class {
        constructor() {
          this.ctx = null;
          this.volume = 0.9;
          this.activeAmbience = null;
        }
        init() {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
              this.ctx = new AudioContext();
            }
          }
          if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
          }
          return this.ctx;
        }
        setVolume(vol) {
          this.volume = Math.max(0, Math.min(1, vol));
        }
        // Play Gentle Bell / Chime
        playGentleBell() {
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.7, now);
            gain.gain.exponentialRampToValueAtTime(1e-4, now + 2.5);
            gain.connect(ctx.destination);
            [587.33, 880, 1174.66].forEach((freq) => {
              const osc = ctx.createOscillator();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, now);
              osc.connect(gain);
              osc.start(now);
              osc.stop(now + 2.5);
            });
          } catch (e) {
            console.warn("Audio play error:", e);
          }
        }
        // Loud Resounding Temple Bell / Gong
        playTempleBell() {
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.95, now);
            gain.gain.exponentialRampToValueAtTime(1e-4, now + 4.2);
            gain.connect(ctx.destination);
            [216, 432, 648, 864, 1296].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq + idx * 1.5, now);
              osc.connect(gain);
              osc.start(now);
              osc.stop(now + 4.2);
            });
          } catch (e) {
            console.warn("Audio play error:", e);
          }
        }
        // Tibetan Singing Bowl Chime (528 Hz Love/DNA frequency)
        playSingingBowl() {
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.85, now);
            gain.gain.exponentialRampToValueAtTime(1e-4, now + 3.8);
            gain.connect(ctx.destination);
            [528, 1056, 1584].forEach((freq) => {
              const osc = ctx.createOscillator();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, now);
              osc.connect(gain);
              osc.start(now);
              osc.stop(now + 3.8);
            });
          } catch (e) {
            console.warn("Audio play error:", e);
          }
        }
        // High Electronic Beep
        playElectronicBeep() {
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.9, now);
            gain.connect(ctx.destination);
            const osc = ctx.createOscillator();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(1320, now + 0.12);
            osc.connect(gain);
            osc.start(now);
            gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.45);
            osc.stop(now + 0.45);
          } catch (e) {
            console.warn("Audio play error:", e);
          }
        }
        // Solfeggio frequency tone for Chakras
        playFrequency(freq, duration = 2.5) {
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.75, now);
            gain.gain.exponentialRampToValueAtTime(1e-4, now + duration);
            gain.connect(ctx.destination);
            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + duration);
          } catch (e) {
            console.warn("Frequency play error:", e);
          }
        }
        // Ambient sound generator for Relaxation Zone
        startAmbient(soundId) {
          this.stopAmbient();
          try {
            const ctx = this.init();
            if (!ctx) return;
            const now = ctx.currentTime;
            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(1e-3, now);
            masterGain.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 1.5);
            masterGain.connect(ctx.destination);
            const nodes = [];
            if (soundId === "om" || soundId === "meditation") {
              const osc = ctx.createOscillator();
              osc.type = "sawtooth";
              osc.frequency.setValueAtTime(136.1, now);
              const filter = ctx.createBiquadFilter();
              filter.type = "lowpass";
              filter.frequency.setValueAtTime(260, now);
              osc.connect(filter);
              filter.connect(masterGain);
              osc.start(now);
              nodes.push(osc);
            } else if (soundId === "bowl" || soundId === "music") {
              [432, 864].forEach((f) => {
                const osc = ctx.createOscillator();
                osc.type = "sine";
                osc.frequency.setValueAtTime(f, now);
                osc.connect(masterGain);
                osc.start(now);
                nodes.push(osc);
              });
            } else if (soundId === "rain" || soundId === "sleep") {
              const bufferSize = ctx.sampleRate * 2;
              const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
              }
              const whiteNoise = ctx.createBufferSource();
              whiteNoise.buffer = noiseBuffer;
              whiteNoise.loop = true;
              const filter = ctx.createBiquadFilter();
              filter.type = "bandpass";
              filter.frequency.setValueAtTime(800, now);
              filter.Q.setValueAtTime(0.7, now);
              whiteNoise.connect(filter);
              filter.connect(masterGain);
              whiteNoise.start(now);
              nodes.push(whiteNoise);
            }
            this.activeAmbience = { masterGain, nodes };
          } catch (e) {
            console.warn("Ambient error:", e);
          }
        }
        stopAmbient() {
          if (this.activeAmbience && this.ctx) {
            try {
              const { masterGain, nodes } = this.activeAmbience;
              const now = this.ctx.currentTime;
              masterGain.gain.exponentialRampToValueAtTime(1e-4, now + 0.6);
              setTimeout(() => {
                nodes.forEach((n) => {
                  try {
                    n.stop();
                  } catch (_) {
                  }
                });
              }, 700);
            } catch (_) {
            }
            this.activeAmbience = null;
          }
        }
        playSoundByType(type) {
          if (type === "Singing Bowl" || type === "singing-bowl") {
            this.playSingingBowl();
          } else if (type === "Temple Bell" || type === "temple-bell" || type === "Loud Bell") {
            this.playTempleBell();
          } else if (type === "Electronic Beep" || type === "electronic-beep") {
            this.playElectronicBeep();
          } else {
            this.playGentleBell();
          }
        }
      };
      audioEngine = new SoundEngine();
    }
  });

  // src/components/SmartCareTimeline.jsx
  function SmartCareTimeline({
    reminders,
    onToggleComplete,
    onDeleteReminder,
    onShowAll,
    lang = "en"
  }) {
    const defaultCareCards = [
      {
        id: "rem-yoga-1",
        title: "Next Yoga Class",
        titleTa: "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BAF\u0BCB\u0B95\u0BBE \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
        time: "6:00 PM",
        category: "Yoga",
        message: "Keep going! You're doing great! \u{1F49C}",
        messageTa: "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD! \u{1F49C}",
        themeClass: "care-card-purple",
        icon: Flower2,
        iconColor: "purple"
      },
      {
        id: "rem-water-1",
        title: "Water Reminder",
        titleTa: "\u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
        time: "5:30 PM",
        category: "Water",
        message: "Drink water... Stay fresh! \u{1F4A7}",
        messageTa: "\u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0B95\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD... \u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BA3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BC1\u0B9F\u0BA9\u0BCD \u0B87\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u{1F4A7}",
        themeClass: "care-card-cyan",
        icon: Droplet,
        iconColor: "cyan"
      },
      {
        id: "rem-meal-1",
        title: "Meal Reminder",
        titleTa: "\u0B89\u0BA3\u0BB5\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
        time: "1:00 PM",
        category: "Meal",
        message: "Healthy food = Happy you! \u{1F957}",
        messageTa: "\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B89\u0BA3\u0BB5\u0BC1 = \u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BBE\u0BA9 \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u{1F957}",
        themeClass: "care-card-yellow",
        icon: Utensils,
        iconColor: "yellow"
      },
      {
        id: "rem-call-1",
        title: "Call Reminder",
        titleTa: "\u0B85\u0BB4\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
        time: "7:00 PM",
        category: "Call",
        message: "Don't forget to call your loved ones. \u{1F4DE}",
        messageTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BA9\u0BCD\u0BAA\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB0\u0BBF\u0BAF\u0BB5\u0BB0\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0BB4\u0BC8\u0B95\u0BCD\u0B95 \u0BAE\u0BB1\u0B95\u0BCD\u0B95\u0BBE\u0BA4\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD. \u{1F4DE}",
        themeClass: "care-card-green",
        icon: Phone,
        iconColor: "green"
      },
      {
        id: "rem-care-1",
        title: "Personal Care",
        titleTa: "\u0B9A\u0BC1\u0BAF \u0BAA\u0BB0\u0BBE\u0BAE\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
        time: "9:00 PM",
        category: "Personal Care",
        message: "Take care of yourself. You matter! \u{1F495}",
        messageTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BB5\u0BA9\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BCD! \u{1F495}",
        themeClass: "care-card-pink",
        icon: Heart,
        iconColor: "pink"
      }
    ];
    const allCards = reminders && reminders.length > 0 ? reminders.slice(0, 5).map((r, idx) => ({
      ...r,
      themeClass: idx === 0 ? "care-card-purple" : idx === 1 ? "care-card-cyan" : idx === 2 ? "care-card-yellow" : idx === 3 ? "care-card-green" : "care-card-pink",
      icon: r.category === "Water" ? Droplet : r.category === "Meal" ? Utensils : r.category === "Call" ? Phone : r.category === "Personal Care" ? Heart : Flower2,
      iconColor: idx === 0 ? "purple" : idx === 1 ? "cyan" : idx === 2 ? "yellow" : idx === 3 ? "green" : "pink"
    })) : defaultCareCards;
    return /* @__PURE__ */ import_react7.default.createElement("section", { className: "dashboard-section today-reminders-section" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "section-title-bar" }, /* @__PURE__ */ import_react7.default.createElement("h3", { className: "section-heading-with-icon" }, /* @__PURE__ */ import_react7.default.createElement(Calendar, { size: 18, className: "text-violet" }), /* @__PURE__ */ import_react7.default.createElement("span", null, lang === "ta" ? "\u0B87\u0BA9\u0BCD\u0BB1\u0BC8\u0BAF \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD\u0B95\u0BB3\u0BCD" : "Today's Reminders")), /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        type: "button",
        className: "link-view-all",
        onClick: onShowAll
      },
      lang === "ta" ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u2192" : "View All \u2192"
    )), /* @__PURE__ */ import_react7.default.createElement("div", { className: "reminders-carousel-row" }, allCards.map((card) => {
      const IconComponent = card.icon || Flower2;
      return /* @__PURE__ */ import_react7.default.createElement(
        "div",
        {
          key: card.id,
          className: `reminder-pastel-card ${card.themeClass} ${card.completed ? "is-completed" : ""}`,
          onClick: () => onToggleComplete && onToggleComplete(card.id)
        },
        /* @__PURE__ */ import_react7.default.createElement("div", { className: "card-top-icon-badge" }, /* @__PURE__ */ import_react7.default.createElement(IconComponent, { size: 20, className: `icon-care-${card.iconColor}` })),
        /* @__PURE__ */ import_react7.default.createElement("div", { className: "card-inner-info" }, /* @__PURE__ */ import_react7.default.createElement("h4", { className: "care-card-title" }, lang === "ta" && card.titleTa ? card.titleTa : card.title), /* @__PURE__ */ import_react7.default.createElement("div", { className: "care-card-time-row" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "care-time-text" }, card.time)), /* @__PURE__ */ import_react7.default.createElement("p", { className: "care-card-quote-text" }, lang === "ta" && card.messageTa ? card.messageTa : card.message)),
        card.completed && /* @__PURE__ */ import_react7.default.createElement("div", { className: "completed-check-tag" }, "\u2713 Done")
      );
    })));
  }
  var import_react7;
  var init_SmartCareTimeline = __esm({
    "src/components/SmartCareTimeline.jsx"() {
      import_react7 = __toESM(require_react());
      init_lucide_react();
      init_audioEngine();
    }
  });

  // src/components/YogaClassesSection.jsx
  function YogaClassesSection({ onSelectClass, onShowAll, lang = "en" }) {
    const [activeFilter, setActiveFilter] = (0, import_react8.useState)("All");
    const classesList = [
      {
        id: "cls-1",
        title: "Hatha Yoga",
        titleTa: "\u0BB9\u0BA4 \u0BAF\u0BCB\u0B95\u0BBE",
        duration: "60 min",
        level: "Beginner",
        levelTa: "\u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95\u0BA8\u0BBF\u0BB2\u0BC8",
        instructor: "Priya",
        instructorTa: "\u0BAA\u0BBF\u0BB0\u0BBF\u0BAF\u0BBE",
        desc: "Build flexibility and balance.",
        descTa: "\u0BA8\u0BC6\u0B95\u0BBF\u0BB4\u0BCD\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B9A\u0BAE\u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        img: "assets/images/class-thumb.jpg"
      },
      {
        id: "cls-2",
        title: "Vinyasa Flow",
        titleTa: "\u0BB5\u0BBF\u0BA9\u0BCD\u0BAF\u0BBE\u0B9A\u0BBE \u0B83\u0BAA\u0BCD\u0BB3\u0BCB",
        duration: "60 min",
        level: "Intermediate",
        levelTa: "\u0B87\u0B9F\u0BC8\u0BA8\u0BBF\u0BB2\u0BC8",
        instructor: "Anu",
        instructorTa: "\u0B85\u0BA9\u0BC1",
        desc: "Improve strength and stamina.",
        descTa: "\u0BB5\u0BB2\u0BBF\u0BAE\u0BC8\u0BAF\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B9A\u0B95\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0BAE\u0BC7\u0BAE\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        img: "assets/images/class-thumb.jpg"
      },
      {
        id: "cls-3",
        title: "Power Yoga",
        titleTa: "\u0BAA\u0BB5\u0BB0\u0BCD \u0BAF\u0BCB\u0B95\u0BBE",
        duration: "75 min",
        level: "Advanced",
        levelTa: "\u0BAE\u0BC1\u0BA4\u0BBF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0BA8\u0BBF\u0BB2\u0BC8",
        instructor: "Meena",
        instructorTa: "\u0BAE\u0BC0\u0BA9\u0BBE",
        desc: "Boost energy and focus.",
        descTa: "\u0B86\u0BB1\u0BCD\u0BB1\u0BB2\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B95\u0BB5\u0BA9\u0BA4\u0BCD\u0BA4\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B85\u0BA4\u0BBF\u0B95\u0BB0\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
        img: "assets/images/class-thumb.jpg"
      },
      {
        id: "cls-4",
        title: "Yin Yoga",
        titleTa: "\u0BAF\u0BBF\u0BA9\u0BCD \u0BAF\u0BCB\u0B95\u0BBE",
        duration: "50 min",
        level: "All Levels",
        levelTa: "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BA8\u0BBF\u0BB2\u0BC8\u0B95\u0BB3\u0BC1\u0BAE\u0BCD",
        instructor: "Lakshmi",
        instructorTa: "\u0BB2\u0B9F\u0BCD\u0B9A\u0BC1\u0BAE\u0BBF",
        desc: "Deep relaxation and flexibility.",
        descTa: "\u0B86\u0BB4\u0BCD\u0BA8\u0BCD\u0BA4 \u0B93\u0BAF\u0BCD\u0BB5\u0BC1\u0BAE\u0BCD \u0BA8\u0BC6\u0B95\u0BBF\u0BB4\u0BCD\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD.",
        img: "assets/images/class-thumb.jpg"
      }
    ];
    const filterTabs = ["All", "Beginner", "Intermediate", "Advanced"];
    const filtered = classesList.filter((c) => {
      if (activeFilter === "All") return true;
      return c.level.toLowerCase() === activeFilter.toLowerCase();
    });
    return /* @__PURE__ */ import_react8.default.createElement("div", { className: "dashboard-card yoga-classes-card" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "card-header-row" }, /* @__PURE__ */ import_react8.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react8.default.createElement(Flower2, { size: 18, className: "text-violet" }), /* @__PURE__ */ import_react8.default.createElement("span", null, lang === "ta" ? "\u0BAF\u0BCB\u0B95\u0BBE \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD" : "Yoga Classes")), /* @__PURE__ */ import_react8.default.createElement(
      "button",
      {
        type: "button",
        className: "link-view-all",
        onClick: onShowAll
      },
      lang === "ta" ? "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u2192" : "View All \u2192"
    )), /* @__PURE__ */ import_react8.default.createElement("div", { className: "pill-filters-row" }, filterTabs.map((tab) => /* @__PURE__ */ import_react8.default.createElement(
      "button",
      {
        key: tab,
        type: "button",
        className: `filter-pill-btn ${activeFilter === tab ? "active" : ""}`,
        onClick: () => setActiveFilter(tab)
      },
      tab
    ))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "classes-items-stack" }, filtered.map((item) => /* @__PURE__ */ import_react8.default.createElement("div", { key: item.id, className: "class-row-item" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "class-thumb-wrap" }, /* @__PURE__ */ import_react8.default.createElement("img", { src: item.img, alt: item.title, className: "class-thumb-img" })), /* @__PURE__ */ import_react8.default.createElement("div", { className: "class-meta-center" }, /* @__PURE__ */ import_react8.default.createElement("h4", { className: "class-item-title" }, lang === "ta" && item.titleTa ? item.titleTa : item.title), /* @__PURE__ */ import_react8.default.createElement("div", { className: "class-item-tags" }, /* @__PURE__ */ import_react8.default.createElement("span", { className: "tag-meta" }, "\u23F1 ", item.duration), /* @__PURE__ */ import_react8.default.createElement("span", { className: "bullet-sep" }, "\u2022"), /* @__PURE__ */ import_react8.default.createElement("span", { className: "tag-meta" }, "\u{1F464} ", lang === "ta" && item.levelTa ? item.levelTa : item.level), /* @__PURE__ */ import_react8.default.createElement("span", { className: "bullet-sep" }, "\u2022"), /* @__PURE__ */ import_react8.default.createElement("span", { className: "tag-meta" }, "\u{1F464} ", lang === "ta" && item.instructorTa ? item.instructorTa : item.instructor)), /* @__PURE__ */ import_react8.default.createElement("p", { className: "class-item-desc" }, lang === "ta" && item.descTa ? item.descTa : item.desc)), /* @__PURE__ */ import_react8.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-join-live-pill",
        onClick: () => onSelectClass && onSelectClass(item)
      },
      lang === "ta" ? "\u0B87\u0BA3\u0BC8\u0BAF\u0BB5\u0BC1\u0BAE\u0BCD" : "Join Live"
    )))));
  }
  var import_react8;
  var init_YogaClassesSection = __esm({
    "src/components/YogaClassesSection.jsx"() {
      import_react8 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/LiveClassStudio.jsx
  function LiveClassStudio({
    activeClass,
    onLeaveClass,
    lang = "en"
  }) {
    const [isMicOn, setIsMicOn] = (0, import_react9.useState)(true);
    const [isVideoOn, setIsVideoOn] = (0, import_react9.useState)(true);
    const [isPaused, setIsPaused] = (0, import_react9.useState)(false);
    const [chatInput, setChatInput] = (0, import_react9.useState)("");
    const [messages, setMessages] = (0, import_react9.useState)([
      { id: 1, sender: "Meena", text: "This is so relaxing! \u{1F49C}", time: "10:24 AM" },
      { id: 2, sender: "Karthik", text: "Nice breathing technique!", time: "10:26 AM" },
      { id: 3, sender: "You", text: "Feeling so relaxed \u{1F60A}", time: "10:34 AM" }
    ]);
    const participants = [
      { id: 1, name: "Teacher (Host)", role: "Host", isHost: true },
      { id: 2, name: "You", role: "Student" },
      { id: 3, name: "Meena", role: "Student" },
      { id: 4, name: "Karthik", role: "Student" },
      { id: 5, name: "Divya", role: "Student" },
      { id: 6, name: "Ravi", role: "Student" }
    ];
    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "You",
          text: chatInput.trim(),
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setChatInput("");
    };
    return /* @__PURE__ */ import_react9.default.createElement("div", { className: "dashboard-card live-class-card" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "card-header-row live-header-row" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "live-title-group" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "live-pulse-icon" }, "((\u2022))"), /* @__PURE__ */ import_react9.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react9.default.createElement("span", null, lang === "ta" ? "\u0BB2\u0BC8\u0BB5\u0BCD \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1" : "Live Class"))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "live-header-actions" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "live-status-badge" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "green-dot-pulse" }, "\u25CF"), /* @__PURE__ */ import_react9.default.createElement("span", null, "Live")), /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", className: "btn-icon-square", title: "Add participant" }, /* @__PURE__ */ import_react9.default.createElement(Plus, { size: 14 })))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "live-video-screen" }, /* @__PURE__ */ import_react9.default.createElement(
      "img",
      {
        src: "assets/images/live-class.jpg",
        alt: "Live Yoga Stream",
        className: "live-video-bg-img"
      }
    ), /* @__PURE__ */ import_react9.default.createElement("div", { className: "video-timer-badge" }, /* @__PURE__ */ import_react9.default.createElement("span", null, "00:32:16"), /* @__PURE__ */ import_react9.default.createElement("span", { className: "red-record-dot" }, "\u{1F534}")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "video-bottom-controls-bar" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "controls-left-icons" }, /* @__PURE__ */ import_react9.default.createElement(
      "button",
      {
        type: "button",
        className: "ctrl-btn",
        onClick: () => setIsPaused(!isPaused),
        title: isPaused ? "Play" : "Pause"
      },
      isPaused ? /* @__PURE__ */ import_react9.default.createElement(Play, { size: 15 }) : /* @__PURE__ */ import_react9.default.createElement(Pause, { size: 15 })
    ), /* @__PURE__ */ import_react9.default.createElement(
      "button",
      {
        type: "button",
        className: `ctrl-btn ${!isMicOn ? "muted" : ""}`,
        onClick: () => setIsMicOn(!isMicOn),
        title: "Toggle Mic"
      },
      isMicOn ? /* @__PURE__ */ import_react9.default.createElement(Mic, { size: 15 }) : /* @__PURE__ */ import_react9.default.createElement(MicOff, { size: 15 })
    ), /* @__PURE__ */ import_react9.default.createElement(
      "button",
      {
        type: "button",
        className: `ctrl-btn ${!isVideoOn ? "muted" : ""}`,
        onClick: () => setIsVideoOn(!isVideoOn),
        title: "Toggle Video"
      },
      isVideoOn ? /* @__PURE__ */ import_react9.default.createElement(Video, { size: 15 }) : /* @__PURE__ */ import_react9.default.createElement(VideoOff, { size: 15 })
    ), /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", className: "ctrl-btn", title: "Settings" }, /* @__PURE__ */ import_react9.default.createElement(Settings, { size: 15 }))), /* @__PURE__ */ import_react9.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-leave-class-pill",
        onClick: onLeaveClass
      },
      lang === "ta" ? "\u0BB5\u0BC6\u0BB3\u0BBF\u0BAF\u0BC7\u0BB1\u0BC1" : "Leave Class"
    ))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "live-split-footer" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "participants-col" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "split-col-header" }, /* @__PURE__ */ import_react9.default.createElement("h4", null, lang === "ta" ? "\u0BAA\u0B99\u0BCD\u0B95\u0BC7\u0BB1\u0BCD\u0BAA\u0BBE\u0BB3\u0BB0\u0BCD\u0B95\u0BB3\u0BCD (12)" : "Participants (12)")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "participants-list-scroll" }, participants.map((p) => /* @__PURE__ */ import_react9.default.createElement("div", { key: p.id, className: "participant-item-row" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "participant-info" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "participant-name" }, p.name)), /* @__PURE__ */ import_react9.default.createElement("span", { className: "online-green-indicator" }, "\u25CF"))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "more-participants-label" }, "+7 more"))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "chat-col" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "split-col-header" }, /* @__PURE__ */ import_react9.default.createElement("h4", null, lang === "ta" ? "\u0B85\u0BB0\u0B9F\u0BCD\u0B9F\u0BC8" : "Chat")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "chat-messages-scroll" }, messages.map((m) => /* @__PURE__ */ import_react9.default.createElement("div", { key: m.id, className: "chat-message-bubble" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "chat-sender-name" }, m.sender, ":"), /* @__PURE__ */ import_react9.default.createElement("span", { className: "chat-text-content" }, m.text)))), /* @__PURE__ */ import_react9.default.createElement("form", { onSubmit: handleSendMessage, className: "chat-input-form-bar" }, /* @__PURE__ */ import_react9.default.createElement(
      "input",
      {
        type: "text",
        placeholder: lang === "ta" ? "\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BCD\u0B9F\u0B9A\u0BCD\u0B9A\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95..." : "Type a message...",
        value: chatInput,
        onChange: (e) => setChatInput(e.target.value)
      }
    ), /* @__PURE__ */ import_react9.default.createElement("button", { type: "submit", className: "chat-send-btn", "aria-label": "Send" }, /* @__PURE__ */ import_react9.default.createElement(Send, { size: 13 }))))));
  }
  var import_react9;
  var init_LiveClassStudio = __esm({
    "src/components/LiveClassStudio.jsx"() {
      import_react9 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/QuickAddReminderCard.jsx
  function QuickAddReminderCard({ onAddReminder, lang = "en" }) {
    const [title, setTitle] = (0, import_react10.useState)("");
    const [date, setDate] = (0, import_react10.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const [time, setTime] = (0, import_react10.useState)("08:00 AM");
    const [message, setMessage] = (0, import_react10.useState)("");
    const [repeat, setRepeat] = (0, import_react10.useState)("Daily");
    const [sound, setSound] = (0, import_react10.useState)("Gentle Bell");
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim()) return;
      onAddReminder({
        id: `rem-${Date.now()}`,
        title: title.trim(),
        date,
        time,
        message: message.trim() || (lang === "ta" ? "\u0B89\u0B9F\u0BAE\u0BCD\u0BAA\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0BAE\u0BA9\u0B9A\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0BA8\u0BB2\u0BCD\u0BB2\u0BBE \u0B95\u0BB5\u0BA9\u0BBF\u0B9A\u0BCD\u0B9A\u0BC1\u0B95\u0BCD\u0B95\u0BCB\u0B99\u0BCD\u0B95 \u2764\uFE0F" : "Take care of your health & mind \u2764\uFE0F"),
        repeat,
        sound,
        category: title.toLowerCase().includes("water") ? "Water" : title.toLowerCase().includes("meal") || title.toLowerCase().includes("food") ? "Meal" : title.toLowerCase().includes("yoga") ? "Yoga" : title.toLowerCase().includes("call") ? "Call" : "Personal Care",
        enabled: true,
        completed: false
      });
      setTitle("");
      setMessage("");
    };
    const handleTestSound = () => {
      audioEngine.playSoundByType(sound);
    };
    return /* @__PURE__ */ import_react10.default.createElement("div", { className: "dashboard-card quick-add-card" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "card-header-row" }, /* @__PURE__ */ import_react10.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "icon-blue-plus" }, "\u2795"), /* @__PURE__ */ import_react10.default.createElement("span", null, lang === "ta" ? "\u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD" : "Quick Add Reminder"))), /* @__PURE__ */ import_react10.default.createElement("form", { onSubmit: handleSubmit, className: "quick-add-form" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0B8E\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0BB1\u0BCD\u0BB1\u0BBF \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD?" : "What do you want to remind about?"), /* @__PURE__ */ import_react10.default.createElement(
      "input",
      {
        type: "text",
        className: "input-field-custom",
        placeholder: lang === "ta" ? "\u0B8E.\u0B95\u0BBE. \u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0B95\u0BC1\u0B9F\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD" : "e.g. Drink water",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        required: true
      }
    )), /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-grid-2col" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0BA4\u0BC7\u0BA4\u0BBF" : "Date"), /* @__PURE__ */ import_react10.default.createElement("div", { className: "input-with-icon" }, /* @__PURE__ */ import_react10.default.createElement(
      "input",
      {
        type: "date",
        className: "input-field-custom",
        value: date,
        onChange: (e) => setDate(e.target.value)
      }
    ))), /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0BA8\u0BC7\u0BB0\u0BAE\u0BCD" : "Time"), /* @__PURE__ */ import_react10.default.createElement("div", { className: "input-with-icon" }, /* @__PURE__ */ import_react10.default.createElement(
      "input",
      {
        type: "text",
        className: "input-field-custom",
        placeholder: "08:00 AM",
        value: time,
        onChange: (e) => setTime(e.target.value)
      }
    )))), /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0B85\u0B95\u0BCD\u0B95\u0BB1\u0BC8 \u0BB5\u0BBE\u0B9A\u0B95\u0BAE\u0BCD (\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BC7\u0BB0\u0BCD\u0BB5\u0BC1)" : "Message (Optional)"), /* @__PURE__ */ import_react10.default.createElement(
      "input",
      {
        type: "text",
        className: "input-field-custom",
        placeholder: lang === "ta" ? "\u0B92\u0BB0\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF \u0B8E\u0BB4\u0BC1\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD..." : "Write a message...",
        value: message,
        onChange: (e) => setMessage(e.target.value)
      }
    )), /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-grid-2col" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD" : "Repeat"), /* @__PURE__ */ import_react10.default.createElement(
      "select",
      {
        className: "select-field-custom",
        value: repeat,
        onChange: (e) => setRepeat(e.target.value)
      },
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Daily" }, lang === "ta" ? "\u0BA4\u0BBF\u0BA9\u0BAE\u0BC1\u0BAE\u0BCD (Daily)" : "Daily"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Weekdays" }, lang === "ta" ? "\u0BB5\u0BBE\u0BB0 \u0BA8\u0BBE\u0B9F\u0BCD\u0B95\u0BB3\u0BCD (Weekdays)" : "Weekdays"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Weekends" }, lang === "ta" ? "\u0BB5\u0BBE\u0BB0 \u0B87\u0BB1\u0BC1\u0BA4\u0BBF (Weekends)" : "Weekends"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Once" }, lang === "ta" ? "\u0B92\u0BB0\u0BC1\u0BAE\u0BC1\u0BB1\u0BC8 (Once)" : "Once")
    )), /* @__PURE__ */ import_react10.default.createElement("div", { className: "form-group-item" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "flex-between-label" }, /* @__PURE__ */ import_react10.default.createElement("label", { className: "form-label-sub" }, lang === "ta" ? "\u0B92\u0BB2\u0BBF" : "Sound"), /* @__PURE__ */ import_react10.default.createElement(
      "button",
      {
        type: "button",
        className: "test-sound-link",
        onClick: handleTestSound,
        title: "Test Sound"
      },
      /* @__PURE__ */ import_react10.default.createElement(Volume2, { size: 12 })
    )), /* @__PURE__ */ import_react10.default.createElement(
      "select",
      {
        className: "select-field-custom",
        value: sound,
        onChange: (e) => setSound(e.target.value)
      },
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Gentle Bell" }, "Gentle Bell"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Temple Bell" }, "Temple Gong"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Singing Bowl" }, "Singing Bowl"),
      /* @__PURE__ */ import_react10.default.createElement("option", { value: "Chakra Tone" }, "Chakra Tone")
    ))), /* @__PURE__ */ import_react10.default.createElement("button", { type: "submit", className: "btn-save-reminder-main" }, /* @__PURE__ */ import_react10.default.createElement(Save, { size: 16 }), /* @__PURE__ */ import_react10.default.createElement("span", null, lang === "ta" ? "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BC8 \u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD" : "Save Reminder"))));
  }
  var import_react10;
  var init_QuickAddReminderCard = __esm({
    "src/components/QuickAddReminderCard.jsx"() {
      import_react10 = __toESM(require_react());
      init_lucide_react();
      init_audioEngine();
    }
  });

  // src/components/RelaxationZone.jsx
  function RelaxationZone({ lang = "en" }) {
    const [activeTab, setActiveTab] = (0, import_react11.useState)("Meditation");
    const [isPlaying, setIsPlaying] = (0, import_react11.useState)(false);
    const [currentTrack, setCurrentTrack] = (0, import_react11.useState)({
      title: "Peaceful Mind",
      titleTa: "\u0B85\u0BAE\u0BC8\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0BAE\u0BA9\u0BAE\u0BCD",
      category: "Relaxing Music",
      categoryTa: "\u0BA8\u0BBF\u0BAE\u0BCD\u0BAE\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0B87\u0B9A\u0BC8"
    });
    const filterTabs = ["Meditation", "Breathing", "Music", "Sleep"];
    const togglePlay = (track) => {
      if (track) setCurrentTrack(track);
      if (isPlaying) {
        audioEngine.stopAllAmbient();
        setIsPlaying(false);
      } else {
        audioEngine.playTibetanSingingBowl();
        setIsPlaying(true);
      }
    };
    return /* @__PURE__ */ import_react11.default.createElement("div", { className: "dashboard-card relaxation-zone-card" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "card-header-block" }, /* @__PURE__ */ import_react11.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react11.default.createElement(Flower2, { size: 18, className: "text-teal" }), /* @__PURE__ */ import_react11.default.createElement("span", null, lang === "ta" ? "\u0BB0\u0BBF\u0BB2\u0BBE\u0B95\u0BCD\u0B9A\u0BC7\u0BB7\u0BA9\u0BCD \u0BAE\u0BA3\u0BCD\u0B9F\u0BB2\u0BAE\u0BCD" : "Relaxation Zone")), /* @__PURE__ */ import_react11.default.createElement("p", { className: "card-sub-motto" }, lang === "ta" ? "\u0BAE\u0BA9\u0BA4\u0BC8 \u0B85\u0BAE\u0BC8\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0B86\u0BA9\u0BCD\u0BAE\u0BBE\u0BB5\u0BC8 \u0B95\u0BC1\u0BA3\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Calm your mind. Heal your soul.")), /* @__PURE__ */ import_react11.default.createElement("div", { className: "pill-filters-row" }, filterTabs.map((tab) => /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        key: tab,
        type: "button",
        className: `filter-pill-btn ${activeTab === tab ? "active" : ""}`,
        onClick: () => setActiveTab(tab)
      },
      tab
    ))), /* @__PURE__ */ import_react11.default.createElement(
      "div",
      {
        className: "guided-meditation-box",
        onClick: () => togglePlay({
          title: "Guided Meditation",
          titleTa: "\u0BB5\u0BB4\u0BBF\u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA4\u0BBF\u0BAF\u0BBE\u0BA9\u0BAE\u0BCD",
          category: "10 min \u2022 Calm Mind",
          categoryTa: "10 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u2022 \u0B85\u0BAE\u0BC8\u0BA4\u0BBF \u0BAE\u0BA9\u0BAE\u0BCD"
        })
      },
      /* @__PURE__ */ import_react11.default.createElement(
        "img",
        {
          src: "assets/images/meditation.jpg",
          alt: "Guided Meditation",
          className: "meditation-bg-img"
        }
      ),
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "meditation-overlay-gradient" }),
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "meditation-text-meta" }, /* @__PURE__ */ import_react11.default.createElement("h4", { className: "meditation-title-bold" }, lang === "ta" ? "\u0BB5\u0BB4\u0BBF\u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA4\u0BBF\u0BAF\u0BBE\u0BA9\u0BAE\u0BCD" : "Guided Meditation"), /* @__PURE__ */ import_react11.default.createElement("span", { className: "meditation-duration-tag" }, lang === "ta" ? "10 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u2022 \u0B85\u0BAE\u0BC8\u0BA4\u0BBF \u0BAE\u0BA9\u0BAE\u0BCD" : "10 min \u2022 Calm Mind")),
      /* @__PURE__ */ import_react11.default.createElement(
        "button",
        {
          type: "button",
          className: "meditation-play-circle",
          "aria-label": "Play Meditation"
        },
        isPlaying ? /* @__PURE__ */ import_react11.default.createElement(Pause, { size: 18 }) : /* @__PURE__ */ import_react11.default.createElement(Play, { size: 18 })
      )
    ), /* @__PURE__ */ import_react11.default.createElement("div", { className: "audio-chips-row" }, /* @__PURE__ */ import_react11.default.createElement(
      "div",
      {
        className: "audio-chip-item chip-green",
        onClick: () => togglePlay({
          title: "Deep Breathing",
          titleTa: "\u0B86\u0BB4\u0BCD\u0BA8\u0BCD\u0BA4 \u0B9A\u0BC1\u0BB5\u0BBE\u0B9A\u0BAE\u0BCD",
          category: "5 min \u2022 Focus",
          categoryTa: "5 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u2022 \u0B95\u0BB5\u0BA9\u0BAE\u0BCD"
        })
      },
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-icon-box bg-green-light" }, /* @__PURE__ */ import_react11.default.createElement(Wind, { size: 16, className: "text-green" })),
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-meta" }, /* @__PURE__ */ import_react11.default.createElement("strong", null, lang === "ta" ? "\u0B86\u0BB4\u0BCD\u0BA8\u0BCD\u0BA4 \u0B9A\u0BC1\u0BB5\u0BBE\u0B9A\u0BAE\u0BCD" : "Deep Breathing"), /* @__PURE__ */ import_react11.default.createElement("small", null, "5 min \u2022 Focus"))
    ), /* @__PURE__ */ import_react11.default.createElement(
      "div",
      {
        className: "audio-chip-item chip-purple",
        onClick: () => togglePlay({
          title: "Relaxing Music",
          titleTa: "\u0BA8\u0BBF\u0BAE\u0BCD\u0BAE\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0B87\u0B9A\u0BC8",
          category: "30 min \u2022 Calm",
          categoryTa: "30 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u2022 \u0B85\u0BAE\u0BC8\u0BA4\u0BBF"
        })
      },
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-icon-box bg-purple-light" }, /* @__PURE__ */ import_react11.default.createElement(Music, { size: 16, className: "text-purple" })),
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-meta" }, /* @__PURE__ */ import_react11.default.createElement("strong", null, lang === "ta" ? "\u0BA8\u0BBF\u0BAE\u0BCD\u0BAE\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0B87\u0B9A\u0BC8" : "Relaxing Music"), /* @__PURE__ */ import_react11.default.createElement("small", null, "30 min \u2022 Calm"))
    ), /* @__PURE__ */ import_react11.default.createElement(
      "div",
      {
        className: "audio-chip-item chip-blue",
        onClick: () => togglePlay({
          title: "Sleep Sounds",
          titleTa: "\u0B89\u0BB1\u0B95\u0BCD\u0B95 \u0B92\u0BB2\u0BBF\u0B95\u0BB3\u0BCD",
          category: "45 min \u2022 Good Sleep",
          categoryTa: "45 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0BAE\u0BCD \u2022 \u0B86\u0BB4\u0BCD\u0BA8\u0BCD\u0BA4 \u0B89\u0BB1\u0B95\u0BCD\u0B95\u0BAE\u0BCD"
        })
      },
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-icon-box bg-blue-light" }, /* @__PURE__ */ import_react11.default.createElement(Moon, { size: 16, className: "text-blue" })),
      /* @__PURE__ */ import_react11.default.createElement("div", { className: "chip-meta" }, /* @__PURE__ */ import_react11.default.createElement("strong", null, lang === "ta" ? "\u0B89\u0BB1\u0B95\u0BCD\u0B95 \u0B92\u0BB2\u0BBF\u0B95\u0BB3\u0BCD" : "Sleep Sounds"), /* @__PURE__ */ import_react11.default.createElement("small", null, "45 min \u2022 Good Sleep"))
    )), /* @__PURE__ */ import_react11.default.createElement("div", { className: "mini-player-dock-bar" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "player-track-info" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "player-album-thumb" }, /* @__PURE__ */ import_react11.default.createElement("img", { src: "assets/images/class-thumb.jpg", alt: "Track Art" })), /* @__PURE__ */ import_react11.default.createElement("div", { className: "player-text" }, /* @__PURE__ */ import_react11.default.createElement("strong", null, lang === "ta" && currentTrack.titleTa ? currentTrack.titleTa : currentTrack.title), /* @__PURE__ */ import_react11.default.createElement("small", null, lang === "ta" && currentTrack.categoryTa ? currentTrack.categoryTa : currentTrack.category))), /* @__PURE__ */ import_react11.default.createElement("div", { className: "player-controls-cluster" }, /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", className: "btn-player-mini", "aria-label": "Previous" }, /* @__PURE__ */ import_react11.default.createElement(SkipBack, { size: 14 })), /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-player-mini play-accent",
        onClick: () => togglePlay(),
        "aria-label": "Play"
      },
      isPlaying ? /* @__PURE__ */ import_react11.default.createElement(Pause, { size: 14 }) : /* @__PURE__ */ import_react11.default.createElement(Play, { size: 14 })
    ), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", className: "btn-player-mini", "aria-label": "Next" }, /* @__PURE__ */ import_react11.default.createElement(SkipForward, { size: 14 }))), /* @__PURE__ */ import_react11.default.createElement("div", { className: "player-volume-slider-wrap" }, /* @__PURE__ */ import_react11.default.createElement(Volume2, { size: 14, className: "vol-icon" }), /* @__PURE__ */ import_react11.default.createElement("div", { className: "volume-track-line" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "volume-fill-bar", style: { width: "70%" } })))));
  }
  var import_react11;
  var init_RelaxationZone = __esm({
    "src/components/RelaxationZone.jsx"() {
      import_react11 = __toESM(require_react());
      init_lucide_react();
      init_audioEngine();
    }
  });

  // src/components/AttendanceProgressSection.jsx
  function AttendanceProgressSection({ user, lang = "en" }) {
    const weeklyData = [
      { day: "Mon", h1: 45, h2: 25 },
      { day: "Tue", h1: 65, h2: 40 },
      { day: "Wed", h1: 30, h2: 20 },
      { day: "Thu", h1: 85, h2: 60 },
      { day: "Fri", h1: 50, h2: 35 },
      { day: "Sat", h1: 70, h2: 55 },
      { day: "Sun", h1: 90, h2: 75 }
    ];
    return /* @__PURE__ */ import_react12.default.createElement("div", { className: "dashboard-card progress-dashboard-card" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "card-header-block" }, /* @__PURE__ */ import_react12.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react12.default.createElement(TrendingUp, { size: 18, className: "text-violet" }), /* @__PURE__ */ import_react12.default.createElement("span", null, lang === "ta" ? "\u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BC7\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD" : "Progress")), /* @__PURE__ */ import_react12.default.createElement("p", { className: "card-sub-motto" }, lang === "ta" ? "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BAF\u0BA3\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BCD \u0B95\u0BA3\u0BCD\u0B95\u0BBE\u0BA3\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BC8\u0B95\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBE\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Track your journey and celebrate your growth.")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "progress-metrics-4row" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-metric-tile tile-purple" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-tile-top" }, /* @__PURE__ */ import_react12.default.createElement(Flower2, { size: 16, className: "text-purple" })), /* @__PURE__ */ import_react12.default.createElement("span", { className: "prog-metric-label" }, lang === "ta" ? "\u0B95\u0BB2\u0BA8\u0BCD\u0BA4\u0BC1\u0B95\u0BCA\u0BA3\u0BCD\u0B9F \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD" : "Classes Attended"), /* @__PURE__ */ import_react12.default.createElement("strong", { className: "prog-metric-val" }, user?.classesAttended || 12), /* @__PURE__ */ import_react12.default.createElement("small", { className: "prog-metric-sub" }, lang === "ta" ? "\u0B87\u0BA8\u0BCD\u0BA4 \u0BAE\u0BBE\u0BA4\u0BAE\u0BCD" : "This month")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-metric-tile tile-blue" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-tile-top" }, /* @__PURE__ */ import_react12.default.createElement(Calendar, { size: 16, className: "text-blue" })), /* @__PURE__ */ import_react12.default.createElement("span", { className: "prog-metric-label" }, lang === "ta" ? "\u0BB5\u0BB0\u0BC1\u0B95\u0BC8 \u0BB5\u0BBF\u0B95\u0BBF\u0BA4\u0BAE\u0BCD" : "Attendance Rate"), /* @__PURE__ */ import_react12.default.createElement("strong", { className: "prog-metric-val" }, user?.attendanceRate || 85, "%"), /* @__PURE__ */ import_react12.default.createElement("small", { className: "prog-metric-sub text-green" }, lang === "ta" ? "+5% \u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF \u0BAE\u0BBE\u0BA4\u0BAE\u0BCD" : "+5% than last month")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-metric-tile tile-green" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-tile-top" }, /* @__PURE__ */ import_react12.default.createElement(CircleCheck, { size: 16, className: "text-green" })), /* @__PURE__ */ import_react12.default.createElement("span", { className: "prog-metric-label" }, lang === "ta" ? "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BA8\u0BCD\u0BA4\u0BA4\u0BC1" : "Reminder Completed"), /* @__PURE__ */ import_react12.default.createElement("strong", { className: "prog-metric-val" }, "18"), /* @__PURE__ */ import_react12.default.createElement("small", { className: "prog-metric-sub text-green" }, lang === "ta" ? "+3 \u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF \u0BB5\u0BBE\u0BB0\u0BAE\u0BCD" : "+3 than last week")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-metric-tile tile-pink" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "prog-tile-top" }, /* @__PURE__ */ import_react12.default.createElement(Star, { size: 16, className: "text-pink" })), /* @__PURE__ */ import_react12.default.createElement("span", { className: "prog-metric-label" }, lang === "ta" ? "\u0BAF\u0BCB\u0B95\u0BBE \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BC7\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD" : "Yoga Progress"), /* @__PURE__ */ import_react12.default.createElement("strong", { className: "prog-metric-val" }, lang === "ta" ? "\u0BA8\u0BA9\u0BCD\u0BB1\u0BC1" : "Good"), /* @__PURE__ */ import_react12.default.createElement("small", { className: "prog-metric-sub" }, lang === "ta" ? "\u0BA4\u0BCA\u0B9F\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD!" : "Keep going!"))), /* @__PURE__ */ import_react12.default.createElement("div", { className: "charts-split-grid" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "chart-box-card" }, /* @__PURE__ */ import_react12.default.createElement("h4", { className: "chart-title-sub" }, lang === "ta" ? "\u0BB5\u0BBE\u0BB0\u0BBE\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1" : "Weekly Activity"), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bar-chart-visual-container" }, weeklyData.map((d) => /* @__PURE__ */ import_react12.default.createElement("div", { key: d.day, className: "bar-chart-column" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "bars-stacked" }, /* @__PURE__ */ import_react12.default.createElement(
      "div",
      {
        className: "bar-fill-violet",
        style: { height: `${d.h1}%` },
        title: `${d.day}: ${d.h1} mins`
      }
    ), /* @__PURE__ */ import_react12.default.createElement(
      "div",
      {
        className: "bar-fill-cyan",
        style: { height: `${d.h2}%` }
      }
    )), /* @__PURE__ */ import_react12.default.createElement("span", { className: "bar-day-label" }, d.day))))), /* @__PURE__ */ import_react12.default.createElement("div", { className: "chart-box-card" }, /* @__PURE__ */ import_react12.default.createElement("h4", { className: "chart-title-sub" }, lang === "ta" ? "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD \u0BA8\u0BBF\u0BB1\u0BC8\u0BB5\u0BC1" : "Reminder Completion"), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-chart-flex" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-circle-wrap" }, /* @__PURE__ */ import_react12.default.createElement("svg", { viewBox: "0 0 100 100", className: "donut-svg" }, /* @__PURE__ */ import_react12.default.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "38",
        className: "donut-bg-ring"
      }
    ), /* @__PURE__ */ import_react12.default.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "38",
        className: "donut-accent-ring",
        strokeDasharray: "238.76",
        strokeDashoffset: "47.75"
      }
    )), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-center-text" }, /* @__PURE__ */ import_react12.default.createElement("strong", null, "80%"))), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-legend-list" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-legend-row" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "dot-color dot-blue" }, "\u25CF"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-name" }, lang === "ta" ? "\u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD" : "Water"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-val" }, "3/3")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-legend-row" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "dot-color dot-yellow" }, "\u25CF"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-name" }, lang === "ta" ? "\u0B89\u0BA3\u0BB5\u0BC1" : "Meal"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-val" }, "2/2")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-legend-row" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "dot-color dot-green" }, "\u25CF"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-name" }, lang === "ta" ? "\u0B85\u0BB4\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1" : "Call"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-val" }, "2/3")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "donut-legend-row" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "dot-color dot-purple" }, "\u25CF"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-name" }, lang === "ta" ? "\u0BAE\u0BB1\u0BCD\u0BB1\u0BB5\u0BC8" : "Other"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "leg-val" }, "5/7")))))));
  }
  var import_react12;
  var init_AttendanceProgressSection = __esm({
    "src/components/AttendanceProgressSection.jsx"() {
      import_react12 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/YogaNotesSection.jsx
  function YogaNotesSection({ lang = "en" }) {
    const [notes, setNotes] = (0, import_react13.useState)([
      {
        id: 1,
        title: "Benefits of Yoga",
        titleTa: "\u0BAF\u0BCB\u0B95\u0BBE\u0BB5\u0BBF\u0BA9\u0BCD \u0BA8\u0BA9\u0BCD\u0BAE\u0BC8\u0B95\u0BB3\u0BCD",
        content: "Yoga improves flexibility, reduces stress and increases focus...",
        contentTa: "\u0BAF\u0BCB\u0B95\u0BBE \u0BA8\u0BC6\u0B95\u0BBF\u0BB4\u0BCD\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC8 \u0BAE\u0BC7\u0BAE\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1, \u0BAE\u0BA9 \u0B85\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...",
        date: "Oct 5, 2026",
        tag: "Yoga",
        tagTa: "\u0BAF\u0BCB\u0B95\u0BBE",
        colorClass: "icon-orange-note"
      },
      {
        id: 2,
        title: "Healthy Food Habits",
        titleTa: "\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B89\u0BA3\u0BB5\u0BC1\u0BAA\u0BCD \u0BAA\u0BB4\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
        content: "Eat clean, stay fit. Fresh food gives more energy...",
        contentTa: "\u0B9A\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BBE\u0B95 \u0B89\u0BA3\u0BCD\u0BA3\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B89\u0BA3\u0BB5\u0BC1 \u0B85\u0BA4\u0BBF\u0B95 \u0B86\u0BB1\u0BCD\u0BB1\u0BB2\u0BC8\u0BA4\u0BCD \u0BA4\u0BB0\u0BC1\u0BAE\u0BCD...",
        date: "Oct 4, 2026",
        tag: "Health",
        tagTa: "\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BCD",
        colorClass: "icon-red-note"
      },
      {
        id: 3,
        title: "Morning Routine",
        titleTa: "\u0B95\u0BBE\u0BB2\u0BC8 \u0BB5\u0BB4\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
        content: "Wake up early, do breathing exercises, drink water...",
        contentTa: "\u0B85\u0BA4\u0BBF\u0B95\u0BBE\u0BB2\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0B8E\u0BB4\u0BC1\u0BAE\u0BCD\u0BAA\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0BAE\u0BC2\u0B9A\u0BCD\u0B9A\u0BC1\u0BAA\u0BCD \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0B95\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD...",
        date: "Oct 3, 2026",
        tag: "Routine",
        tagTa: "\u0BB5\u0BB4\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
        colorClass: "icon-blue-note"
      },
      {
        id: 4,
        title: "Self Care",
        titleTa: "\u0B9A\u0BC1\u0BAF \u0BAA\u0BB0\u0BBE\u0BAE\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
        content: "Take care of your mind. It's just as important as your body...",
        contentTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BA9\u0BA4\u0BC8 \u0B95\u0BB5\u0BA9\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0B85\u0BA4\u0BC1 \u0B89\u0B9F\u0BB2\u0BC8\u0BAA\u0BCD \u0BAA\u0BCB\u0BB2\u0BB5\u0BC7 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0BA9\u0BA4\u0BC1...",
        date: "Oct 2, 2026",
        tag: "Wellness",
        tagTa: "\u0BA8\u0BB2\u0BCD\u0BB5\u0BBE\u0BB4\u0BCD\u0BB5\u0BC1",
        colorClass: "icon-teal-note"
      }
    ]);
    const [isAdding, setIsAdding] = (0, import_react13.useState)(false);
    const [newTitle, setNewTitle] = (0, import_react13.useState)("");
    const [newContent, setNewContent] = (0, import_react13.useState)("");
    const handleAddNote = (e) => {
      e.preventDefault();
      if (!newTitle.trim()) return;
      setNotes((prev) => [
        {
          id: Date.now(),
          title: newTitle.trim(),
          content: newContent.trim() || "Mindful reflection...",
          date: "Today",
          tag: "Wellness",
          colorClass: "icon-teal-note"
        },
        ...prev
      ]);
      setNewTitle("");
      setNewContent("");
      setIsAdding(false);
    };
    return /* @__PURE__ */ import_react13.default.createElement("div", { className: "dashboard-card yoga-notes-card" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "card-header-row" }, /* @__PURE__ */ import_react13.default.createElement("div", null, /* @__PURE__ */ import_react13.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react13.default.createElement(BookOpen, { size: 18, className: "text-violet" }), /* @__PURE__ */ import_react13.default.createElement("span", null, lang === "ta" ? "\u0BAF\u0BCB\u0B95\u0BBE \u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD" : "Yoga Notes")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "card-sub-motto" }, lang === "ta" ? "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA3\u0BCD\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BC8 \u0B87\u0B99\u0BCD\u0B95\u0BC7 \u0BB5\u0BC8\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD." : "Keep your thoughts, learnings and wellness notes here.")), /* @__PURE__ */ import_react13.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-add-note-pill",
        onClick: () => setIsAdding(!isAdding)
      },
      /* @__PURE__ */ import_react13.default.createElement(Plus, { size: 14 }),
      /* @__PURE__ */ import_react13.default.createElement("span", null, lang === "ta" ? "\u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B9A\u0BC7\u0BB0\u0BCD\u0B95\u0BCD\u0B95" : "+ Add Note")
    )), isAdding && /* @__PURE__ */ import_react13.default.createElement("form", { onSubmit: handleAddNote, className: "inline-add-note-form" }, /* @__PURE__ */ import_react13.default.createElement(
      "input",
      {
        type: "text",
        className: "input-field-custom",
        placeholder: lang === "ta" ? "\u0BA4\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1..." : "Note Title...",
        value: newTitle,
        onChange: (e) => setNewTitle(e.target.value),
        required: true
      }
    ), /* @__PURE__ */ import_react13.default.createElement(
      "textarea",
      {
        className: "input-field-custom textarea-mini",
        placeholder: lang === "ta" ? "\u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 \u0B8E\u0BB4\u0BC1\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD..." : "Write note...",
        value: newContent,
        onChange: (e) => setNewContent(e.target.value)
      }
    ), /* @__PURE__ */ import_react13.default.createElement("button", { type: "submit", className: "btn-save-note" }, lang === "ta" ? "\u0B9A\u0BC7\u0BAE\u0BBF" : "Save")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "notes-vertical-stack" }, notes.map((note) => /* @__PURE__ */ import_react13.default.createElement("div", { key: note.id, className: "note-item-row" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: `note-icon-badge ${note.colorClass}` }, /* @__PURE__ */ import_react13.default.createElement(BookOpen, { size: 15 })), /* @__PURE__ */ import_react13.default.createElement("div", { className: "note-text-block" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "note-title-line" }, /* @__PURE__ */ import_react13.default.createElement("strong", { className: "note-title-strong" }, lang === "ta" && note.titleTa ? note.titleTa : note.title)), /* @__PURE__ */ import_react13.default.createElement("p", { className: "note-excerpt-p" }, lang === "ta" && note.contentTa ? note.contentTa : note.content), /* @__PURE__ */ import_react13.default.createElement("div", { className: "note-date-sub" }, /* @__PURE__ */ import_react13.default.createElement("span", null, "\u{1F5D3} ", note.date))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "note-tag-pill" }, lang === "ta" && note.tagTa ? note.tagTa : note.tag)))));
  }
  var import_react13;
  var init_YogaNotesSection = __esm({
    "src/components/YogaNotesSection.jsx"() {
      import_react13 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/ProfileSection.jsx
  function ProfileSection({ user, onUpdateUser, lang = "en" }) {
    const [activeTab, setActiveTab] = (0, import_react14.useState)("Personal Info");
    const [isEditing, setIsEditing] = (0, import_react14.useState)(false);
    const [formData, setFormData] = (0, import_react14.useState)({
      name: user?.name || "Sarah",
      email: user?.email || "sarah@gmail.com",
      age: user?.age || 28,
      goal: user?.goal || "Better Health & Peace",
      joined: user?.joined || "Oct 1, 2026"
    });
    const profileTabs = ["Personal Info", "Preferences", "Settings"];
    const handleSave = (e) => {
      e.preventDefault();
      if (onUpdateUser) onUpdateUser(formData);
      setIsEditing(false);
    };
    return /* @__PURE__ */ import_react14.default.createElement("div", { className: "dashboard-card profile-dashboard-card" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "card-header-row" }, /* @__PURE__ */ import_react14.default.createElement("h3", { className: "card-title-main" }, /* @__PURE__ */ import_react14.default.createElement(User, { size: 18, className: "text-violet" }), /* @__PURE__ */ import_react14.default.createElement("span", null, lang === "ta" ? "\u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD" : "Profile")), /* @__PURE__ */ import_react14.default.createElement(
      "button",
      {
        type: "button",
        className: "btn-edit-profile-pill",
        onClick: () => setIsEditing(!isEditing)
      },
      /* @__PURE__ */ import_react14.default.createElement(PenLine, { size: 13 }),
      /* @__PURE__ */ import_react14.default.createElement("span", null, lang === "ta" ? "\u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1" : "Edit Profile")
    )), /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-user-strip" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-round-avatar" }, /* @__PURE__ */ import_react14.default.createElement("span", null, formData.name.charAt(0))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-user-names" }, /* @__PURE__ */ import_react14.default.createElement("h4", { className: "profile-name-bold" }, formData.name), /* @__PURE__ */ import_react14.default.createElement("span", { className: "profile-role-sub" }, lang === "ta" ? "\u0BAF\u0BCB\u0B95\u0BBE \u0B86\u0BB0\u0BCD\u0BB5\u0BB2\u0BB0\u0BCD" : "Yoga Enthusiast"))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-tabs-strip" }, profileTabs.map((tab) => /* @__PURE__ */ import_react14.default.createElement(
      "button",
      {
        key: tab,
        type: "button",
        className: `tab-strip-btn ${activeTab === tab ? "active" : ""}`,
        onClick: () => setActiveTab(tab)
      },
      tab
    ))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-content-split" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-details-list" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "detail-field-row" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-key-label" }, lang === "ta" ? "\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD:" : "Name:"), /* @__PURE__ */ import_react14.default.createElement("strong", { className: "field-val-text" }, formData.name)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "detail-field-row" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-key-label" }, lang === "ta" ? "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD:" : "Email:"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-val-text email-val" }, formData.email)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "detail-field-row" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-key-label" }, lang === "ta" ? "\u0BB5\u0BAF\u0BA4\u0BC1:" : "Age:"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-val-text" }, formData.age)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "detail-field-row" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-key-label" }, lang === "ta" ? "\u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BC1:" : "Goal:"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-val-text" }, formData.goal)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "detail-field-row" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-key-label" }, lang === "ta" ? "\u0B87\u0BA3\u0BC8\u0BA8\u0BCD\u0BA4\u0BA4\u0BC1:" : "Joined:"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "field-val-text" }, formData.joined))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "profile-quote-card-box" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "quote-lotus-wrap" }, /* @__PURE__ */ import_react14.default.createElement("svg", { viewBox: "0 0 24 24", className: "quote-lotus-icon" }, /* @__PURE__ */ import_react14.default.createElement("path", { d: "M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" }))), /* @__PURE__ */ import_react14.default.createElement("p", { className: "quote-mind-body" }, lang === "ta" ? '"\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0BA9 \u0BAE\u0BA9\u0BAE\u0BC7 \u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BBE\u0BA9 \u0BB5\u0BBE\u0BB4\u0BCD\u0B95\u0BCD\u0B95\u0BC8\u0B95\u0BCD\u0B95\u0BC1 \u0BB5\u0BB4\u0BBF\u0BB5\u0B95\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD."' : '"A healthy mind leads to a happy life."'))));
  }
  var import_react14;
  var init_ProfileSection = __esm({
    "src/components/ProfileSection.jsx"() {
      import_react14 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/ToastContainer.jsx
  function ToastContainer({ toasts, onDismiss }) {
    if (!toasts || toasts.length === 0) return null;
    return /* @__PURE__ */ import_react15.default.createElement("div", { className: "toast-floating-tray", "aria-live": "polite" }, toasts.map((toast) => /* @__PURE__ */ import_react15.default.createElement(
      "div",
      {
        key: toast.id,
        className: `toast-notification-unit ${toast.type || "success"}`
      },
      /* @__PURE__ */ import_react15.default.createElement("div", { className: "toast-icon-wrap" }, toast.type === "error" ? /* @__PURE__ */ import_react15.default.createElement(CircleAlert, { size: 18, className: "text-rose" }) : /* @__PURE__ */ import_react15.default.createElement(CircleCheck, { size: 18, className: "text-emerald" })),
      /* @__PURE__ */ import_react15.default.createElement("div", { className: "toast-copy" }, /* @__PURE__ */ import_react15.default.createElement("strong", null, toast.title), toast.message && /* @__PURE__ */ import_react15.default.createElement("p", null, toast.message)),
      /* @__PURE__ */ import_react15.default.createElement(
        "button",
        {
          type: "button",
          className: "toast-close-btn",
          onClick: () => onDismiss(toast.id),
          title: "Dismiss"
        },
        /* @__PURE__ */ import_react15.default.createElement(X, { size: 14 })
      )
    )));
  }
  var import_react15;
  var init_ToastContainer = __esm({
    "src/components/ToastContainer.jsx"() {
      import_react15 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/components/MobileBottomNav.jsx
  function MobileBottomNav({ currentTab, setCurrentTab, lang }) {
    const bottomItems = [
      { id: "home", labelEn: "Home", labelTa: "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1", icon: House },
      { id: "yoga-classes", labelEn: "Yoga", labelTa: "\u0BAF\u0BCB\u0B95\u0BBE", icon: Flower2 },
      { id: "reminders", labelEn: "Reminders", labelTa: "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD", icon: BellRing },
      { id: "relaxation", labelEn: "Relax", labelTa: "\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9\u0BAE\u0BCD", icon: Moon },
      { id: "profile", labelEn: "Profile", labelTa: "\u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD", icon: User }
    ];
    return /* @__PURE__ */ import_react16.default.createElement("nav", { className: "mobile-bottom-nav" }, bottomItems.map((item) => {
      const Icon2 = item.icon;
      const isActive = currentTab === item.id || item.id === "yoga-classes" && currentTab === "live-classes";
      return /* @__PURE__ */ import_react16.default.createElement(
        "button",
        {
          key: item.id,
          type: "button",
          className: `mobile-nav-btn ${isActive ? "active" : ""}`,
          onClick: () => setCurrentTab(item.id)
        },
        /* @__PURE__ */ import_react16.default.createElement("div", { className: "icon-glow-container" }, /* @__PURE__ */ import_react16.default.createElement(Icon2, { size: 20 })),
        /* @__PURE__ */ import_react16.default.createElement("span", { className: "mobile-nav-label" }, lang === "ta" ? item.labelTa : item.labelEn)
      );
    }));
  }
  var import_react16;
  var init_MobileBottomNav = __esm({
    "src/components/MobileBottomNav.jsx"() {
      import_react16 = __toESM(require_react());
      init_lucide_react();
    }
  });

  // src/utils/storage.js
  function loadStorage(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }
  var DEFAULT_USER, DEFAULT_REMINDERS, DEFAULT_CLASSES;
  var init_storage = __esm({
    "src/utils/storage.js"() {
      DEFAULT_USER = {
        name: "Sarah",
        role: "Yoga Enthusiast",
        email: "sarah@gmail.com",
        age: 28,
        goal: "Better Health & Peace",
        joined: "Oct 1, 2026",
        classesAttended: 12,
        attendanceRate: 85,
        dayStreak: 7,
        level: "Beginner"
      };
      DEFAULT_REMINDERS = [
        {
          id: "rem-1",
          time: "6:00 PM",
          date: "2026-10-08",
          title: "Next Yoga Class",
          titleTa: "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BAF\u0BCB\u0B95\u0BBE \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
          category: "Yoga",
          message: "Keep going! You're doing great! \u{1F49C}",
          messageTa: "\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD! \u{1F49C}",
          repeat: "Daily",
          sound: "Gentle Bell",
          enabled: true,
          completed: false
        },
        {
          id: "rem-2",
          time: "5:30 PM",
          date: "2026-10-08",
          title: "Water Reminder",
          titleTa: "\u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
          category: "Water",
          message: "Drink water... Stay fresh! \u{1F4A7}",
          messageTa: "\u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0B95\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD... \u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BA3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BC1\u0B9F\u0BA9\u0BCD \u0B87\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u{1F4A7}",
          repeat: "Daily",
          sound: "Gentle Bell",
          enabled: true,
          completed: false
        },
        {
          id: "rem-3",
          time: "1:00 PM",
          date: "2026-10-08",
          title: "Meal Reminder",
          titleTa: "\u0B89\u0BA3\u0BB5\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
          category: "Meal",
          message: "Healthy food = Happy you! \u{1F957}",
          messageTa: "\u0B86\u0BB0\u0BCB\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B89\u0BA3\u0BB5\u0BC1 = \u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BBE\u0BA9 \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD! \u{1F957}",
          repeat: "Daily",
          sound: "Gentle Bell",
          enabled: true,
          completed: false
        },
        {
          id: "rem-4",
          time: "7:00 PM",
          date: "2026-10-08",
          title: "Call Reminder",
          titleTa: "\u0B85\u0BB4\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD",
          category: "Call",
          message: "Don't forget to call your loved ones. \u{1F4DE}",
          messageTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BA9\u0BCD\u0BAA\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB0\u0BBF\u0BAF\u0BB5\u0BB0\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0BB4\u0BC8\u0B95\u0BCD\u0B95 \u0BAE\u0BB1\u0B95\u0BCD\u0B95\u0BBE\u0BA4\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD. \u{1F4DE}",
          repeat: "Daily",
          sound: "Gentle Bell",
          enabled: true,
          completed: false
        },
        {
          id: "rem-5",
          time: "9:00 PM",
          date: "2026-10-08",
          title: "Personal Care",
          titleTa: "\u0B9A\u0BC1\u0BAF \u0BAA\u0BB0\u0BBE\u0BAE\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
          category: "Personal Care",
          message: "Take care of yourself. You matter! \u{1F495}",
          messageTa: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BB5\u0BA9\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BCD! \u{1F495}",
          repeat: "Daily",
          sound: "Gentle Bell",
          enabled: true,
          completed: false
        }
      ];
      DEFAULT_CLASSES = [
        {
          id: "cls-1",
          name: "Hatha Yoga",
          instructor: "Priya",
          duration: 60,
          level: "Beginner",
          time: "06:00 AM",
          description: "Build flexibility, gentle core stability and natural balance.",
          attended: true,
          category: "Beginner"
        },
        {
          id: "cls-2",
          name: "Vinyasa Flow",
          instructor: "Anu",
          duration: 60,
          level: "Intermediate",
          time: "08:30 AM",
          description: "Improve stamina, breath synchronicity and fluid motion.",
          attended: true,
          category: "Intermediate"
        },
        {
          id: "cls-3",
          name: "Power Yoga",
          instructor: "Meena",
          duration: 75,
          level: "Advanced",
          time: "04:30 PM",
          description: "Boost metabolic energy, muscular endurance and sharp focus.",
          attended: false,
          category: "Advanced"
        },
        {
          id: "cls-4",
          name: "Yin Yoga",
          instructor: "Lakshmi",
          duration: 50,
          level: "All Levels",
          time: "06:00 PM",
          description: "Deep restorative stretching and meditative spine release.",
          attended: false,
          category: "Beginner"
        },
        {
          id: "cls-5",
          name: "Pranayama & Breathwork",
          instructor: "Nithya",
          duration: 35,
          level: "All Levels",
          time: "07:30 PM",
          description: "Ancient breath regulation for deep nervous system calming.",
          attended: true,
          category: "Beginner"
        }
      ];
    }
  });

  // src/App.jsx
  function App() {
    const [currentTab, setCurrentTab] = (0, import_react17.useState)("home");
    const [theme, setTheme] = (0, import_react17.useState)(() => loadStorage("nithya_theme", "light"));
    const [lang, setLang] = (0, import_react17.useState)(() => loadStorage("nithya_lang", "en"));
    const [searchQuery, setSearchQuery] = (0, import_react17.useState)("");
    const [user, setUser] = (0, import_react17.useState)(() => loadStorage("nithya_user", DEFAULT_USER));
    const [reminders, setReminders] = (0, import_react17.useState)(() => loadStorage("nithya_reminders", DEFAULT_REMINDERS));
    const [activeClass, setActiveClass] = (0, import_react17.useState)(DEFAULT_CLASSES[0]);
    const [toasts, setToasts] = (0, import_react17.useState)([]);
    (0, import_react17.useEffect)(() => {
      saveStorage("nithya_theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    (0, import_react17.useEffect)(() => {
      saveStorage("nithya_lang", lang);
      document.documentElement.setAttribute("data-lang", lang);
    }, [lang]);
    (0, import_react17.useEffect)(() => {
      saveStorage("nithya_user", user);
    }, [user]);
    (0, import_react17.useEffect)(() => {
      saveStorage("nithya_reminders", reminders);
    }, [reminders]);
    const showToast = (title, message = "", type = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    const handleDismissToast = (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    const handleTestSound = () => {
      audioEngine.playTempleBell();
      showToast(
        lang === "ta" ? "\u0B95\u0BCB\u0BAF\u0BBF\u0BB2\u0BCD \u0BAE\u0BA3\u0BBF \u0B92\u0BB2\u0BBF\u0BA4\u0BCD\u0BA4\u0BA4\u0BC1 \u{1F514}" : "Temple Bell Chime \u{1F514}",
        lang === "ta" ? "\u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B92\u0BB2\u0BBF \u0B9A\u0BB0\u0BBF\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1" : "Notification chime verified",
        "success"
      );
    };
    const handleAddReminder = (newReminder) => {
      setReminders((prev) => [newReminder, ...prev]);
      audioEngine.playGentleBell();
      showToast(
        lang === "ta" ? "\u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 \u2713" : "Reminder Saved \u2713",
        newReminder.title,
        "success"
      );
    };
    const handleToggleComplete = (id) => {
      setReminders((prev) => prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed;
          if (nextState) audioEngine.playGentleBell();
          return { ...r, completed: nextState };
        }
        return r;
      }));
    };
    const handleDeleteReminder = (id) => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      showToast("Deleted", "Reminder removed", "info");
    };
    const handleUpdateUser = (updated) => {
      setUser((prev) => ({ ...prev, ...updated }));
      showToast("Profile Updated", "Your changes have been saved", "success");
    };
    const handleJoinLive = () => {
      const studioEl = document.querySelector(".live-class-card");
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: "smooth" });
        studioEl.classList.add("highlight-glow");
        setTimeout(() => studioEl.classList.remove("highlight-glow"), 2e3);
      }
      showToast(
        lang === "ta" ? "\u0BB2\u0BC8\u0BB5\u0BCD \u0BB8\u0BCD\u0B9F\u0BC1\u0B9F\u0BBF\u0BAF\u0BCB \u0B87\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 \u{1F9D8}\u200D\u2640\uFE0F" : "Joined Live Yoga Studio \u{1F9D8}\u200D\u2640\uFE0F",
        "Hatha Yoga \u2022 Priya",
        "success"
      );
    };
    const handleViewSchedule = () => {
      const remEl = document.querySelector(".today-reminders-section");
      if (remEl) {
        remEl.scrollIntoView({ behavior: "smooth" });
      }
    };
    return /* @__PURE__ */ import_react17.default.createElement("div", { className: "nithya-app-root" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "app-main-layout" }, /* @__PURE__ */ import_react17.default.createElement(
      Sidebar,
      {
        currentTab,
        setCurrentTab,
        lang
      }
    ), /* @__PURE__ */ import_react17.default.createElement("div", { className: "main-viewport-content" }, /* @__PURE__ */ import_react17.default.createElement(
      Header,
      {
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        lang,
        setLang,
        user,
        onOpenNotifications: handleTestSound,
        onTestSound: handleTestSound
      }
    ), /* @__PURE__ */ import_react17.default.createElement("main", { className: "dashboard-content-grid-wrapper" }, /* @__PURE__ */ import_react17.default.createElement(
      HeroSection,
      {
        user,
        onJoinLive: handleJoinLive,
        onViewSchedule: handleViewSchedule,
        lang
      }
    ), /* @__PURE__ */ import_react17.default.createElement(
      SmartCareTimeline,
      {
        reminders,
        onToggleComplete: handleToggleComplete,
        onDeleteReminder: handleDeleteReminder,
        onShowAll: () => setCurrentTab("reminders"),
        lang
      }
    ), /* @__PURE__ */ import_react17.default.createElement("div", { className: "dashboard-row-3-grid" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-classes" }, /* @__PURE__ */ import_react17.default.createElement(
      YogaClassesSection,
      {
        onSelectClass: (cls) => {
          setActiveClass(cls);
          handleJoinLive();
        },
        onShowAll: () => setCurrentTab("classes"),
        lang
      }
    )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-live" }, /* @__PURE__ */ import_react17.default.createElement(
      LiveClassStudio,
      {
        activeClass,
        onLeaveClass: () => showToast("Session Ended", "You left the live session", "info"),
        lang
      }
    )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-quick-relax" }, /* @__PURE__ */ import_react17.default.createElement(
      QuickAddReminderCard,
      {
        onAddReminder: handleAddReminder,
        lang
      }
    ), /* @__PURE__ */ import_react17.default.createElement(
      RelaxationZone,
      {
        lang
      }
    ))), /* @__PURE__ */ import_react17.default.createElement("div", { className: "dashboard-row-4-grid" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-progress" }, /* @__PURE__ */ import_react17.default.createElement(
      AttendanceProgressSection,
      {
        user,
        lang
      }
    )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-notes" }, /* @__PURE__ */ import_react17.default.createElement(
      YogaNotesSection,
      {
        lang
      }
    )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid-col col-profile" }, /* @__PURE__ */ import_react17.default.createElement(
      ProfileSection,
      {
        user,
        onUpdateUser: handleUpdateUser,
        lang
      }
    )))))), /* @__PURE__ */ import_react17.default.createElement(
      MobileBottomNav,
      {
        currentTab,
        setCurrentTab,
        lang
      }
    ), /* @__PURE__ */ import_react17.default.createElement(
      ToastContainer,
      {
        toasts,
        onDismiss: handleDismissToast
      }
    ));
  }
  var import_react17;
  var init_App = __esm({
    "src/App.jsx"() {
      import_react17 = __toESM(require_react());
      init_Sidebar();
      init_Header();
      init_HeroSection();
      init_SmartCareTimeline();
      init_YogaClassesSection();
      init_LiveClassStudio();
      init_QuickAddReminderCard();
      init_RelaxationZone();
      init_AttendanceProgressSection();
      init_YogaNotesSection();
      init_ProfileSection();
      init_ToastContainer();
      init_MobileBottomNav();
      init_storage();
      init_audioEngine();
    }
  });

  // src/index.jsx
  var require_index = __commonJS({
    "src/index.jsx"() {
      var import_react18 = __toESM(require_react());
      var import_client = __toESM(require_client());
      init_App();
      var container = document.getElementById("root");
      if (container) {
        const root = (0, import_client.createRoot)(container);
        root.render(/* @__PURE__ */ import_react18.default.createElement(App, null));
      }
    }
  });
  require_index();
})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/bell-ring.mjs:
lucide-react/dist/esm/icons/bell.mjs:
lucide-react/dist/esm/icons/book-open.mjs:
lucide-react/dist/esm/icons/calendar.mjs:
lucide-react/dist/esm/icons/circle-alert.mjs:
lucide-react/dist/esm/icons/circle-check.mjs:
lucide-react/dist/esm/icons/droplet.mjs:
lucide-react/dist/esm/icons/file-text.mjs:
lucide-react/dist/esm/icons/flame.mjs:
lucide-react/dist/esm/icons/flower-2.mjs:
lucide-react/dist/esm/icons/globe.mjs:
lucide-react/dist/esm/icons/heart.mjs:
lucide-react/dist/esm/icons/house.mjs:
lucide-react/dist/esm/icons/mic-off.mjs:
lucide-react/dist/esm/icons/mic.mjs:
lucide-react/dist/esm/icons/moon.mjs:
lucide-react/dist/esm/icons/music.mjs:
lucide-react/dist/esm/icons/pause.mjs:
lucide-react/dist/esm/icons/pen-line.mjs:
lucide-react/dist/esm/icons/phone.mjs:
lucide-react/dist/esm/icons/play.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/save.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/icons/send.mjs:
lucide-react/dist/esm/icons/settings.mjs:
lucide-react/dist/esm/icons/skip-back.mjs:
lucide-react/dist/esm/icons/skip-forward.mjs:
lucide-react/dist/esm/icons/sparkles.mjs:
lucide-react/dist/esm/icons/star.mjs:
lucide-react/dist/esm/icons/trending-up.mjs:
lucide-react/dist/esm/icons/user.mjs:
lucide-react/dist/esm/icons/utensils.mjs:
lucide-react/dist/esm/icons/video-off.mjs:
lucide-react/dist/esm/icons/video.mjs:
lucide-react/dist/esm/icons/volume-2.mjs:
lucide-react/dist/esm/icons/wind.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.52.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=bundle.js.map
