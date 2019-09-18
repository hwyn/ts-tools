"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.filterAttr = exports.getMergeConfig = void 0;

var _config = _interopRequireDefault(require("../config"));
var _fs = require("../../core/fs");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { baseDir, isDebug, webpackDir } = _config.default;
const webpackDirConfig = webpackDir || 'webpack';

const getMergeConfig = (fileName, jsRules, cssRules) => {
  const mergeClientConfig = (0, _fs.requireSync)(`${baseDir}/${webpackDirConfig}/${fileName}`);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, isDebug);
};exports.getMergeConfig = getMergeConfig;

const filterAttr = (mergeConfig, filter) => {
  const config = {};
  Object.keys(mergeConfig || {}).filter(key => !filter.includes(key)).forEach(key => config[key] = mergeConfig[key]);
  return config;
};exports.filterAttr = filterAttr;var _default =

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