import { existsSync, readFileSync } from 'fs';
import { isEmpty, merge } from 'lodash';
import { baseResolve, resolve, resolveProject } from './resolve.project';
const toArray = (obj) => Array.isArray(obj) ? obj : obj && [obj] || [];
export var PlatformEnum;
(function (PlatformEnum) {
    PlatformEnum["client"] = "client";
    PlatformEnum["server"] = "server";
    PlatformEnum["dll"] = "dll";
    PlatformEnum["serverEntry"] = "server-entry";
})(PlatformEnum || (PlatformEnum = {}));
export const platformDefaultEntry = {
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
    constructor(command) {
        this.isDevelopment = false;
        this.analyzerStatus = false;
        this.baseResolve = baseResolve;
        this.projectPath = baseResolve(resolveProject.getArgvConfig('project') || '.');
        this.babelFilePath = baseResolve(this.projectPath, '.babelrc');
        this.isDevelopment = command === 'start';
        this.analyzerStatus = !!resolveProject.getArgvConfig('--stats-json');
        this.environmental = resolveProject.getArgvConfig('environmental') || (command === 'start' ? 'development' : 'build');
    }
    parseConfig(config) {
        this.config = merge({}, defaultProject, config);
        const { root, sourceRoot, outputRoot, architect } = this.config;
        this.config.root = this.baseResolve(root);
        this.rootResolve = resolve(this.baseResolve(root));
        this.config.sourceRoot = this.rootResolve(sourceRoot);
        this.config.outputRoot = this.rootResolve(outputRoot);
        this.config.isDevelopment = this.isDevelopment;
        this.config.analyzerStatus = this.analyzerStatus;
        this.outputRootResolve = resolve(this.rootResolve(outputRoot));
        this.sourceRootResolve = resolve(this.rootResolve(sourceRoot));
        architect.build = this.parseBuild({ platform: architect.platform }, architect.additional);
    }
    getPlatformConfig(platformKey, platform, additional = {}) {
        const notDevelopmentCommand = this.isDevelopment && this.environmental !== 'development';
        const additionalConfig = merge({}, additional['build'], additional[this.environmental], notDevelopmentCommand ? additional['development'] : {});
        const developmentEnvironmental = notDevelopmentCommand ? platform[platformKey]['development'] : {};
        return merge(additionalConfig, platform[platformKey]['build'], developmentEnvironmental, platform[platformKey][this.environmental]);
    }
    parseBuild(build, additional = {}) {
        const { platform } = build;
        build.platform = Object.keys(platform).reduce((obj, p) => {
            const current = this.getPlatformConfig(p, platform, additional);
            current.options = merge({}, current.options);
            current.configurations = merge({}, current.configurations);
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
            return Object.assign(Object.assign({}, obj), { [p]: current });
        }, {});
        return build;
    }
    parseAlias(alias) {
        return Object.keys(alias).reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: this.rootResolve(alias[key]) })), {});
    }
    parseEntry(p, entry, isResolve = true) {
        let entryMain = {};
        const sourceRootResolve = isResolve ? this.sourceRootResolve.bind(this) : (f) => f;
        if (Object.prototype.toString.apply(entry).replace(/\[object ([\S]*)\]/, '$1') === 'Object') {
            entryMain = Object.keys(entry).reduce((main, key) => (Object.assign(Object.assign({}, main), { [key]: toArray(entry[key]).map((f) => sourceRootResolve(f)) })), {});
        }
        else if (!!entry) {
            entryMain = { [platformDefaultEntry[p]]: toArray(entry).map((f) => sourceRootResolve(f)) };
        }
        return entryMain;
    }
    static get project() {
        if (isEmpty(this._project)) {
            const argv = process.argv;
            this._project = new ProjectConfig(argv.slice(2)[0]);
            this._project.parseConfig(resolveProject.projectConfig);
        }
        return this._project && this._project.config || {};
    }
    static existencePlatform(platform) {
        const { architect: { build: { platform: platformMap = {} } = {} } } = this.project;
        const platformConfig = platformMap[platform];
        if (isEmpty(platformConfig)) {
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
        return existsSync(this._project.babelFilePath) && JSON.parse(readFileSync(this._project.babelFilePath).toString('utf-8')) || {};
    }
}
export const project = ProjectConfig.project;
export const existenceClient = ProjectConfig.existenceClient;
export const existenceServer = ProjectConfig.existenceServer;
export const existenceDll = ProjectConfig.existenceDll;
export const existenceServerEntry = ProjectConfig.existenceServerEntry;
export const babellrc = ProjectConfig.babellrc;
export { baseDir } from './resolve.project';
export const platformConfig = (key) => {
    const { root, isDevelopment, analyzerStatus, sourceRoot, outputRoot, nodeModules } = project;
    const { architect: { build: { platform = {} } = {} } } = project;
    const { options, configurations, builder, outputPath = '' } = key && platform[key] || {};
    const { index, entry, styles, assets, sourceMap, tsConfig, themeVariable } = options || {};
    const { nodeExternals, browserTarget, watchFile, hotContext, publicPath = '/', externals, manifestDll, resolveAlias, styleLoaderOptions, sourceMap: hasSourceMap } = configurations || {};
    return {
        root,
        index,
        externals,
        entry,
        publicPath: `${publicPath}/`.replace(/[\/]+/, '/'),
        themeVariable: themeVariable && existsSync(themeVariable) ? themeVariable : undefined,
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
