"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path2 = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _fs2 = require("../core/fs");
var _package = _interopRequireDefault(require("../../package.json"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const factoryConfig = str => attr => str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^,\]+\)`, 'g'), '$1');

const resolve = base => _path => _path2.default.resolve(base, _path);

const argv = process.argv;
const argvStr = argv.join(',');

const getArvgConfig = factoryConfig(argvStr);

const webpackDir = getArvgConfig('webpackDir');
const runClient = getArvgConfig('runClient') === 'false' ? false : true;
console.log(runClient);
const isDebug = !argv.includes('--release');


const baseDir = process.cwd();
const baseResolve = resolve(baseDir);
const processPkg = (0, _fs2.requireSync)(`${baseDir}/package.json`);
const babel = `${baseDir}/.babelrc`;
const mergePackage = Object.assign({}, {
  babellrc: _package.default.babel,
  browserslist: _package.default.browserslist },
!processPkg ? {} : {
  ...processPkg },
!(0, _fs.existsSync)(babel) ? {} : {
  babellrc: JSON.parse((0, _fs.readFileSync)(babel).toString('utf-8')) });var _default =


{
  runClient,
  webpackDir,
  baseDir,
  isDebug,
  srcDir: baseResolve('src'),
  buildDir: baseResolve('build'),
  distDir: baseResolve('dist'),
  babellrc: mergePackage.babellrc,
  browserslist: mergePackage.browserslist };exports.default = _default;