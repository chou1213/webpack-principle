(function (graph) {
    function require(file) {
        function absRequire(relPath) {
            return require(graph[file].deps[relPath])
        }
        var exports = {};
        (function (require,exports,code) {
            eval(code)
        })(absRequire,exports,graph[file].code)
        return exports
    }
    require('./src/index.js')
    })({"./src/index.js":{"deps":{"./add.js":"./src\\add.js"},"code":"\"use strict\";\n\nrequire(\"core-js/modules/es6.set.js\");\n\nrequire(\"core-js/modules/es6.string.iterator.js\");\n\nrequire(\"core-js/modules/es6.object.to-string.js\");\n\nrequire(\"core-js/modules/es6.array.iterator.js\");\n\nrequire(\"core-js/modules/web.dom.iterable.js\");\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log((0, _add.default)(1, 2));\nvar num = 1;\nvar set = new Set();"},"./src\\add.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = function _default(a, b) {\n  return a + b;\n};\n\nexports.default = _default;"}})