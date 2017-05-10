/**!
 ** @name gulp-sass-pedigree
 ** @version 2.1.7
 ** @author Giuseppe Mandato <gius.mand.developer@gmail.com> (https://github.com/hitmands)
 ** @contributors ["Luca Volta <luca.volta@gmail.com> (https://github.com/lucavolta)"]
 ** @url https://github.com/hitmands/gulp-sass-pedigree#readme
 ** @description Incremental Caching System for Gulp and NodeSass
 ** @keywords [gulpplugin, sass, libsass, gulp, cache, incremental cache]
 ** @entry build/GulpSassPedigree.js
 ** @license MIT License
***/

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN_NAME = undefined;
exports.create = create;

var _through = __webpack_require__(7);

var _through2 = _interopRequireDefault(_through);

var _path = __webpack_require__(4);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(2);

var _fs2 = _interopRequireDefault(_fs);

var _gulpUtil = __webpack_require__(3);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _DependenciesGraph = __webpack_require__(5);

var _Helpers = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PLUGIN_NAME = exports.PLUGIN_NAME = 'gulp-sass-pedigree';
var getFileChangedArgs = function getFileChangedArgs(graph, file) {
  var dir = _path2.default.dirname(file.path);
  var dirs = [dir];

  if (_path2.default.relative(dir, file.base)) {
    dirs.push(file.base);
  }

  return [file, file.contents.toString(), dirs.concat(graph.options.includePaths)];
};

function create() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var graph = new _DependenciesGraph.DependenciesGraph();
  graph.options = options;
  graph.options.verbose = !!graph.options.verbose;

  return {
    graph: graph,
    study: function study() {

      return _through2.default.obj(function studyProjectStructure(file, enc, cb) {
        if (file && !file.isNull()) {
          void graph.onFileChange.apply(graph, _toConsumableArray(getFileChangedArgs(graph, file)));
        }

        return cb(null, file);
      });
    },
    getAncestors: function getAncestors() {

      return _through2.default.obj(function getAncestorsFromFile(file, enc, cb) {
        if (file && !file.isNull()) {
          var start = Date.now();

          void graph.onFileChange.apply(graph, _toConsumableArray(getFileChangedArgs(graph, file)));
          var parents = graph.get(file.path).parents;

          if (parents.length) {
            var ancestors = void 0;

            try {
              ancestors = graph.ascend(parents.slice());
            } catch (e) {

              (0, _Helpers.log)('warn', 'possible circular dependency at ' + (0, _Helpers.green)(file.path));
              if (graph.options.verbose) {
                (0, _Helpers.log)('error', e);
              }
            }

            if (ancestors) {
              for (var i = 0; i < ancestors.length; i++) {
                var p = ancestors[i];

                this.push(
                /* eslint object-property-newline: 0 */
                new _gulpUtil2.default.File({
                  path: p, cwd: file.cwd, base: _path2.default.dirname(p),
                  contents: file.type === 'stream' ? _fs2.default.createReadStream(p) : _fs2.default.readFileSync(p)
                }));
              }

              var filename = (0, _Helpers.green)(JSON.stringify(_path2.default.basename(file.path)));
              var info = [(0, _Helpers.green)(ancestors.length) + ' ancestors for ' + filename];

              if (graph.options.verbose) {
                info.push((0, _Helpers.green)(JSON.stringify(ancestors, null, 2)));
              }

              _Helpers.log.apply(undefined, ['info'].concat(info, [_gulpUtil2.default.colors.magenta(Date.now() - start + ' ms')]));
            }
          }
        }

        return cb(null, file);
      });
    }
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.green = undefined;
exports.prune = prune;
exports.fileExists = fileExists;
exports.log = log;

var _gulpUtil = __webpack_require__(3);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _fs = __webpack_require__(2);

var _fs2 = _interopRequireDefault(_fs);

var _GulpSassPedigree = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prune(arr) {
  return arr.filter(function (child, i, list) {
    return child && i === list.lastIndexOf(child);
  });
}

function fileExists(path) {
  return _fs2.default.existsSync(path);
}

function log(type) {
  var color = void 0;

  switch (type) {
    case 'warn':
      color = 'yellow';
      break;

    case 'error':
      color = 'red';
      break;

    default:
      color = 'cyan';
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _gulpUtil2.default.log.apply(_gulpUtil2.default, [_gulpUtil2.default.colors[color](_GulpSassPedigree.PLUGIN_NAME + '::' + type)].concat(args));
}

var green = exports.green = function green(msg) {
  return _gulpUtil2.default.colors.green(msg);
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("gulp-util");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DependenciesGraph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(4);

var _path2 = _interopRequireDefault(_path);

var _Helpers = __webpack_require__(1);

var _stripScssImports = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DependenciesGraph = exports.DependenciesGraph = function () {
  function DependenciesGraph() {
    _classCallCheck(this, DependenciesGraph);

    this.cache = Object.create(null);
    this._options = Object.assign(Object.create(null), {
      includePaths: [],
      ext: '.scss',
      verbose: false
    });

    this.log = _Helpers.log;
    this.fileExists = _Helpers.fileExists;
  }

  _createClass(DependenciesGraph, [{
    key: 'get',
    value: function get(path) {

      return this.cache[path] || null;
    }
  }, {
    key: 'has',
    value: function has(path) {

      return path in this.cache;
    }
  }, {
    key: 'set',
    value: function set(path) {
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var parents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      this.cache[path] = Object.assign(Object.create(null), { children: children, parents: parents });
    }
  }, {
    key: 'onFileChange',
    value: function onFileChange(file) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var dirs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var imports = this.updateKeys((0, _stripScssImports.stripScssImports)(content), dirs, file.path);

      this.has(file.path) || this.set(file.path);
      this.get(file.path).children = imports;
      void this.updateParents();
    }
  }, {
    key: 'updateParents',
    value: function updateParents() {
      var _this = this;

      for (var k in this.cache) {
        // noinspection JSUnfilteredForInLoop
        this.get(k).parents = [];
      }

      var _loop = function _loop(_k) {
        // noinspection JSUnfilteredForInLoop
        _this.get(_k).children.forEach(function (file) {
          var parents = _this.get(file).parents;

          // noinspection JSUnfilteredForInLoop
          ~parents.indexOf(_k) || parents.push(_k);
        });
      };

      for (var _k in this.cache) {
        _loop(_k);
      }
    }
  }, {
    key: 'updateKeys',
    value: function updateKeys(files, dirs, importer) {
      var _this2 = this;

      return files.reduce(function (res, filename) {
        for (var i = 0; i < dirs.length; i++) {
          var a = _path2.default.resolve(dirs[i], filename);
          var paths = [a, a.replace(/([^/\\]*$)/, '_$1')];

          for (var j = 0; j < paths.length; j++) {
            var p = paths[j];

            if (_this2.has(p)) {
              return res.concat(p);
            }

            if (_this2.fileExists(p)) {
              _this2.set(p);
              return res.concat(p);
            }
          }
        }

        var log = function log() {
          return (0, _Helpers.green)(JSON.stringify.apply(JSON, arguments));
        };
        _this2.log('warn', log(filename) + ' not found in ' + log(dirs, null, 2) + ' of ' + log(_path2.default.basename(importer)));

        return res;
      }, []);
    }
  }, {
    key: 'ascend',
    value: function ascend(list) {
      var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!list.length) {
        return (0, _Helpers.prune)(res);
      }

      var p = list.shift();
      var parents = this.get(p).parents;

      return parents.length ? this.ascend(list.concat(parents), res) : this.ascend(list, res.concat(p));
    }
  }, {
    key: 'options',
    set: function set(v) {

      this._options = Object.assign(this._options, v || {});
    },
    get: function get() {

      return this._options;
    }
  }, {
    key: 'length',
    get: function get() {

      return Object.keys(this.cache).length;
    }
  }]);

  return DependenciesGraph;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripScssImports = stripScssImports;
function stripScssImports(textContent) {

  return (
  // TODO: Handle comments //@import ""; or /* @import ""; */
  textContent.match(/(?:@import\s+)([^;]*)/g) || []).reduce(function (res, filename) {
    return res.concat(filename.replace(/@import|["'\s]/g, '').split(/,/).map(function (p) {
      return p.replace(/\.scss$/, '') + '.scss';
    }));
  }, []);
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("through2");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=GulpSassPedigree.js.map