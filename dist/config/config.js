"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path2 = _interopRequireDefault(require("path"));
var _fs = require("../core/fs");
var _package = _interopRequireDefault(require("../../package.json"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const isDebug = !process.argv.includes('--release');
const baseDir = process.cwd();
const resolve = base => _path => _path2.default.resolve(base, _path);
const baseResolve = resolve(baseDir);
const processPkg = (0, _fs.requireSync)(`${baseDir}/package.json`);
const mergePackage = Object.assign({}, {
  babellrc: _package.default.babel,
  browserslist: _package.default.browserslist },
processPkg ? { ...processPkg } : {});var _default =

{
  baseDir,
  isDebug,
  srcDir: baseResolve('src'),
  buildDir: baseResolve('build'),
  distDir: baseResolve('dist'),
  babellrc: mergePackage.babellrc,
  browserslist: mergePackage.browserslist };exports.default = _default;