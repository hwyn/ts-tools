"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _bundle = require("../util/bundle");
var _config = require("../config");var _default =

async () => {
  const dll = (0, _config.webpackDevDll)();
  const isCanDll = Array.isArray(dll.entry) ? !!dll.entry.length : !!Object.keys(dll.entry).length;
  return isCanDll ? (0, _bundle.webpackRun)(dll, dll.stats) : Promise.resolve();
};exports.default = _default;