"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = require("../config");
var _fs = require("../core/fs");
var _package = _interopRequireDefault(require("../../package.json"));
var _clean = _interopRequireDefault(require("./clean"));
var _bundle = _interopRequireDefault(require("./bundle"));
var _run = _interopRequireDefault(require("./run"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var _default =

((pkg, buildDir) => /*#__PURE__*/_asyncToGenerator(function* () {
  yield (0, _run.default)(_clean.default);
  yield (0, _run.default)(_bundle.default);
  yield (0, _fs.writeFile)(`${buildDir}/package.json`, JSON.stringify({
    private: true,
    scripts: {
      "start": "node server.js" },

    dependencies: pkg.dependencies }));

}))(_package.default, _config.config.buildDir);exports.default = _default;