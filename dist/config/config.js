"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.baseDir = exports.platformConfig = exports.babellrc = exports.existenceClient = exports.project = exports.PlatformEnum = void 0;var _path2 = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _lodash = require("lodash");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

const factoryConfig = (str) => (attr) => {
  if (str.indexOf(attr) === -1) return null;
  return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^ \]+\)\[\\s\\S\]*`, 'g'), '$1');
};

const resolve = (base) => (..._path) => _path2.default.resolve(...[base, ..._path]);
const toArray = (obj) => Array.isArray(obj) ? obj : obj && [obj] || [];

const baseDir = process.cwd();exports.baseDir = baseDir;
const baseResolve = resolve(baseDir);
const projectPath = baseResolve('project.config.json');
const babel = baseResolve('.babelrc');let

PlatformEnum;exports.PlatformEnum = PlatformEnum;(function (PlatformEnum) {PlatformEnum["client"] = "client";PlatformEnum["server"] = "server";PlatformEnum["dll"] = "dll";PlatformEnum["serverEntry"] = "server-entry";})(PlatformEnum || (exports.PlatformEnum = PlatformEnum = {}));





















































const defaultProject = {
  root: '.',
  sourceRoot: 'src',
  outputRoot: 'dist',
  nodeModules: baseResolve('node_modules'),
  isDevelopment: false,
  architect: {
    build: {
      platform: {},
      options: {
        assets: [],
        styles: [] } } } };





class ProjectConfig {









  constructor(arvg = []) {_defineProperty(this, "isDevelopment", false);_defineProperty(this, "environmental", void 0);_defineProperty(this, "getArvgConfig", void 0);_defineProperty(this, "arvg", ``);_defineProperty(this, "baseResolve", resolve(process.cwd()));_defineProperty(this, "rootResolve", void 0);_defineProperty(this, "config", void 0);
    const [command] = arvg.slice(2);
    this.arvg = arvg.join(` `);
    this.getArvgConfig = factoryConfig(this.arvg);
    this.environmental = command === 'start' ? 'development' : 'build';
    this.parseArvg();
  }

  parseArvg() {
    this.environmental = this.getArvgConfig('--environmental') || this.environmental;
    this.isDevelopment = !this.getArvgConfig('--prod');
  }

  parseConfig(config) {
    this.config = (0, _lodash.merge)({}, defaultProject, config);
    const {
      root,
      sourceRoot,
      outputRoot,
      architect } =
    this.config;

    const environmentalBuild = (0, _lodash.merge)({}, architect.build, architect[this.environmental]);

    this.rootResolve = resolve(this.baseResolve(root));
    this.config.isDevelopment = this.isDevelopment;
    this.config.sourceRoot = this.rootResolve(sourceRoot);
    this.config.outputRoot = this.rootResolve(outputRoot),
    this.config.root = this.baseResolve(root);
    architect.build = this.parseBuild(sourceRoot, environmentalBuild);
  }

  parseBuild(sourceRoot, build) {
    const { platform, options, configurations } = build;
    build.platform = Object.keys(platform).reduce((obj, p) => {
      const current = platform[p];
      current.options = (0, _lodash.merge)({}, options, current.options);
      current.configurations = (0, _lodash.merge)({}, configurations, current.configurations);

      const { options: pOptions, configurations: pConfigurations, builder, outputPath, sourceClient, sourceServer } = current;
      const { main, styles, index, assets, tsConfig, themeVariable } = pOptions;
      const { watchFile, hotContext } = current.configurations;

      !!builder && (current.builder = this.rootResolve(current.builder));
      !!index && (pOptions.index = this.rootResolve(index));
      !!tsConfig && (pOptions.tsConfig = this.rootResolve(tsConfig));
      !!themeVariable && (pOptions.themeVariable = this.rootResolve(themeVariable));
      !!outputPath && (current.outputPath = this.rootResolve(outputPath));
      !!sourceClient && (current.sourceClient = this.rootResolve(sourceRoot, sourceClient));
      !!sourceServer && (current.sourceServer = this.rootResolve(sourceRoot, sourceServer));
      if (p !== PlatformEnum.dll) {
        pOptions.main = toArray(main).map((f) => this.rootResolve(f));
      }
      pOptions.assets = toArray(assets).map((f) => toArray(f).map((_f) => this.rootResolve(_f)));
      pOptions.styles = toArray(styles).map((f) => this.rootResolve(f));
      !!hotContext && (pConfigurations.hotContext = this.rootResolve(hotContext));
      pConfigurations.watchFile = toArray(watchFile).map((f) => this.rootResolve(f));

      return { ...obj, [p]: current };
    }, {});
    return build;
  }

  loadProjectConfig() {
    if ((0, _fs.existsSync)(projectPath)) {
      this.parseConfig(JSON.parse((0, _fs.readFileSync)(projectPath, 'utf-8')));
    }
    return this.config;
  }

  static get existenceClient() {
    const { architect: { build: { platform } } } = this.project;
    return !(0, _lodash.isEmpty)(platform.client);
  }

  static get project() {
    if ((0, _lodash.isEmpty)(this._project)) {
      this._project = new ProjectConfig(process.argv);
      this._project.loadProjectConfig();
    }
    return this._project && this._project.config || {};
  }}_defineProperty(ProjectConfig, "_project", void 0);


const project = ProjectConfig.project;exports.project = project;

const existenceClient = ProjectConfig.existenceClient;exports.existenceClient = existenceClient;

const babellrc = (0, _fs.existsSync)(babel) && JSON.parse((0, _fs.readFileSync)(babel).toString('utf-8')) || {};exports.babellrc = babellrc;

const platformConfig = (key) => {
  const { root, isDevelopment, sourceRoot, outputRoot, nodeModules } = project;
  const { architect: { build: { platform } } } = project;
  const { options, configurations, builder, outputPath = '', sourceClient, sourceServer } = platform[key] || {};
  const { index, main, styles, assets, sourceMap, tsConfig, themeVariable } = options || {};
  const { nodeExternals, browserTarget, watchFile, hotContext, sourceMap: hasSourceMap } = configurations || {};

  return {
    root,
    index,
    main,
    themeVariable,
    styles,
    assets,
    builder,
    tsConfig,
    outputPath,
    browserTarget,
    nodeExternals,
    sourceRoot,
    outputRoot,
    sourceClient,
    sourceServer,
    nodeModules,
    watchFile,
    hotContext,
    sourceMap,
    hasSourceMap,
    isDevelopment };

};exports.platformConfig = platformConfig;