"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _bundle = require("../util/bundle");
var _config = require("../config");var _default =


async app => {
  const config = (0, _config.webpackDevServerEntry)();
  const isCanServerEntry = Array.isArray(config.entry) ? !!config.entry.length : !!Object.keys(config.entry).length;
  if (isCanServerEntry) {
    return (0, _bundle.webpackRun)(config, config.stats);
  }
  return Promise.resolve();
};exports.default = _default;