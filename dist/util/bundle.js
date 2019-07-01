"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.webpackRun = webpackRun;exports.default = exports.isRun = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const isRun = webpackconfig => {
  return Array.isArray(webpackconfig.entry) ? !!webpackconfig.entry.length : !!Object.keys(webpackconfig.entry).length;
};exports.isRun = isRun;

function webpackRun(webpackconfig, _stast) {
  if (Array.isArray(webpackconfig)) {
    return Promise.all(webpackconfig.map(config => webpackRun(config, config.stats)));
  }
  return new Promise((resolve, reject) => {
    if (!isRun(webpackconfig)) {
      return resolve();
    }
    const multiCompiler = (0, _webpack.default)(webpackconfig);
    multiCompiler.run((err, stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(webpackconfig.stats || _stast));
      resolve();
    });
  });
}var _default =

async () => {
  return webpackRun((0, _config.webpackDll)()).then(() => webpackRun([
  (0, _config.webpackServerEntry)(),
  (0, _config.webpackClient)()])).
  then(() => webpackRun((0, _config.webpackServer)()));
};exports.default = _default;