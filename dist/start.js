"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _browserSync = _interopRequireDefault(require("browser-sync"));
var _config = require("./config");
var _clean = _interopRequireDefault(require("./clean"));
var _dev = _interopRequireDefault(require("./lib/dev.server"));
var _dev2 = _interopRequireDefault(require("./lib/dev.client"));
var _dev3 = _interopRequireDefault(require("./lib/dev.dll"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { buildDir } = _config.config;
const app = (0, _express.default)();var _default =
async () => {
  app.use(_express.default.static(_path.default.join(buildDir, 'public')));
  await (0, _clean.default)();
  await (0, _dev3.default)();
  await (0, _dev2.default)(app);
  const host = await (0, _dev.default)(app);
  return new Promise((resolve, reject) => {
    _browserSync.default.create().init({
      ui: false,
      proxy: {
        target: host,
        middleware: app } },

    (error, bs) => error ? reject(error) : resolve(bs));
  });
};exports.default = _default;