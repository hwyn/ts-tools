"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = require("./config");
var _fs = require("./core/fs");
var _package = _interopRequireDefault(require("../package.json"));
var _clean = _interopRequireDefault(require("./clean"));
var _bundle = _interopRequireDefault(require("./bundle"));
var _run = _interopRequireDefault(require("./run"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

((pkg, buildDir) => async () => {
  await (0, _run.default)(_clean.default);
  await (0, _run.default)(_bundle.default);
  await (0, _fs.writeFile)(`${buildDir}/package.json`, JSON.stringify({
    private: true,
    scripts: {
      "start": "node server/index.js" },

    dependencies: pkg.dependencies }));

})(_package.default, _config.config.buildDir);exports.default = _default;