/**!
 ** @name gulp-sass-pedigree
 ** @version 1.1.7
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

module.exports = require("fs");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPedigree = createPedigree;
exports.getAncestors = getAncestors;

var _through = __webpack_require__(7);

var _through2 = _interopRequireDefault(_through);

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(0);

var _fs2 = _interopRequireDefault(_fs);

var _gulpUtil = __webpack_require__(6);

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _DependenciesGraph = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = new _DependenciesGraph.DependenciesGraph();
var PLUGIN_NAME = 'gulp-sass-pedigree';

var options = {
  includePaths: []
};

function sassPedigreeStudy(file, enc, cb) {
  graph.options = options;

  if (file && !file.isNull()) {
    void graph.onFileChange(file, file.contents.toString(), [_path2.default.dirname(file.path), file.base]);
  }

  return cb(null, file);
}

function sassPedigreeGetAncestors(file, enc, cb) {
  var _this = this;

  var start = Date.now();

  if (!file || file.isNull()) {
    return cb(null, file);
  }

  void graph.onFileChange(file, file.contents.toString(), [_path2.default.dirname(file.path), file.base]);

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

    var stats = {
      ancestors: ancestors.length,
      file: file.filename
    };

    _gulpUtil2.default.log(_gulpUtil2.default.colors.bgYellow(' ' + PLUGIN_NAME + ': ' + JSON.stringify(stats) + ' '), _gulpUtil2.default.colors.magenta(Date.now() - start + ' ms'));
  }

  return cb(null, file);
}

function createPedigree(_options) {
  options = Object.assign({}, options, _options);

  return _through2.default.obj(sassPedigreeStudy);
}
function getAncestors() {
  return _through2.default.obj(sassPedigreeGetAncestors);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DependenciesGraph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(0);

var _fs2 = _interopRequireDefault(_fs);

var _Helpers = __webpack_require__(4);

var _stripScssImports = __webpack_require__(5);

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
  }

  _createClass(DependenciesGraph, [{
    key: 'get',
    value: function get(path) {

      return this.cache[path];
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
    value: function onFileChange(file, content, dir) {
      var imports = this.updateKeys((0, _stripScssImports.stripScssImports)(content), dir);

      if (!this.cache[file.path]) {
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
    value: function updateKeys(files, dirs) {
      var _this2 = this;

      return files.map(function (filename) {
        for (var i = 0; i < dirs.length; i++) {
          var dir = dirs[i];
          var a = _path2.default.resolve(dir, filename);
          var b = a.replace(/([^/\\]*$)/, '_$1');

          if (a in _this2.cache) {

            return a;
          }

          if (b in _this2.cache) {

            return b;
          }

          if (_fs2.default.existsSync(a)) {
            _this2.cache[a] = DependenciesGraph.createStack();

            return a;
          }

          if (_fs2.default.existsSync(b)) {
            _this2.cache[b] = DependenciesGraph.createStack();

            return b;
          }
        }
      }, []);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prune = prune;
function prune(arr) {
  return arr.filter(function (child, i, list) {
    return child && i === list.lastIndexOf(child);
  });
}

/***/ }),
/* 5 */
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
    return res.concat(filename.replace(/@import/, '').replace(/["']/g, '').trim().split(/,\s*/).map(function (p) {
      return p.replace(/\.scss$/, '') + '.scss';
    }));
  }, []);
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("gulp-util");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("through2");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
//# sourceMappingURL=GulpSassPedigree.js.map