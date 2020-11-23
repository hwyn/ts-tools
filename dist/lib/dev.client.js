"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _express = _interopRequireDefault(require("express"));
var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));
var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));
var _compilation = require("./compilation");
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

const { architect: { build: { platform } } } = _config.project;
const { options } = platform.client || {};var _default = /*#__PURE__*/function () {var _ref = _asyncToGenerator(

  function* (app) {
    if (!_config.existenceClient) {
      return Promise.resolve();
    }

    const client = (0, _config.webpackDevClient)();
    const multiCompiler = (0, _webpack.default)(client);
    const promise = (0, _compilation.createCompilationPromise)('client', multiCompiler, client);

    app.use(_express.default.static(options.outputPath));
    app.use((0, _webpackDevMiddleware.default)(multiCompiler, {
      publicPath: client.output.publicPath,
      logLevel: 'silent' }));


    app.use((0, _webpackHotMiddleware.default)(multiCompiler, { log: false }));

    return promise;
  });return function (_x) {return _ref.apply(this, arguments);};}();exports.default = _default;