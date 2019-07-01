"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _bundle = require("../util/bundle");
var _config = require("../config");
var _compilation = require("./compilation");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

async app => {
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
  // return webpackRun(config, config.stats);
};exports.default = _default;