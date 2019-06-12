"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _express = _interopRequireDefault(require("express"));
var _config = require("../config");
var _nodemon = _interopRequireDefault(require("./nodemon.server"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { buildDir } = _config.config;var _default =

async app => {
  app.use(_express.default.static(_path.default.resolve(buildDir, '/public')));
  return await (0, _nodemon.default)(app);
};exports.default = _default;