"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.webpackRun = webpackRun;exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function webpackRun(webpackconfig, _stast) {
  if (Array.isArray(webpackconfig)) {
    return Promise.all(webpackconfig.map(config => webpackRun(config, config.stats)));
  }
  return new Promise((resolve, reject) => {
    const isRun = Array.isArray(webpackconfig.entry) ? !!webpackconfig.entry.length : !!Object.keys(webpackconfig.entry).length;
    if (!isRun) {
      return resolve();
    }
    (0, _webpack.default)(webpackconfig).run((err, stats) => {
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