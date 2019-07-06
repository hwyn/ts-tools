"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.getMergeConfig = void 0;

var _config = _interopRequireDefault(require("../config"));
var _fs = require("../../core/fs");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { baseDir, isDebug } = _config.default;
const webpackDir = 'webpack';

const getMergeConfig = (fileName, jsRules, cssRules) => {
  const mergeClientConfig = (0, _fs.requireSync)(`${baseDir}/${webpackDir}/${fileName}`);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, isDebug);
};exports.getMergeConfig = getMergeConfig;var _default =

{
  context: baseDir,
  stats: {
    colors: true,
    hash: true, // required by custom stat output
    timings: true, // required by custom stat output
    chunks: true, // required by custom stat output
    chunkModules: false,
    modules: false,
    reasons: false,
    warnings: true,
    errors: true,
    assets: true, // required by custom stat output
    version: false,
    errorDetails: false,
    moduleTrace: false } };exports.default = _default;