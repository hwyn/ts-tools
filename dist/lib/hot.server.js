"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.hotServer = void 0;var _vm = _interopRequireDefault(require("vm"));
var _webpack = _interopRequireDefault(require("webpack"));
var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));
var _compilation = require("./compilation");
var _path = _interopRequireDefault(require("path"));
var _config = require("../config");
var _fs = require("../core/fs");
var _lodash = require("lodash");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

const serverPlatform = (0, _config.platformConfig)('server');
const { hotContext, outputPath } = serverPlatform;

const hotServer = /*#__PURE__*/function () {var _ref = _asyncToGenerator(function* () {
    let vmContext;
    const contextSync = (0, _fs.requireSync)(hotContext);
    const hotVmContext = (0, _lodash.isFunction)(contextSync) ? contextSync(serverPlatform) : contextSync;
    const serverConfig = (0, _config.webpackDevServer)();
    const multiCompiler = (0, _webpack.default)(serverConfig);
    const { fileSystem } = (0, _webpackDevMiddleware.default)(multiCompiler, { logLevel: 'silent' });
    const promise = new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (vmContext && vmContext.global.hotHttpHost) {
          resolve(vmContext.global.hotHttpHost);
          clearInterval(interval);
        }
      }, 500);
      multiCompiler.hooks.done.tap('hot-server', (stats) => {
        if (vmContext && vmContext.global.hotHttpServer) {
          vmContext.global.hotHttpServer.close();
        }
        try {
          if (!stats.hasErrors()) {
            const code = fileSystem.readFileSync(_path.default.join(outputPath, 'server.js'), 'utf-8');
            const context = (0, _lodash.merge)({ ...global, require, process, console, global }, hotVmContext);
            vmContext = _vm.default.createContext(context);
            _vm.default.runInContext(code, vmContext);
          }
        } catch (e) {
          console.log(e);
          clearInterval(interval);
          reject(null);
        }
      });
    });
    yield (0, _compilation.createCompilationPromise)('server', multiCompiler, serverConfig);

    return promise;
  });return function hotServer() {return _ref.apply(this, arguments);};}();exports.hotServer = hotServer;