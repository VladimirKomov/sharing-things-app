import {
  __commonJS
} from "./chunk-DC5AMYBS.js";

// node_modules/redux-logger/dist/redux-logger.js
var require_redux_logger = __commonJS({
  "node_modules/redux-logger/dist/redux-logger.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.reduxLogger = e.reduxLogger || {});
    }(exports, function(e) {
      "use strict";
      function t(e2, t2) {
        e2.super_ = t2, e2.prototype = Object.create(t2.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } });
      }
      function r(e2, t2) {
        Object.defineProperty(this, "kind", { value: e2, enumerable: true }), t2 && t2.length && Object.defineProperty(this, "path", { value: t2, enumerable: true });
      }
      function n(e2, t2, r2) {
        n.super_.call(this, "E", e2), Object.defineProperty(this, "lhs", { value: t2, enumerable: true }), Object.defineProperty(this, "rhs", { value: r2, enumerable: true });
      }
      function o(e2, t2) {
        o.super_.call(this, "N", e2), Object.defineProperty(this, "rhs", { value: t2, enumerable: true });
      }
      function i(e2, t2) {
        i.super_.call(this, "D", e2), Object.defineProperty(this, "lhs", { value: t2, enumerable: true });
      }
      function a(e2, t2, r2) {
        a.super_.call(this, "A", e2), Object.defineProperty(this, "index", { value: t2, enumerable: true }), Object.defineProperty(this, "item", { value: r2, enumerable: true });
      }
      function f(e2, t2, r2) {
        var n2 = e2.slice((r2 || t2) + 1 || e2.length);
        return e2.length = t2 < 0 ? e2.length + t2 : t2, e2.push.apply(e2, n2), e2;
      }
      function u(e2) {
        var t2 = "undefined" == typeof e2 ? "undefined" : N(e2);
        return "object" !== t2 ? t2 : e2 === Math ? "math" : null === e2 ? "null" : Array.isArray(e2) ? "array" : "[object Date]" === Object.prototype.toString.call(e2) ? "date" : "function" == typeof e2.toString && /^\/.*\//.test(e2.toString()) ? "regexp" : "object";
      }
      function l(e2, t2, r2, c2, s2, d2, p2) {
        s2 = s2 || [], p2 = p2 || [];
        var g2 = s2.slice(0);
        if ("undefined" != typeof d2) {
          if (c2) {
            if ("function" == typeof c2 && c2(g2, d2)) return;
            if ("object" === ("undefined" == typeof c2 ? "undefined" : N(c2))) {
              if (c2.prefilter && c2.prefilter(g2, d2)) return;
              if (c2.normalize) {
                var h2 = c2.normalize(g2, d2, e2, t2);
                h2 && (e2 = h2[0], t2 = h2[1]);
              }
            }
          }
          g2.push(d2);
        }
        "regexp" === u(e2) && "regexp" === u(t2) && (e2 = e2.toString(), t2 = t2.toString());
        var y2 = "undefined" == typeof e2 ? "undefined" : N(e2), v2 = "undefined" == typeof t2 ? "undefined" : N(t2), b2 = "undefined" !== y2 || p2 && p2[p2.length - 1].lhs && p2[p2.length - 1].lhs.hasOwnProperty(d2), m2 = "undefined" !== v2 || p2 && p2[p2.length - 1].rhs && p2[p2.length - 1].rhs.hasOwnProperty(d2);
        if (!b2 && m2) r2(new o(g2, t2));
        else if (!m2 && b2) r2(new i(g2, e2));
        else if (u(e2) !== u(t2)) r2(new n(g2, e2, t2));
        else if ("date" === u(e2) && e2 - t2 !== 0) r2(new n(g2, e2, t2));
        else if ("object" === y2 && null !== e2 && null !== t2) if (p2.filter(function(t3) {
          return t3.lhs === e2;
        }).length) e2 !== t2 && r2(new n(g2, e2, t2));
        else {
          if (p2.push({ lhs: e2, rhs: t2 }), Array.isArray(e2)) {
            var w2;
            e2.length;
            for (w2 = 0; w2 < e2.length; w2++) w2 >= t2.length ? r2(new a(g2, w2, new i(void 0, e2[w2]))) : l(e2[w2], t2[w2], r2, c2, g2, w2, p2);
            for (; w2 < t2.length; ) r2(new a(g2, w2, new o(void 0, t2[w2++])));
          } else {
            var x2 = Object.keys(e2), S2 = Object.keys(t2);
            x2.forEach(function(n2, o2) {
              var i2 = S2.indexOf(n2);
              i2 >= 0 ? (l(e2[n2], t2[n2], r2, c2, g2, n2, p2), S2 = f(S2, i2)) : l(e2[n2], void 0, r2, c2, g2, n2, p2);
            }), S2.forEach(function(e3) {
              l(void 0, t2[e3], r2, c2, g2, e3, p2);
            });
          }
          p2.length = p2.length - 1;
        }
        else e2 !== t2 && ("number" === y2 && isNaN(e2) && isNaN(t2) || r2(new n(g2, e2, t2)));
      }
      function c(e2, t2, r2, n2) {
        return n2 = n2 || [], l(e2, t2, function(e3) {
          e3 && n2.push(e3);
        }, r2), n2.length ? n2 : void 0;
      }
      function s(e2, t2, r2) {
        if (r2.path && r2.path.length) {
          var n2, o2 = e2[t2], i2 = r2.path.length - 1;
          for (n2 = 0; n2 < i2; n2++) o2 = o2[r2.path[n2]];
          switch (r2.kind) {
            case "A":
              s(o2[r2.path[n2]], r2.index, r2.item);
              break;
            case "D":
              delete o2[r2.path[n2]];
              break;
            case "E":
            case "N":
              o2[r2.path[n2]] = r2.rhs;
          }
        } else switch (r2.kind) {
          case "A":
            s(e2[t2], r2.index, r2.item);
            break;
          case "D":
            e2 = f(e2, t2);
            break;
          case "E":
          case "N":
            e2[t2] = r2.rhs;
        }
        return e2;
      }
      function d(e2, t2, r2) {
        if (e2 && t2 && r2 && r2.kind) {
          for (var n2 = e2, o2 = -1, i2 = r2.path ? r2.path.length - 1 : 0; ++o2 < i2; ) "undefined" == typeof n2[r2.path[o2]] && (n2[r2.path[o2]] = "number" == typeof r2.path[o2] ? [] : {}), n2 = n2[r2.path[o2]];
          switch (r2.kind) {
            case "A":
              s(r2.path ? n2[r2.path[o2]] : n2, r2.index, r2.item);
              break;
            case "D":
              delete n2[r2.path[o2]];
              break;
            case "E":
            case "N":
              n2[r2.path[o2]] = r2.rhs;
          }
        }
      }
      function p(e2, t2, r2) {
        if (r2.path && r2.path.length) {
          var n2, o2 = e2[t2], i2 = r2.path.length - 1;
          for (n2 = 0; n2 < i2; n2++) o2 = o2[r2.path[n2]];
          switch (r2.kind) {
            case "A":
              p(o2[r2.path[n2]], r2.index, r2.item);
              break;
            case "D":
              o2[r2.path[n2]] = r2.lhs;
              break;
            case "E":
              o2[r2.path[n2]] = r2.lhs;
              break;
            case "N":
              delete o2[r2.path[n2]];
          }
        } else switch (r2.kind) {
          case "A":
            p(e2[t2], r2.index, r2.item);
            break;
          case "D":
            e2[t2] = r2.lhs;
            break;
          case "E":
            e2[t2] = r2.lhs;
            break;
          case "N":
            e2 = f(e2, t2);
        }
        return e2;
      }
      function g(e2, t2, r2) {
        if (e2 && t2 && r2 && r2.kind) {
          var n2, o2, i2 = e2;
          for (o2 = r2.path.length - 1, n2 = 0; n2 < o2; n2++) "undefined" == typeof i2[r2.path[n2]] && (i2[r2.path[n2]] = {}), i2 = i2[r2.path[n2]];
          switch (r2.kind) {
            case "A":
              p(i2[r2.path[n2]], r2.index, r2.item);
              break;
            case "D":
              i2[r2.path[n2]] = r2.lhs;
              break;
            case "E":
              i2[r2.path[n2]] = r2.lhs;
              break;
            case "N":
              delete i2[r2.path[n2]];
          }
        }
      }
      function h(e2, t2, r2) {
        if (e2 && t2) {
          var n2 = function(n3) {
            r2 && !r2(e2, t2, n3) || d(e2, t2, n3);
          };
          l(e2, t2, n2);
        }
      }
      function y(e2) {
        return "color: " + F[e2].color + "; font-weight: bold";
      }
      function v(e2) {
        var t2 = e2.kind, r2 = e2.path, n2 = e2.lhs, o2 = e2.rhs, i2 = e2.index, a2 = e2.item;
        switch (t2) {
          case "E":
            return [r2.join("."), n2, "→", o2];
          case "N":
            return [r2.join("."), o2];
          case "D":
            return [r2.join(".")];
          case "A":
            return [r2.join(".") + "[" + i2 + "]", a2];
          default:
            return [];
        }
      }
      function b(e2, t2, r2, n2) {
        var o2 = c(e2, t2);
        try {
          n2 ? r2.groupCollapsed("diff") : r2.group("diff");
        } catch (e3) {
          r2.log("diff");
        }
        o2 ? o2.forEach(function(e3) {
          var t3 = e3.kind, n3 = v(e3);
          r2.log.apply(r2, ["%c " + F[t3].text, y(t3)].concat(P(n3)));
        }) : r2.log("—— no diff ——");
        try {
          r2.groupEnd();
        } catch (e3) {
          r2.log("—— diff end —— ");
        }
      }
      function m(e2, t2, r2, n2) {
        switch ("undefined" == typeof e2 ? "undefined" : N(e2)) {
          case "object":
            return "function" == typeof e2[n2] ? e2[n2].apply(e2, P(r2)) : e2[n2];
          case "function":
            return e2(t2);
          default:
            return e2;
        }
      }
      function w(e2) {
        var t2 = e2.timestamp, r2 = e2.duration;
        return function(e3, n2, o2) {
          var i2 = ["action"];
          return i2.push("%c" + String(e3.type)), t2 && i2.push("%c@ " + n2), r2 && i2.push("%c(in " + o2.toFixed(2) + " ms)"), i2.join(" ");
        };
      }
      function x(e2, t2) {
        var r2 = t2.logger, n2 = t2.actionTransformer, o2 = t2.titleFormatter, i2 = void 0 === o2 ? w(t2) : o2, a2 = t2.collapsed, f2 = t2.colors, u2 = t2.level, l2 = t2.diff, c2 = "undefined" == typeof t2.titleFormatter;
        e2.forEach(function(o3, s2) {
          var d2 = o3.started, p2 = o3.startedTime, g2 = o3.action, h2 = o3.prevState, y2 = o3.error, v2 = o3.took, w2 = o3.nextState, x2 = e2[s2 + 1];
          x2 && (w2 = x2.prevState, v2 = x2.started - d2);
          var S2 = n2(g2), k2 = "function" == typeof a2 ? a2(function() {
            return w2;
          }, g2, o3) : a2, j2 = D(p2), E2 = f2.title ? "color: " + f2.title(S2) + ";" : "", A2 = ["color: gray; font-weight: lighter;"];
          A2.push(E2), t2.timestamp && A2.push("color: gray; font-weight: lighter;"), t2.duration && A2.push("color: gray; font-weight: lighter;");
          var O2 = i2(S2, j2, v2);
          try {
            k2 ? f2.title && c2 ? r2.groupCollapsed.apply(r2, ["%c " + O2].concat(A2)) : r2.groupCollapsed(O2) : f2.title && c2 ? r2.group.apply(r2, ["%c " + O2].concat(A2)) : r2.group(O2);
          } catch (e3) {
            r2.log(O2);
          }
          var N2 = m(u2, S2, [h2], "prevState"), P2 = m(u2, S2, [S2], "action"), C2 = m(u2, S2, [y2, h2], "error"), F2 = m(u2, S2, [w2], "nextState");
          if (N2) if (f2.prevState) {
            var L2 = "color: " + f2.prevState(h2) + "; font-weight: bold";
            r2[N2]("%c prev state", L2, h2);
          } else r2[N2]("prev state", h2);
          if (P2) if (f2.action) {
            var T2 = "color: " + f2.action(S2) + "; font-weight: bold";
            r2[P2]("%c action    ", T2, S2);
          } else r2[P2]("action    ", S2);
          if (y2 && C2) if (f2.error) {
            var M = "color: " + f2.error(y2, h2) + "; font-weight: bold;";
            r2[C2]("%c error     ", M, y2);
          } else r2[C2]("error     ", y2);
          if (F2) if (f2.nextState) {
            var _ = "color: " + f2.nextState(w2) + "; font-weight: bold";
            r2[F2]("%c next state", _, w2);
          } else r2[F2]("next state", w2);
          l2 && b(h2, w2, r2, k2);
          try {
            r2.groupEnd();
          } catch (e3) {
            r2.log("—— log end ——");
          }
        });
      }
      function S() {
        var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t2 = Object.assign({}, L, e2), r2 = t2.logger, n2 = t2.stateTransformer, o2 = t2.errorTransformer, i2 = t2.predicate, a2 = t2.logErrors, f2 = t2.diffPredicate;
        if ("undefined" == typeof r2) return function() {
          return function(e3) {
            return function(t3) {
              return e3(t3);
            };
          };
        };
        if (e2.getState && e2.dispatch) return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"), function() {
          return function(e3) {
            return function(t3) {
              return e3(t3);
            };
          };
        };
        var u2 = [];
        return function(e3) {
          var r3 = e3.getState;
          return function(e4) {
            return function(l2) {
              if ("function" == typeof i2 && !i2(r3, l2)) return e4(l2);
              var c2 = {};
              u2.push(c2), c2.started = O.now(), c2.startedTime = /* @__PURE__ */ new Date(), c2.prevState = n2(r3()), c2.action = l2;
              var s2 = void 0;
              if (a2) try {
                s2 = e4(l2);
              } catch (e5) {
                c2.error = o2(e5);
              }
              else s2 = e4(l2);
              c2.took = O.now() - c2.started, c2.nextState = n2(r3());
              var d2 = t2.diff && "function" == typeof f2 ? f2(r3, l2) : t2.diff;
              if (x(u2, Object.assign({}, t2, { diff: d2 })), u2.length = 0, c2.error) throw c2.error;
              return s2;
            };
          };
        };
      }
      var k, j, E = function(e2, t2) {
        return new Array(t2 + 1).join(e2);
      }, A = function(e2, t2) {
        return E("0", t2 - e2.toString().length) + e2;
      }, D = function(e2) {
        return A(e2.getHours(), 2) + ":" + A(e2.getMinutes(), 2) + ":" + A(e2.getSeconds(), 2) + "." + A(e2.getMilliseconds(), 3);
      }, O = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance : Date, N = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
        return typeof e2;
      } : function(e2) {
        return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
      }, P = function(e2) {
        if (Array.isArray(e2)) {
          for (var t2 = 0, r2 = Array(e2.length); t2 < e2.length; t2++) r2[t2] = e2[t2];
          return r2;
        }
        return Array.from(e2);
      }, C = [];
      k = "object" === ("undefined" == typeof global ? "undefined" : N(global)) && global ? global : "undefined" != typeof window ? window : {}, j = k.DeepDiff, j && C.push(function() {
        "undefined" != typeof j && k.DeepDiff === c && (k.DeepDiff = j, j = void 0);
      }), t(n, r), t(o, r), t(i, r), t(a, r), Object.defineProperties(c, { diff: { value: c, enumerable: true }, observableDiff: { value: l, enumerable: true }, applyDiff: { value: h, enumerable: true }, applyChange: { value: d, enumerable: true }, revertChange: { value: g, enumerable: true }, isConflict: { value: function() {
        return "undefined" != typeof j;
      }, enumerable: true }, noConflict: { value: function() {
        return C && (C.forEach(function(e2) {
          e2();
        }), C = null), c;
      }, enumerable: true } });
      var F = { E: { color: "#2196F3", text: "CHANGED:" }, N: { color: "#4CAF50", text: "ADDED:" }, D: { color: "#F44336", text: "DELETED:" }, A: { color: "#2196F3", text: "ARRAY:" } }, L = { level: "log", logger: console, logErrors: true, collapsed: void 0, predicate: void 0, duration: false, timestamp: true, stateTransformer: function(e2) {
        return e2;
      }, actionTransformer: function(e2) {
        return e2;
      }, errorTransformer: function(e2) {
        return e2;
      }, colors: { title: function() {
        return "inherit";
      }, prevState: function() {
        return "#9E9E9E";
      }, action: function() {
        return "#03A9F4";
      }, nextState: function() {
        return "#4CAF50";
      }, error: function() {
        return "#F20404";
      } }, diff: false, diffPredicate: void 0, transformer: void 0 }, T = function() {
        var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t2 = e2.dispatch, r2 = e2.getState;
        return "function" == typeof t2 || "function" == typeof r2 ? S()({ dispatch: t2, getState: r2 }) : void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n");
      };
      e.defaults = L, e.createLogger = S, e.logger = T, e.default = T, Object.defineProperty(e, "__esModule", { value: true });
    });
  }
});
export default require_redux_logger();
//# sourceMappingURL=redux-logger.js.map
