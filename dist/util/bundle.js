"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.webpackRun = webpackRun;exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function webpackRun(webpackconfig, _stast) {
  return new Promise((resolve, reject) => {
    (0, _webpack.default)(webpackconfig).run((err, stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(_stast));
      resolve();
    });
  });
}var _default =


async () => {
  const dll = (0, _config.webpackDll)();
  const isCanDll = Array.isArray(dll.entry) ? !!dll.entry.length : !!Object.keys(dll.entry).length;
  return (isCanDll ? webpackRun(dll, dll.stats) : Promise.resolve()).then(() => {
    const client = (0, _config.webpackClient)();
    return webpackRun([client, (0, _config.webpackServer)()], client.stats);
  });
};exports.default = _default;