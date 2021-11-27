"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseDir = exports.platformConfig = exports.babellrc = exports.existenceServerEntry = exports.existenceDll = exports.existenceServer = exports.existenceClient = exports.project = exports.platformDefaultEntry = exports.PlatformEnum = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const fs_2 = require("../core/fs");
const factoryConfig = (str) => (attr) => {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^ \]+\)\[\\s\\S\]*`, 'g'), '$1');
};
const getArvgConfig = factoryConfig(process.argv.join(` `));
const resolve = (base) => (..._path) => path_1.default.resolve(...[base, ..._path]);
const toArray = (obj) => Array.isArray(obj) ? obj : obj && [obj] || [];
const baseDir = process.cwd();
exports.baseDir = baseDir;
const baseResolve = resolve(baseDir);
const projectPath = baseResolve(getArvgConfig('--projectPath') || '.');
const projectConfigJs = baseResolve(projectPath, 'project.config.js');
const projectConfigPath = baseResolve(projectPath, 'project.config.json');
const babel = baseResolve(projectPath, '.babelrc');
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
    isDevelopment = false;
    environmental;
    getArvgConfig = getArvgConfig;
    ;
    analyzerStatus = false;
    baseResolve = resolve(process.cwd());
    rootResolve;
    outputRootResolve;
    sourceRootResolve;
    config;
    constructor(arvg = []) {
        const [command] = arvg.slice(2);
        this.environmental = command === 'start' ? 'development' : 'build';
        this.parseArvg();
    }
    parseArvg() {
        this.environmental = this.getArvgConfig('--environmental') || this.environmental;
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
            const { options: pOptions, configurations: pConfigurations, builder, outputPath, sourceClient, sourceServer } = current;
            const { main, styles, index, assets, tsConfig, themeVariable } = pOptions;
            const { watchFile, manifestDll, resolveAlias, hotContext } = current.configurations;
            !!builder && (current.builder = this.rootResolve(current.builder));
            !!index && (pOptions.index = this.sourceRootResolve(index));
            !!tsConfig && (pOptions.tsConfig = this.rootResolve(tsConfig));
            !!themeVariable && (pOptions.themeVariable = this.sourceRootResolve(themeVariable));
            !!outputPath && (current.outputPath = this.outputRootResolve(outputPath));
            !!sourceClient && (current.sourceClient = this.rootResolve(sourceRoot, sourceClient));
            !!sourceServer && (current.sourceServer = this.rootResolve(sourceRoot, sourceServer));
            !!resolveAlias && (pConfigurations.resolveAlias = this.parseAlias(resolveAlias));
            p === PlatformEnum.client && manifestDll && (pConfigurations.manifestDll = this.outputRootResolve(manifestDll));
            p !== PlatformEnum.dll && (pOptions.main = this.parseEntry(p, main));
            pOptions.assets = toArray(assets).map((f) => toArray(f).map((_f) => this.sourceRootResolve(_f)));
            pOptions.styles = toArray(styles).map((f) => this.sourceRootResolve(f));
            !!hotContext && (pConfigurations.hotContext = this.rootResolve(hotContext));
            pConfigurations.watchFile = toArray(watchFile).map((f) => this.sourceRootResolve(f));
            return { ...obj, [p]: current };
        }, {});
        return build;
    }
    loadProjectConfig() {
        let projectConfig;
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
    parseEntry(p, entry) {
        let entryMain = {};
        if (Object.prototype.toString.apply(entry).replace(/\[object ([\S]*)\]/, '$1') === 'Object') {
            entryMain = Object.keys(entry).reduce((main, key) => ({
                ...main,
                [key]: toArray(entry[key]).map((f) => this.sourceRootResolve(f))
            }), {});
        }
        else if (!!entry) {
            entryMain = { [exports.platformDefaultEntry[p]]: toArray(entry).map((f) => this.sourceRootResolve(f)) };
        }
        return entryMain;
    }
    static existencePlatform(platform) {
        const { architect: { build: { platform: platformMap } = {} } } = this.project;
        const platformConfig = platformMap[platform];
        if ((0, lodash_1.isEmpty)(platformConfig)) {
            return false;
        }
        const { notExistence, options: { main } } = platformConfig;
        if (notExistence) {
            return false;
        }
        return Array.isArray(main) ? main.length !== 0 : !!main;
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
    static get project() {
        if ((0, lodash_1.isEmpty)(this._project)) {
            this._project = new ProjectConfig(process.argv);
            this._project.loadProjectConfig();
        }
        return this._project && this._project.config || {};
    }
}
exports.project = ProjectConfig.project;
exports.existenceClient = ProjectConfig.existenceClient;
exports.existenceServer = ProjectConfig.existenceServer;
exports.existenceDll = ProjectConfig.existenceDll;
exports.existenceServerEntry = ProjectConfig.existenceServerEntry;
exports.babellrc = (0, fs_1.existsSync)(babel) && JSON.parse((0, fs_1.readFileSync)(babel).toString('utf-8')) || {};
const platformConfig = (key) => {
    const { root, isDevelopment, analyzerStatus, sourceRoot, outputRoot, nodeModules } = exports.project;
    const { architect: { build: { platform } } } = exports.project;
    const { options, configurations, builder, outputPath = '', sourceClient, sourceServer } = platform[key] || {};
    const { index, main, styles, assets, sourceMap, tsConfig, themeVariable } = options || {};
    const { nodeExternals, browserTarget, watchFile, hotContext, publicPath, externals, manifestDll, resolveAlias, styleLoaderOptions, sourceMap: hasSourceMap } = configurations || {};
    return {
        root,
        index,
        externals,
        entry: main,
        publicPath: publicPath ? `${publicPath}/`.replace(/[\/]+/, '/') : publicPath,
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
        manifestDll,
        resolveAlias,
        sourceMap,
        styleLoaderOptions,
        hasSourceMap,
        isDevelopment,
        analyzerStatus
    };
};
exports.platformConfig = platformConfig;
