"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _config = require("./config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

async () => {
  const client = (0, _config.webpackClient)();
  return new Promise((resolve, reject) => {
    (0, _webpack.default)([client, (0, _config.webpackServer)()]).run((err, stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(client.stats));
      resolve();
    });
  });
};exports.default = _default;