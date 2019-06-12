"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));
var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));
var _compilation = require("./compilation");
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

async app => {
  const config = (0, _config.webpackDevClient)();
  const multiCompiler = (0, _webpack.default)(config);
  const promise = (0, _compilation.createCompilationPromise)('client', multiCompiler, config);
  app.use((0, _webpackDevMiddleware.default)(multiCompiler, {
    publicPath: config.output.publicPath,
    logLevel: 'silent' }));


  app.use((0, _webpackHotMiddleware.default)(multiCompiler, {
    log: false }));


  return promise;
};exports.default = _default;