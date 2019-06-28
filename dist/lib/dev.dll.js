"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _bundle = require("../util/bundle");
var _config = require("../config");var _default =

async () => {
  const dll = (0, _config.webpackDevDll)();
  return (0, _bundle.webpackRun)(dll, dll.stats);
};exports.default = _default;