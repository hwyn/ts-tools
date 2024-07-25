"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformConfig = exports.baseDir = exports.babellrc = exports.existenceServerEntry = exports.existenceDll = exports.existenceServer = exports.existenceClient = exports.project = exports.platformDefaultEntry = exports.PlatformEnum = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var resolve_project_1 = require("./resolve.project");
var toArray = function (obj) { return Array.isArray(obj) ? obj : obj && [obj] || []; };
var PlatformEnum;
(function (PlatformEnum) {
    PlatformEnum["client"] = "client";
    PlatformEnum["server"] = "server";
    PlatformEnum["dll"] = "dll";
    PlatformEnum["serverEntry"] = "server-entry";
})(PlatformEnum || (exports.PlatformEnum = PlatformEnum = {}));
exports.platformDefaultEntry = (_a = {},
    _a[PlatformEnum.client] = 'main',
    _a[PlatformEnum.server] = 'server',
    _a[PlatformEnum.dll] = 'common',
    _a[PlatformEnum.serverEntry] = 'main',
    _a);
var defaultProject = {
    root: '.',
    sourceRoot: 'src',
    outputRoot: 'dist',
    packagePath: (0, resolve_project_1.baseResolve)('package.json'),
    nodeModules: (0, resolve_project_1.baseResolve)('node_modules'),
    isDevelopment: false,
    analyzerStatus: false,
    architect: {
        additional: {},
        platform: {}
    }
};
var ProjectConfig = /** @class */ (function () {
    function ProjectConfig(command) {
        this.isDevelopment = false;
        this.analyzerStatus = false;
        this.baseResolve = resolve_project_1.baseResolve;
        this.projectPath = (0, resolve_project_1.baseResolve)(resolve_project_1.resolveProject.getArgvConfig('project') || '.');
        this.babelFilePath = (0, resolve_project_1.baseResolve)(this.projectPath, '.babelrc');
        this.environmental = command === 'start' ? 'development' : 'build';
        this.parseArgv();
    }
    ProjectConfig.prototype.parseArgv = function () {
        this.environmental = resolve_project_1.resolveProject.getArgvConfig('environmental') || this.environmental;
        this.isDevelopment = !resolve_project_1.resolveProject.getArgvConfig('--prod');
        this.analyzerStatus = !!resolve_project_1.resolveProject.getArgvConfig('--stats-json');
    };
    ProjectConfig.prototype.parseConfig = function (config) {
        this.config = (0, lodash_1.merge)({}, defaultProject, config);
        var _a = this.config, root = _a.root, sourceRoot = _a.sourceRoot, outputRoot = _a.outputRoot, architect = _a.architect;
        this.config.root = this.baseResolve(root);
        this.rootResolve = (0, resolve_project_1.resolve)(this.baseResolve(root));
        this.config.sourceRoot = this.rootResolve(sourceRoot);
        this.config.outputRoot = this.rootResolve(outputRoot);
        this.config.isDevelopment = this.isDevelopment;
        this.config.analyzerStatus = this.analyzerStatus;
        this.outputRootResolve = (0, resolve_project_1.resolve)(this.rootResolve(outputRoot));
        this.sourceRootResolve = (0, resolve_project_1.resolve)(this.rootResolve(sourceRoot));
        architect.build = this.parseBuild({ platform: architect.platform }, architect.additional);
    };
    ProjectConfig.prototype.getPlatformConfig = function (platformKey, platform, additional) {
        if (additional === void 0) { additional = {}; }
        var notDevelopmentCommand = this.isDevelopment && this.environmental !== 'development';
        var additionalConfig = (0, lodash_1.merge)({}, additional['build'], additional[this.environmental], notDevelopmentCommand ? additional['development'] : {});
        var developmentEnvironmental = notDevelopmentCommand ? platform[platformKey]['development'] : {};
        return (0, lodash_1.merge)(additionalConfig, platform[platformKey]['build'], developmentEnvironmental, platform[platformKey][this.environmental]);
    };
    ProjectConfig.prototype.parseBuild = function (build, additional) {
        var _this = this;
        if (additional === void 0) { additional = {}; }
        var platform = build.platform;
        build.platform = Object.keys(platform).reduce(function (obj, p) {
            var _a;
            var current = _this.getPlatformConfig(p, platform, additional);
            current.options = (0, lodash_1.merge)({}, current.options);
            current.configurations = (0, lodash_1.merge)({}, current.configurations);
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
            return tslib_1.__assign(tslib_1.__assign({}, obj), (_a = {}, _a[p] = current, _a));
        }, {});
        return build;
    };
    ProjectConfig.prototype.parseAlias = function (alias) {
        var _this = this;
        return Object.keys(alias).reduce(function (obj, key) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, obj), (_a = {}, _a[key] = _this.rootResolve(alias[key]), _a)));
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
                return (tslib_1.__assign(tslib_1.__assign({}, main), (_a = {}, _a[key] = toArray(entry[key]).map(function (f) { return sourceRootResolve(f); }), _a)));
            }, {});
        }
        else if (!!entry) {
            entryMain = (_a = {}, _a[exports.platformDefaultEntry[p]] = toArray(entry).map(function (f) { return sourceRootResolve(f); }), _a);
        }
        return entryMain;
    };
    Object.defineProperty(ProjectConfig, "project", {
        get: function () {
            if ((0, lodash_1.isEmpty)(this._project)) {
                var argv = process.argv;
                this._project = new ProjectConfig(argv.slice(2)[0]);
                this._project.parseConfig(resolve_project_1.resolveProject.projectConfig);
            }
            return this._project && this._project.config || {};
        },
        enumerable: false,
        configurable: true
    });
    ProjectConfig.existencePlatform = function (platform) {
        var _a = this.project.architect.build, _b = _a === void 0 ? {} : _a, _c = _b.platform, platformMap = _c === void 0 ? {} : _c;
        var platformConfig = platformMap[platform];
        if ((0, lodash_1.isEmpty)(platformConfig)) {
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
            return (0, fs_1.existsSync)(this._project.babelFilePath) && JSON.parse((0, fs_1.readFileSync)(this._project.babelFilePath).toString('utf-8')) || {};
        },
        enumerable: false,
        configurable: true
    });
    return ProjectConfig;
}());
exports.project = ProjectConfig.project;
exports.existenceClient = ProjectConfig.existenceClient;
exports.existenceServer = ProjectConfig.existenceServer;
exports.existenceDll = ProjectConfig.existenceDll;
exports.existenceServerEntry = ProjectConfig.existenceServerEntry;
exports.babellrc = ProjectConfig.babellrc;
var resolve_project_2 = require("./resolve.project");
Object.defineProperty(exports, "baseDir", { enumerable: true, get: function () { return resolve_project_2.baseDir; } });
var platformConfig = function (key) {
    var root = exports.project.root, isDevelopment = exports.project.isDevelopment, analyzerStatus = exports.project.analyzerStatus, sourceRoot = exports.project.sourceRoot, outputRoot = exports.project.outputRoot, nodeModules = exports.project.nodeModules;
    var _a = exports.project.architect.build, _b = _a === void 0 ? {} : _a, _c = _b.platform, platform = _c === void 0 ? {} : _c;
    var _d = key && platform[key] || {}, options = _d.options, configurations = _d.configurations, builder = _d.builder, _e = _d.outputPath, outputPath = _e === void 0 ? '' : _e;
    var _g = options || {}, index = _g.index, entry = _g.entry, styles = _g.styles, assets = _g.assets, sourceMap = _g.sourceMap, tsConfig = _g.tsConfig, themeVariable = _g.themeVariable;
    var _h = configurations || {}, nodeExternals = _h.nodeExternals, browserTarget = _h.browserTarget, watchFile = _h.watchFile, hotContext = _h.hotContext, _j = _h.publicPath, publicPath = _j === void 0 ? '/' : _j, externals = _h.externals, manifestDll = _h.manifestDll, resolveAlias = _h.resolveAlias, styleLoaderOptions = _h.styleLoaderOptions, hasSourceMap = _h.sourceMap;
    return {
        root: root,
        index: index,
        externals: externals,
        entry: entry,
        publicPath: "".concat(publicPath, "/").replace(/[\/]+/, '/'),
        themeVariable: themeVariable && (0, fs_1.existsSync)(themeVariable) ? themeVariable : undefined,
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
exports.platformConfig = platformConfig;
