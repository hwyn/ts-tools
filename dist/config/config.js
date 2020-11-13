"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.project = exports.ProjectConfig = exports.baseDir = exports.browserslist = exports.babellrc = exports.isDebug = exports.runClient = exports.webpackDir = exports.distDir = exports.srcDir = exports.buildDir = void 0;var _path2 = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _fs2 = require("../core/fs");
var _package = _interopRequireDefault(require("../../package.json"));
var _lodash = require("lodash");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const factoryConfig = str => attr => {
  if (str.indexOf(attr) === -1) return null;
  return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^,\]+\)\[\\s\\S\]*`, 'g'), '$1');
};

const resolve = base => _path => _path2.default.resolve(base, _path);

const argv = process.argv;
const argvStr = argv.join(',');

const getArvgConfig = factoryConfig(argvStr);

const baseDir = process.cwd();exports.baseDir = baseDir;
const baseResolve = resolve(baseDir);
const processPkg = (0, _fs2.requireSync)(`${baseDir}/package.json`);
const babel = `${baseDir}/.babelrc`;
const mergePackage = Object.assign({}, {
  babellrc: _package.default.babel,
  browserslist: _package.default.browserslist },
!processPkg ? {} : {
  ...processPkg },
!(0, _fs.existsSync)(babel) ? {} : {
  babellrc: JSON.parse((0, _fs.readFileSync)(babel).toString('utf-8')) });


const buildDir = baseResolve('build');exports.buildDir = buildDir;

const srcDir = baseResolve('src');exports.srcDir = srcDir;

const distDir = baseResolve('dist');exports.distDir = distDir;

const webpackDir = getArvgConfig('webpackDir');exports.webpackDir = webpackDir;

const runClient = getArvgConfig('runClient') === 'false' ? false : true;exports.runClient = runClient;

const isDebug = !argv.includes('--release');exports.isDebug = isDebug;

const babellrc = mergePackage.babellrc;exports.babellrc = babellrc;

const browserslist = mergePackage.browserslist;exports.browserslist = browserslist;





const projectName = _path2.default.join(baseDir, 'project.config.json');







class ProjectConfig {



  constructor(arvg) {this.arvg = arvg;}

  parseConfig() {
    const { output = 'build', development, production } = this.config;
    this.config.output = baseResolve(output);
  }

  loadProjectConfig() {
    if ((0, _fs.existsSync)(projectName)) {
      this.config = JSON.parse((0, _fs.readFileSync)(projectName, 'utf-8'));
      this.parseConfig();
    }
    return this.config;
  }

  static get project() {
    if ((0, _lodash.isEmpty)(this._project)) {
      this._project = new ProjectConfig(process.argv);
      this._project.loadProjectConfig();
    }
    return this._project && this._project.config || {};
  }}exports.ProjectConfig = ProjectConfig;


const project = ProjectConfig.project;exports.project = project;