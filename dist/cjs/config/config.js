"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseDir = exports.platformConfig = exports.babellrc = exports.existenceServerEntry = exports.existenceDll = exports.existenceServer = exports.existenceClient = exports.project = exports.platformDefaultEntry = exports.PlatformEnum = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const fs_2 = require("../core/fs");
const project_arvg_1 = require("./project-arvg");
const factoryConfig = (str) => (attr) => {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^ \]+\)\[\\s\\S\]*`, 'g'), '$1');
};
const resolve = (base) => (..._path) => path_1.default.resolve(...[base, ..._path]);
const toArray = (obj) => Array.isArray(obj) ? obj : obj && [obj] || [];
const baseDir = process.cwd();
exports.baseDir = baseDir;
const baseResolve = resolve(baseDir);
var PlatformEnum;
(function (PlatformEnum) {
    PlatformEnum["client"] = "client";
    PlatformEnum["server"] = "server";
    PlatformEnum["dll"] = "dll";
    PlatformEnum["serverEntry"] = "server-entry";
})(PlatformEnum = exports.PlatformEnum || (exports.PlatformEnum = {}));
exports.platformDefaultEntry = {
    [PlatformEnum.client]: 'main',
    [PlatformEnum.server]: 'server',
    [PlatformEnum.dll]: 'common',
    [PlatformEnum.serverEntry]: 'main'
};
const defaultProject = {
    root: '.',
    sourceRoot: 'src',
    outputRoot: 'dist',
    packagePath: baseResolve('package.json'),
    nodeModules: baseResolve('node_modules'),
    isDevelopment: false,
    analyzerStatus: false,
    architect: {
        additional: {},
        platform: {}
    }
};
class ProjectConfig {
    static _project;
    babelFilePath;
    projectPath;
    environmental;
    isDevelopment = false;
    analyzerStatus = false;
    baseResolve = baseResolve;
    rootResolve;
    outputRootResolve;
    sourceRootResolve;
    getArvgConfig;
    config;
    constructor(command, argv = []) {
        this.getArvgConfig = factoryConfig((0, project_arvg_1.getArgv)()(argv).join(' '));
        this.projectPath = baseResolve(this.getArvgConfig('project') || '.');
        this.environmental = command === 'start' ? 'development' : 'build';
        this.babelFilePath = baseResolve(this.projectPath, '.babelrc');
        this.parseArvg();
    }
    parseArvg() {
        this.environmental = this.getArvgConfig('environmental') || this.environmental;
        this.isDevelopment = !this.getArvgConfig('--prod');
        this.analyzerStatus = !!this.getArvgConfig('--stats-json');
    }
    parseConfig(config) {
        this.config = (0, lodash_1.merge)({}, defaultProject, config);
        const { root, sourceRoot, outputRoot, architect } = this.config;
        this.config.root = this.baseResolve(root);
        this.rootResolve = resolve(this.baseResolve(root));
        this.config.sourceRoot = this.rootResolve(sourceRoot);
        this.config.outputRoot = this.rootResolve(outputRoot);
        this.config.isDevelopment = this.isDevelopment;
        this.config.analyzerStatus = this.analyzerStatus;
        this.outputRootResolve = resolve(this.rootResolve(outputRoot));
        this.sourceRootResolve = resolve(this.rootResolve(sourceRoot));
        architect.build = this.parseBuild(sourceRoot, { platform: architect.platform }, architect.additional);
    }
    getPlatformConfig(platformKey, platform, additional = {}) {
        const notDevelopmentCommand = this.isDevelopment && this.environmental !== 'development';
        const additionalConfig = (0, lodash_1.merge)({}, additional['build'], additional[this.environmental], notDevelopmentCommand ? additional['development'] : {});
        const developmentEnvironmental = notDevelopmentCommand ? platform[platformKey]['development'] : {};
        return (0, lodash_1.merge)(additionalConfig, platform[platformKey]['build'], developmentEnvironmental, platform[platformKey][this.environmental]);
    }
    parseBuild(sourceRoot, build, additional = {}) {
        const { platform } = build;
        build.platform = Object.keys(platform).reduce((obj, p) => {
            const current = this.getPlatformConfig(p, platform, additional);
            current.options = (0, lodash_1.merge)({}, current.options);
            current.configurations = (0, lodash_1.merge)({}, current.configurations);
            const { options: pOptions, configurations: pConfigurations, builder, outputPath } = current;
            const { entry, styles, index, assets, tsConfig, themeVariable } = pOptions;
            const { watchFile, manifestDll, resolveAlias, hotContext } = pConfigurations;
            !!builder && (current.builder = this.rootResolve(current.builder));
            !!index && (pOptions.index = this.sourceRootResolve(index));
            !!tsConfig && (pOptions.tsConfig = this.rootResolve(tsConfig));
            !!themeVariable && (pOptions.themeVariable = this.sourceRootResolve(themeVariable));
            !!outputPath && (current.outputPath = this.outputRootResolve(outputPath));
            !!resolveAlias && (pConfigurations.resolveAlias = this.parseAlias(resolveAlias));
            [PlatformEnum.client, PlatformEnum.dll].includes(p) && manifestDll && (pConfigurations.manifestDll = toArray(manifestDll).map((m) => this.outputRootResolve(m)));
            pOptions.entry = this.parseEntry(p, entry, p !== PlatformEnum.dll);
            pOptions.assets = toArray(assets).map((f) => toArray(f).map((_f) => this.sourceRootResolve(_f)));
            pOptions.styles = toArray(styles).map((f) => this.sourceRootResolve(f));
            !!hotContext && (pConfigurations.hotContext = this.rootResolve(hotContext));
            !!watchFile && (pConfigurations.watchFile = toArray(watchFile).map((f) => this.sourceRootResolve(f)));
            return { ...obj, [p]: current };
        }, {});
        return build;
    }
    loadProjectConfig() {
        let projectConfig;
        const projectConfigJs = this.baseResolve(this.projectPath, 'project.config.js');
        const projectConfigPath = this.baseResolve(this.projectPath, 'project.config.json');
        const projectFunction = (0, fs_2.requireSync)(projectConfigJs);
        if (projectFunction) {
            projectConfig = (typeof projectFunction === 'function' ? projectFunction : () => projectFunction || {})();
        }
        if (!projectConfig && (0, fs_1.existsSync)(projectConfigPath)) {
            projectConfig = JSON.parse((0, fs_1.readFileSync)(projectConfigPath, 'utf-8'));
        }
        this.parseConfig(projectConfig);
        return this.config;
    }
    parseAlias(alias) {
        return Object.keys(alias).reduce((obj, key) => ({
            ...obj,
            [key]: this.rootResolve(alias[key])
        }), {});
    }
    parseEntry(p, entry, isResolve = true) {
        let entryMain = {};
        const sourceRootResolve = isResolve ? this.sourceRootResolve.bind(this) : (f) => f;
        if (Object.prototype.toString.apply(entry).replace(/\[object ([\S]*)\]/, '$1') === 'Object') {
            entryMain = Object.keys(entry).reduce((main, key) => ({
                ...main,
                [key]: toArray(entry[key]).map((f) => sourceRootResolve(f))
            }), {});
        }
        else if (!!entry) {
            entryMain = { [exports.platformDefaultEntry[p]]: toArray(entry).map((f) => sourceRootResolve(f)) };
        }
        return entryMain;
    }
    static get project() {
        if ((0, lodash_1.isEmpty)(this._project)) {
            const argv = process.argv;
            this._project = new ProjectConfig(argv.slice(2)[0], argv);
            this._project.loadProjectConfig();
        }
        return this._project && this._project.config || {};
    }
    static existencePlatform(platform) {
        const { architect: { build: { platform: platformMap = {} } = {} } } = this.project;
        const platformConfig = platformMap[platform];
        if ((0, lodash_1.isEmpty)(platformConfig)) {
            return false;
        }
        const { notExistence, options: { entry } } = platformConfig;
        if (notExistence) {
            return false;
        }
        return Array.isArray(entry) ? entry.length !== 0 : !!entry;
    }
    static get existenceClient() {
        return this.existencePlatform(PlatformEnum.client);
    }
    static get existenceServer() {
        return this.existencePlatform(PlatformEnum.server);
    }
    static get existenceDll() {
        return this.existencePlatform(PlatformEnum.dll);
    }
    static get existenceServerEntry() {
        return this.existencePlatform(PlatformEnum.serverEntry);
    }
    static get babellrc() {
        return (0, fs_1.existsSync)(this._project.babelFilePath) && JSON.parse((0, fs_1.readFileSync)(this._project.babelFilePath).toString('utf-8')) || {};
    }
}
exports.project = ProjectConfig.project;
exports.existenceClient = ProjectConfig.existenceClient;
exports.existenceServer = ProjectConfig.existenceServer;
exports.existenceDll = ProjectConfig.existenceDll;
exports.existenceServerEntry = ProjectConfig.existenceServerEntry;
exports.babellrc = ProjectConfig.babellrc;
const platformConfig = (key) => {
    const { root, isDevelopment, analyzerStatus, sourceRoot, outputRoot, nodeModules } = exports.project;
    const { architect: { build: { platform = {} } = {} } } = exports.project;
    const { options, configurations, builder, outputPath = '' } = key && platform[key] || {};
    const { index, entry, styles, assets, sourceMap, tsConfig, themeVariable } = options || {};
    const { nodeExternals, browserTarget, watchFile, hotContext, publicPath = '/', externals, manifestDll, resolveAlias, styleLoaderOptions, sourceMap: hasSourceMap } = configurations || {};
    return {
        root,
        index,
        externals,
        entry,
        publicPath: `${publicPath}/`.replace(/[\/]+/, '/'),
        themeVariable: themeVariable && (0, fs_1.existsSync)(themeVariable) ? themeVariable : undefined,
        styles,
        assets,
        builder,
        tsConfig,
        outputPath,
        browserTarget,
        nodeExternals,
        sourceRoot,
        outputRoot,
        nodeModules,
        watchFile,
        hotContext,
        manifestDll: manifestDll || [],
        resolveAlias,
        sourceMap,
        styleLoaderOptions,
        hasSourceMap,
        isDevelopment,
        analyzerStatus
    };
};
exports.platformConfig = platformConfig;
