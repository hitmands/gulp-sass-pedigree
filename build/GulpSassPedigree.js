/**!
 ** @name gulp-sass-pedigree
 ** @version 1.1.9
 ** @author Giuseppe Mandato <gius.mand.developer@gmail.com> (https://github.com/hitmands)
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
/***/ (function(module, exports) {

module.exports = require("gulp-util");

/***/ }),
/* 1 */
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

var _fs = __webpack_require__(3);

var _fs2 = _interopRequireDefault(_fs);

var _gulpUtil = __webpack_require__(0);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _DependenciesGraph = __webpack_require__(5);

var _Helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLUGIN_NAME = exports.PLUGIN_NAME = 'gulp-sass-pedigree';

function create() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var graph = new _DependenciesGraph.DependenciesGraph();
  graph.options = options;
  graph.options.verbose = !!graph.options.verbose;

  return {
    graph: graph,

    study: function study() {

      function studyProjectStructure(file, enc, cb) {

        if (file && !file.isNull()) {
          var dir = _path2.default.dirname(file.path);
          var dirs = [dir];
          if (_path2.default.relative(dir, file.base)) {
            dirs.push(base);
          }
          void graph.onFileChange(file, file.contents.toString(), dirs.concat(graph.options.includePaths));
        }

        return cb(null, file);
      }

      return _through2.default.obj(studyProjectStructure);
    },
    getAncestors: function getAncestors() {
      function getAncestorsFromFile(file, enc, cb) {
        var _this = this;

        var start = Date.now();

        if (!file || file.isNull()) {
          return cb(null, file);
        }

        var dir = _path2.default.dirname(file.path);
        var dirs = [dir];
        if (_path2.default.relative(dir, file.base)) {
          dirs.push(file.base);
        }
        void graph.onFileChange(file, file.contents.toString(), dirs);

        var parents = graph.get(file.path).parents;

        if (parents.length) {
          var ancestors = graph.ascend(parents.slice());

          ancestors.forEach(function (p) {
            _this.push(new _gulpUtil2.default.File({
              cwd: file.cwd,
              path: p,
              base: _path2.default.dirname(p),
              contents: file.type === 'stream' ? _fs2.default.createReadStream(p) : _fs2.default.readFileSync(p)
            }));
          });

          var origin = _gulpUtil2.default.colors.green(JSON.stringify(_path2.default.basename(file.path)));
          var info = [_gulpUtil2.default.colors.green(ancestors.length) + ' ancestors for ' + origin];

          if (graph.options.verbose) {
            info.push(_gulpUtil2.default.colors.green(JSON.stringify(ancestors, null, 2)));
          }

          _Helpers.log.apply(undefined, ['info'].concat(info, [_gulpUtil2.default.colors.magenta(Date.now() - start + ' ms')]));
        }

        return cb(null, file);
      }

      return _through2.default.obj(getAncestorsFromFile);
    }
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prune = prune;
exports.fileExists = fileExists;
exports.log = log;

var _gulpUtil = __webpack_require__(0);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _fs = __webpack_require__(3);

var _fs2 = _interopRequireDefault(_fs);

var _GulpSassPedigree = __webpack_require__(1);

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fs");

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

var _gulpUtil = __webpack_require__(0);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _Helpers = __webpack_require__(2);

var _stripScssImports = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DependenciesGraph = exports.DependenciesGraph = function () {
  _createClass(DependenciesGraph, null, [{
    key: 'createStack',
    value: function createStack() {

      return Object.assign(Object.create(null), { children: [], parents: [] });
    }
  }, {
    key: 'updateChildren',
    value: function updateChildren(oldDeps, newDeps) {

      return (0, _Helpers.prune)([].concat(newDeps));
    }
  }]);

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
    key: 'ascend',
    value: function ascend(list) {
      var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!list.length) {
        return (0, _Helpers.prune)(res);
      }

      var p = list.shift();
      var dep = this.cache[p];

      return dep.parents.length ? this.ascend(list.concat(dep.parents), res) : this.ascend(list, res.concat(p));
    }
  }, {
    key: 'onFileChange',
    value: function onFileChange(file, content, dirs) {
      var imports = this.updateKeys((0, _stripScssImports.stripScssImports)(content), dirs, file.path);

      if (!(file.path in this.cache)) {
        this.cache[file.path] = DependenciesGraph.createStack();
      }

      this.cache[file.path].children = DependenciesGraph.updateChildren(this.cache[file.path].children, imports);

      void this.updateParents();
    }
  }, {
    key: 'updateParents',
    value: function updateParents() {
      var _this = this;

      for (var k in this.cache) {
        //noinspection JSUnfilteredForInLoop
        this.cache[k].parents = [];
      }

      var _loop = function _loop(_k) {
        //noinspection JSUnfilteredForInLoop
        _this.cache[_k].children.forEach(function (file) {

          //noinspection JSUnfilteredForInLoop
          if (!~_this.cache[file].parents.indexOf(_k)) {
            //noinspection JSUnfilteredForInLoop
            _this.cache[file].parents.push(_k);
          }
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
          var dir = dirs[i];
          var a = _path2.default.resolve(dir, filename);
          var b = a.replace(/([^/\\]*$)/, '_$1');

          if (a in _this2.cache) {

            return res.concat(a);
          }

          if (b in _this2.cache) {

            return res.concat(b);
          }

          if (_this2.fileExists(a)) {
            _this2.cache[a] = DependenciesGraph.createStack();

            return res.concat(a);
          }

          if (_this2.fileExists(b)) {
            _this2.cache[b] = DependenciesGraph.createStack();

            return res.concat(b);
          }
        }

        _this2.log('warn', _gulpUtil2.default.colors.green(JSON.stringify(filename)) + ' not found in ' + _gulpUtil2.default.colors.green(JSON.stringify(dirs, null, 2)) + ' of ' + _gulpUtil2.default.colors.green(JSON.stringify(_path2.default.basename(importer))));

        return res;
      }, []);
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

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=GulpSassPedigree.js.map