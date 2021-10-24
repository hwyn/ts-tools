"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getMergeConfig = exports.filterAttr = exports.default = exports.copyPlugin = void 0;var _fs = require("fs");

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _config = require("../config");
var _fs2 = require("../../core/fs");
var _lodash = require("lodash");
var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { isDevelopment, sourceRoot } = (0, _config.platformConfig)();

const getMergeConfig = (filePath, jsRules, cssRules) => {
  const mergeClientConfig = (0, _fs2.requireSync)(filePath);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(jsRules, cssRules, isDevelopment);
};exports.getMergeConfig = getMergeConfig;

const filterAttr = (mergeConfig, filter) => {
  const config = {};
  Object.keys(mergeConfig || {}).filter((key) => !filter.includes(key)).forEach((key) => config[key] = mergeConfig[key]);
  return config;
};exports.filterAttr = filterAttr;

const copyPlugin = (formFile, toFile, sourcePath = sourceRoot) => {
  const files = formFile.reduce((copyArr, filePaths) => {
    const [filePath, _filePath] = filePaths;
    if ((0, _fs.existsSync)(filePath)) {
      const toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
      const toFileInfo = _path.default.parse(toFilePath);
      copyArr.push({
        from: filePath,
        to: toFileInfo.ext === '' && toFileInfo.name === '.env' ? toFileInfo.dir : toFilePath,
        noErrorOnMissing: false,
        globOptions: { ignore: ['.*'] } });

    }
    return copyArr;
  }, []);
  return !(0, _lodash.isEmpty)(files) && [new _copyWebpackPlugin.default({ patterns: files })] || [];
};exports.copyPlugin = copyPlugin;var _default =

{
  mode: 'production',
  context: _config.baseDir,
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
    assets: false, // required by custom stat output
    version: false,
    errorDetails: false,
    moduleTrace: false } };exports.default = _default;