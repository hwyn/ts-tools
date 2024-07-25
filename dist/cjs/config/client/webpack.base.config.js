"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var html_webpack_plugin_1 = tslib_1.__importDefault(require("html-webpack-plugin"));
var lodash_1 = require("lodash");
var tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
var webpack_1 = require("webpack");
var webpack_assets_manifest_1 = tslib_1.__importDefault(require("webpack-assets-manifest"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var util_1 = require("../../core/util");
var webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
var config_1 = require("../config");
var _a = config_1.babellrc.presets, presets = _a === void 0 ? [] : _a, plugins = config_1.babellrc.plugins, babellrcOthers = tslib_1.__rest(config_1.babellrc, ["presets", "plugins"]);
var _b = (0, config_1.platformConfig)(config_1.PlatformEnum.client), root = _b.root, _c = _b.externals, externals = _c === void 0 ? {} : _c, resolveAlias = _b.resolveAlias, sourceRoot = _b.sourceRoot, nodeModules = _b.nodeModules, index = _b.index, entry = _b.entry, _d = _b.publicPath, publicPath = _d === void 0 ? '/' : _d, themeVariable = _b.themeVariable, styles = _b.styles, assets = _b.assets, outputPath = _b.outputPath, tsConfig = _b.tsConfig, isDevelopment = _b.isDevelopment, analyzerStatus = _b.analyzerStatus, builder = _b.builder, _e = _b.browserTarget, browserTarget = _e === void 0 ? [] : _e, originManifestDll = _b.manifestDll, styleLoaderOptions = _b.styleLoaderOptions;
// tsconfig path 可以统一配置
var _f = (0, config_1.platformConfig)(config_1.PlatformEnum.server).tsConfig, serverTsConfig = _f === void 0 ? tsConfig : _f;
var cssRules = (0, util_1.cssLoader)(tslib_1.__assign(tslib_1.__assign({ options: {
        modules: {
            localIdentName: isDevelopment ? "[local]--[hash:base64:4]" : "[contenthash:base64:5]",
            mode: function (resourcePath) { return /node_modules/.test(resourcePath) ? 'global' : 'local'; }
        }
    } }, (themeVariable ? { resources: themeVariable } : {})), { styleLoaderOptions: styleLoaderOptions }), !isDevelopment);
var jsRules = (0, util_1.jsLoader)({
    options: tslib_1.__assign({ presets: tslib_1.__spreadArray([
            ['@babel/preset-env', { targets: browserTarget }]
        ], presets.filter(function (item) { return (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env'; }), true), plugins: plugins || [] }, babellrcOthers)
});
var fileResource = (0, util_1.assetResource)();
var defaultMainfestPath = "".concat(outputPath, "/manifest/dll-common-manifest.json");
var manifestDll = originManifestDll ? originManifestDll : (0, fs_1.existsSync)(defaultMainfestPath) ? [defaultMainfestPath] : [];
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = (0, webpack_merge_1.default)(webpack_config_1.default, {
                    target: 'web',
                    context: root,
                    entry: tslib_1.__assign(tslib_1.__assign({}, entry), (!(0, lodash_1.isEmpty)(styles) && { styles: styles } || {})),
                    output: {
                        publicPath: publicPath,
                        path: outputPath,
                        chunkFilename: "javascript/[name].[chunkhash:8].js",
                        filename: "javascript/[name].[contenthash:8].js"
                    },
                    externals: externals,
                    resolve: {
                        symlinks: true,
                        alias: resolveAlias,
                        modules: [nodeModules, sourceRoot],
                        extensions: ['.ts', '.tsx', '.mjs', '.js'],
                        plugins: tsConfig ? [new tsconfig_paths_webpack_plugin_1.default({ configFile: serverTsConfig || tsConfig })] : []
                    },
                    module: {
                        rules: [
                            jsRules.ts({
                                happyPackMode: true,
                                transpileOnly: !isDevelopment,
                                configFile: tsConfig,
                                exclude: nodeModules,
                                context: root
                            }),
                            cssRules.sass(),
                            fileResource.image({ generator: { filename: 'images/[name][contenthash:4][ext]' } }),
                            fileResource.font({ generator: { filename: 'fonts/[name][contenthash:4][ext]' } })
                        ],
                    },
                    plugins: tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([
                        new webpack_1.ProgressPlugin()
                    ], (0, webpack_config_1.copyPlugin)(assets, outputPath, sourceRoot), true), [
                        // new CircularDependencyPlugin({
                        //   exclude: /node_modules/,
                        //   failOnError: true,
                        //   allowAsyncCycles: false,
                        //   cwd: root
                        // }),
                        new webpack_assets_manifest_1.default({
                            output: "".concat(outputPath, "/static/assets.json"),
                            writeToDisk: true,
                            publicPath: true,
                            entrypoints: true,
                            transform: function (assets) {
                                var entrypoints = assets.entrypoints;
                                var assetsKeys = Object.keys(assets);
                                var entrypointsKeys = Object.keys(entrypoints);
                                var assetsObject = Object.keys(entrypoints).reduce(function (obj, key) {
                                    var _a;
                                    return (tslib_1.__assign(tslib_1.__assign({}, obj), (_a = {}, _a[key] = tslib_1.__assign({}, entrypoints[key].assets), _a)));
                                }, { chunk: { css: [] } });
                                assetsObject.chunk.css = assetsKeys.filter(function (key) { return /.css$/.test(key) && !entrypointsKeys.includes(key.replace(/.css$/, '')); }).map(function (key) { return assets[key]; });
                                ;
                                return assetsObject;
                            },
                            customize: function (_a) {
                                var key = _a.key, value = _a.value;
                                if (key.toLowerCase().endsWith('.map'))
                                    return false;
                                return { key: key, value: value };
                            }
                        })
                    ], false), analyzerStatus ? [
                        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                            analyzerMode: 'disabled',
                            generateStatsFile: true,
                            statsFilename: 'stats/stats.json'
                        })
                    ] : [], true), manifestDll.map(function (manifest) { return new webpack_1.DllReferencePlugin({ context: root, manifest: require(manifest) }); }), true), index ? [new html_webpack_plugin_1.default({
                            template: index,
                            minify: {
                                collapseWhitespace: true,
                                keepClosingSlash: true,
                                removeComments: false,
                                removeRedundantAttributes: true,
                                removeScriptTypeAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                useShortDoctype: true
                            }
                        })] : [], true),
                });
                _a = webpack_merge_1.default;
                _b = [config];
                return [4 /*yield*/, (0, webpack_config_1.getMergeConfig)(builder, jsRules, cssRules, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); });
