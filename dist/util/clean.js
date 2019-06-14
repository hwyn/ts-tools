"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _fs = require("../core/fs");
var _config = require("../config");

const { buildDir, distDir } = _config.config;var _default =

async () => {
  await (0, _fs.cleanDir)(buildDir);
  // await cleanDir(distDir);
};exports.default = _default;