"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseDir = exports.platformConfig = exports.babellrc = exports.existenceClient = exports.project = exports.platformDefaultEntry = exports.PlatformEnum = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
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
const projectPath = baseResolve('project.config.json');
const babel = baseResolve('.babelrc');
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
        build: {
            platform: {},
            options: {
                assets: [],
                styles: []
            },
        }
    }
};
class ProjectConfig {
    constructor(arvg = []) {
        this.isDevelopment = false;
        this.arvg = ``;
        this.analyzerStatus = false;
        this.baseResolve = resolve(process.cwd());
        const [command] = arvg.slice(2);
        this.arvg = arvg.join(` `);
        this.getArvgConfig = factoryConfig(this.arvg);
        this.environmental = command === 'start' ? 'development' : 'build';
        this.parseArvg();
    }
    parseArvg() {
        this.environmental = this.getArvgConfig('--environmental') || this.environmental;
        this.isDevelopment = !this.getArvgConfig('--prod');
        this.analyzerStatus = !!this.getArvgConfig('--stats-json');
    }
    parseConfig(config) {
        this.config = lodash_1.merge({}, defaultProject, config);
        const { root, sourceRoot, outputRoot, architect } = this.config;
        const environmentalBuild = lodash_1.merge({}, architect.build, architect[this.environmental]);
        this.rootResolve = resolve(this.baseResolve(root));
        this.config.isDevelopment = this.isDevelopment;
        this.config.analyzerStatus = this.analyzerStatus;
        this.config.sourceRoot = this.rootResolve(sourceRoot);
        this.config.outputRoot = this.rootResolve(outputRoot),
            this.config.root = this.baseResolve(root);
        architect.build = this.parseBuild(sourceRoot, environmentalBuild);
    }
    parseBuild(sourceRoot, build) {
        const { platform, options, configurations } = build;
        build.platform = Object.keys(platform).reduce((obj, p) => {
            const current = platform[p];
            current.options = lodash_1.merge({}, options, current.options);
            current.configurations = lodash_1.merge({}, configurations, current.configurations);
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
            p !== PlatformEnum.dll && (pOptions.main = this.parseEntry(p, main));
            pOptions.assets = toArray(assets).map((f) => toArray(f).map((_f) => this.rootResolve(_f)));
            pOptions.styles = toArray(styles).map((f) => this.rootResolve(f));
            !!hotContext && (pConfigurations.hotContext = this.rootResolve(hotContext));
            pConfigurations.watchFile = toArray(watchFile).map((f) => this.rootResolve(f));
            return { ...obj, [p]: current };
        }, {});
        return build;
    }
    loadProjectConfig() {
        if (fs_1.existsSync(projectPath)) {
            this.parseConfig(JSON.parse(fs_1.readFileSync(projectPath, 'utf-8')));
        }
        return this.config;
    }
    parseEntry(p, entry) {
        let entryMain = {};
        if (Object.prototype.toString.apply(entry).replace(/\[object ([\S]*)\]/, '$1') === 'Object') {
            entryMain = Object.keys(entry).reduce((main, key) => ({
                ...main,
                [key]: toArray(entry[key]).map((f) => this.rootResolve(f))
            }), {});
        }
        else if (!!entry) {
            entryMain = { [exports.platformDefaultEntry[p]]: toArray(entry).map((f) => this.rootResolve(f)) };
        }
        return entryMain;
    }
    static get existenceClient() {
        const { architect: { build: { platform } } } = this.project;
        return !lodash_1.isEmpty(platform.client);
    }
    static get project() {
        if (lodash_1.isEmpty(this._project)) {
            this._project = new ProjectConfig(process.argv);
            this._project.loadProjectConfig();
        }
        return this._project && this._project.config || {};
    }
}
exports.project = ProjectConfig.project;
exports.existenceClient = ProjectConfig.existenceClient;
exports.babellrc = fs_1.existsSync(babel) && JSON.parse(fs_1.readFileSync(babel).toString('utf-8')) || {};
exports.platformConfig = (key) => {
    const { root, isDevelopment, analyzerStatus, sourceRoot, outputRoot, nodeModules } = exports.project;
    const { architect: { build: { platform } } } = exports.project;
    const { options, configurations, builder, outputPath = '', sourceClient, sourceServer } = platform[key] || {};
    const { index, main, styles, assets, sourceMap, tsConfig, themeVariable } = options || {};
    const { nodeExternals, browserTarget, watchFile, hotContext, sourceMap: hasSourceMap } = configurations || {};
    return {
        root,
        index,
        entry: main,
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
        isDevelopment,
        analyzerStatus
    };
};
