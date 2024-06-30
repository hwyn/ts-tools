var _a;
import { __assign, __spreadArray } from "tslib";
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { isEmpty, merge } from 'lodash';
import { requireSync } from '../core/fs';
import { getArgv } from './project-arvg';
var factoryConfig = function (str) { return function (attr) {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp("[\\s\\S]*".concat(attr, "=([^ ]+)[\\s\\S]*"), 'g'), '$1');
}; };
var resolve = function (base) { return function () {
    var _path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _path[_i] = arguments[_i];
    }
    return path.resolve.apply(path, __spreadArray([base], _path, true));
}; };
var toArray = function (obj) { return Array.isArray(obj) ? obj : obj && [obj] || []; };
var baseDir = process.cwd();
var baseResolve = resolve(baseDir);
export var PlatformEnum;
(function (PlatformEnum) {
    PlatformEnum["client"] = "client";
    PlatformEnum["server"] = "server";
    PlatformEnum["dll"] = "dll";
    PlatformEnum["serverEntry"] = "server-entry";
})(PlatformEnum || (PlatformEnum = {}));
export var platformDefaultEntry = (_a = {},
    _a[PlatformEnum.client] = 'main',
    _a[PlatformEnum.server] = 'server',
    _a[PlatformEnum.dll] = 'common',
    _a[PlatformEnum.serverEntry] = 'main',
    _a);
var defaultProject = {
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
var ProjectConfig = /** @class */ (function () {
    function ProjectConfig(command, argv) {
        if (argv === void 0) { argv = []; }
        this.isDevelopment = false;
        this.analyzerStatus = false;
        this.baseResolve = baseResolve;
        this.getArvgConfig = factoryConfig(getArgv()(argv).join(' '));
        this.projectPath = baseResolve(this.getArvgConfig('project') || '.');
        this.environmental = command === 'start' ? 'development' : 'build';
        this.babelFilePath = baseResolve(this.projectPath, '.babelrc');
        this.parseArvg();
    }
    ProjectConfig.prototype.parseArvg = function () {
        this.environmental = this.getArvgConfig('environmental') || this.environmental;
        this.isDevelopment = !this.getArvgConfig('--prod');
        this.analyzerStatus = !!this.getArvgConfig('--stats-json');
    };
    ProjectConfig.prototype.parseConfig = function (config) {
        this.config = merge({}, defaultProject, config);
        var _a = this.config, root = _a.root, sourceRoot = _a.sourceRoot, outputRoot = _a.outputRoot, architect = _a.architect;
        this.config.root = this.baseResolve(root);
        this.rootResolve = resolve(this.baseResolve(root));
        this.config.sourceRoot = this.rootResolve(sourceRoot);
        this.config.outputRoot = this.rootResolve(outputRoot);
        this.config.isDevelopment = this.isDevelopment;
        this.config.analyzerStatus = this.analyzerStatus;
        this.outputRootResolve = resolve(this.rootResolve(outputRoot));
        this.sourceRootResolve = resolve(this.rootResolve(sourceRoot));
        architect.build = this.parseBuild({ platform: architect.platform }, architect.additional);
    };
    ProjectConfig.prototype.getPlatformConfig = function (platformKey, platform, additional) {
        if (additional === void 0) { additional = {}; }
        var notDevelopmentCommand = this.isDevelopment && this.environmental !== 'development';
        var additionalConfig = merge({}, additional['build'], additional[this.environmental], notDevelopmentCommand ? additional['development'] : {});
        var developmentEnvironmental = notDevelopmentCommand ? platform[platformKey]['development'] : {};
        return merge(additionalConfig, platform[platformKey]['build'], developmentEnvironmental, platform[platformKey][this.environmental]);
    };
    ProjectConfig.prototype.parseBuild = function (build, additional) {
        var _this = this;
        if (additional === void 0) { additional = {}; }
        var platform = build.platform;
        build.platform = Object.keys(platform).reduce(function (obj, p) {
            var _a;
            var current = _this.getPlatformConfig(p, platform, additional);
            current.options = merge({}, current.options);
            current.configurations = merge({}, current.configurations);
            var pOptions = current.options, pConfigurations = current.configurations, builder = current.builder, outputPath = current.outputPath;
            var entry = pOptions.entry, styles = pOptions.styles, index = pOptions.index, assets = pOptions.assets, tsConfig = pOptions.tsConfig, themeVariable = pOptions.themeVariable;
            var watchFile = pConfigurations.watchFile, manifestDll = pConfigurations.manifestDll, resolveAlias = pConfigurations.resolveAlias, hotContext = pConfigurations.hotContext;
            !!builder && (current.builder = _this.rootResolve(current.builder));
            !!index && (pOptions.index = _this.sourceRootResolve(index));
            !!tsConfig && (pOptions.tsConfig = _this.rootResolve(tsConfig));
            !!themeVariable && (pOptions.themeVariable = _this.sourceRootResolve(themeVariable));
            !!outputPath && (current.outputPath = _this.outputRootResolve(outputPath));
            !!resolveAlias && (pConfigurations.resolveAlias = _this.parseAlias(resolveAlias));
            [PlatformEnum.client, PlatformEnum.dll].includes(p) && manifestDll && (pConfigurations.manifestDll = toArray(manifestDll).map(function (m) { return _this.outputRootResolve(m); }));
            pOptions.entry = _this.parseEntry(p, entry, p !== PlatformEnum.dll);
            pOptions.assets = toArray(assets).map(function (f) { return toArray(f).map(function (_f) { return _this.sourceRootResolve(_f); }); });
            pOptions.styles = toArray(styles).map(function (f) { return _this.sourceRootResolve(f); });
            !!hotContext && (pConfigurations.hotContext = _this.rootResolve(hotContext));
            !!watchFile && (pConfigurations.watchFile = toArray(watchFile).map(function (f) { return _this.sourceRootResolve(f); }));
            return __assign(__assign({}, obj), (_a = {}, _a[p] = current, _a));
        }, {});
        return build;
    };
    ProjectConfig.prototype.loadProjectConfig = function () {
        var projectConfig;
        var projectConfigJs = this.baseResolve(this.projectPath, 'project.config.js');
        var projectConfigPath = this.baseResolve(this.projectPath, 'project.config.json');
        var projectFunction = requireSync(projectConfigJs);
        if (projectFunction) {
            projectConfig = (typeof projectFunction === 'function' ? projectFunction : function () { return projectFunction || {}; })();
        }
        if (!projectConfig && existsSync(projectConfigPath)) {
            projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
        }
        this.parseConfig(projectConfig);
        return this.config;
    };
    ProjectConfig.prototype.parseAlias = function (alias) {
        var _this = this;
        return Object.keys(alias).reduce(function (obj, key) {
            var _a;
            return (__assign(__assign({}, obj), (_a = {}, _a[key] = _this.rootResolve(alias[key]), _a)));
        }, {});
    };
    ProjectConfig.prototype.parseEntry = function (p, entry, isResolve) {
        var _a;
        if (isResolve === void 0) { isResolve = true; }
        var entryMain = {};
        var sourceRootResolve = isResolve ? this.sourceRootResolve.bind(this) : function (f) { return f; };
        if (Object.prototype.toString.apply(entry).replace(/\[object ([\S]*)\]/, '$1') === 'Object') {
            entryMain = Object.keys(entry).reduce(function (main, key) {
                var _a;
                return (__assign(__assign({}, main), (_a = {}, _a[key] = toArray(entry[key]).map(function (f) { return sourceRootResolve(f); }), _a)));
            }, {});
        }
        else if (!!entry) {
            entryMain = (_a = {}, _a[platformDefaultEntry[p]] = toArray(entry).map(function (f) { return sourceRootResolve(f); }), _a);
        }
        return entryMain;
    };
    Object.defineProperty(ProjectConfig, "project", {
        get: function () {
            if (isEmpty(this._project)) {
                var argv = process.argv;
                this._project = new ProjectConfig(argv.slice(2)[0], argv);
                this._project.loadProjectConfig();
            }
            return this._project && this._project.config || {};
        },
        enumerable: false,
        configurable: true
    });
    ProjectConfig.existencePlatform = function (platform) {
        var _a = this.project.architect.build, _b = _a === void 0 ? {} : _a, _c = _b.platform, platformMap = _c === void 0 ? {} : _c;
        var platformConfig = platformMap[platform];
        if (isEmpty(platformConfig)) {
            return false;
        }
        var notExistence = platformConfig.notExistence, entry = platformConfig.options.entry;
        if (notExistence) {
            return false;
        }
        return Array.isArray(entry) ? entry.length !== 0 : !!entry;
    };
    Object.defineProperty(ProjectConfig, "existenceClient", {
        get: function () {
            return this.existencePlatform(PlatformEnum.client);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectConfig, "existenceServer", {
        get: function () {
            return this.existencePlatform(PlatformEnum.server);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectConfig, "existenceDll", {
        get: function () {
            return this.existencePlatform(PlatformEnum.dll);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectConfig, "existenceServerEntry", {
        get: function () {
            return this.existencePlatform(PlatformEnum.serverEntry);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectConfig, "babellrc", {
        get: function () {
            return existsSync(this._project.babelFilePath) && JSON.parse(readFileSync(this._project.babelFilePath).toString('utf-8')) || {};
        },
        enumerable: false,
        configurable: true
    });
    return ProjectConfig;
}());
export var project = ProjectConfig.project;
export var existenceClient = ProjectConfig.existenceClient;
export var existenceServer = ProjectConfig.existenceServer;
export var existenceDll = ProjectConfig.existenceDll;
export var existenceServerEntry = ProjectConfig.existenceServerEntry;
export var babellrc = ProjectConfig.babellrc;
export var platformConfig = function (key) {
    var root = project.root, isDevelopment = project.isDevelopment, analyzerStatus = project.analyzerStatus, sourceRoot = project.sourceRoot, outputRoot = project.outputRoot, nodeModules = project.nodeModules;
    var _a = project.architect.build, _b = _a === void 0 ? {} : _a, _c = _b.platform, platform = _c === void 0 ? {} : _c;
    var _d = key && platform[key] || {}, options = _d.options, configurations = _d.configurations, builder = _d.builder, _e = _d.outputPath, outputPath = _e === void 0 ? '' : _e;
    var _g = options || {}, index = _g.index, entry = _g.entry, styles = _g.styles, assets = _g.assets, sourceMap = _g.sourceMap, tsConfig = _g.tsConfig, themeVariable = _g.themeVariable;
    var _h = configurations || {}, nodeExternals = _h.nodeExternals, browserTarget = _h.browserTarget, watchFile = _h.watchFile, hotContext = _h.hotContext, _j = _h.publicPath, publicPath = _j === void 0 ? '/' : _j, externals = _h.externals, manifestDll = _h.manifestDll, resolveAlias = _h.resolveAlias, styleLoaderOptions = _h.styleLoaderOptions, hasSourceMap = _h.sourceMap;
    return {
        root: root,
        index: index,
        externals: externals,
        entry: entry,
        publicPath: "".concat(publicPath, "/").replace(/[\/]+/, '/'),
        themeVariable: themeVariable && existsSync(themeVariable) ? themeVariable : undefined,
        styles: styles,
        assets: assets,
        builder: builder,
        tsConfig: tsConfig,
        outputPath: outputPath,
        browserTarget: browserTarget,
        nodeExternals: nodeExternals,
        sourceRoot: sourceRoot,
        outputRoot: outputRoot,
        nodeModules: nodeModules,
        watchFile: watchFile,
        hotContext: hotContext,
        manifestDll: manifestDll || [],
        resolveAlias: resolveAlias,
        sourceMap: sourceMap,
        styleLoaderOptions: styleLoaderOptions,
        hasSourceMap: hasSourceMap,
        isDevelopment: isDevelopment,
        analyzerStatus: analyzerStatus
    };
};
export { baseDir };
