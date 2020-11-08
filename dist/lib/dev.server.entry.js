"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _bundle = require("../util/bundle");
var _config = require("../config");
var _compilation = require("./compilation");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var _default = /*#__PURE__*/_asyncToGenerator(

function* () {
  const config = (0, _config.webpackDevServerEntry)();
  if (!(0, _bundle.isRun)(config)) {
    return Promise.resolve();
  }
  const multiCompiler = (0, _webpack.default)(config);
  const promise = (0, _compilation.createCompilationPromise)('server-entry', multiCompiler, config);
  multiCompiler.watch({
    aggregateTimeout: 300 },
  () => {});

  return promise;
});exports.default = _default;