import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { existsSync } from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { isEmpty } from 'lodash';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { DllReferencePlugin, ProgressPlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { assetResource, cssLoader, jsLoader } from '../../core/util';
import webpackConfig, { copyPlugin, getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
var _a = babellrc.presets, presets = _a === void 0 ? [] : _a, plugins = babellrc.plugins, babellrcOthers = __rest(babellrc, ["presets", "plugins"]);
var _b = platformConfig(PlatformEnum.client), root = _b.root, _c = _b.externals, externals = _c === void 0 ? {} : _c, resolveAlias = _b.resolveAlias, sourceRoot = _b.sourceRoot, nodeModules = _b.nodeModules, index = _b.index, entry = _b.entry, _d = _b.publicPath, publicPath = _d === void 0 ? '/' : _d, themeVariable = _b.themeVariable, styles = _b.styles, assets = _b.assets, outputPath = _b.outputPath, tsConfig = _b.tsConfig, isDevelopment = _b.isDevelopment, analyzerStatus = _b.analyzerStatus, builder = _b.builder, _e = _b.browserTarget, browserTarget = _e === void 0 ? [] : _e, originManifestDll = _b.manifestDll, styleLoaderOptions = _b.styleLoaderOptions;
// tsconfig path 可以统一配置
var _f = platformConfig(PlatformEnum.server).tsConfig, serverTsConfig = _f === void 0 ? tsConfig : _f;
var cssRules = cssLoader(__assign(__assign({ options: {
        modules: {
            localIdentName: isDevelopment ? "[local]--[hash:base64:4]" : "[contenthash:base64:5]",
            mode: function (resourcePath) { return /node_modules/.test(resourcePath) ? 'global' : 'local'; }
        }
    } }, (themeVariable ? { resources: themeVariable } : {})), { styleLoaderOptions: styleLoaderOptions }), !isDevelopment);
var jsRules = jsLoader({
    options: __assign({ presets: __spreadArray([
            ['@babel/preset-env', { targets: browserTarget }]
        ], presets.filter(function (item) { return (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env'; }), true), plugins: plugins || [] }, babellrcOthers)
});
var fileResource = assetResource();
var defaultMainfestPath = "".concat(outputPath, "/manifest/dll-common-manifest.json");
var manifestDll = originManifestDll ? originManifestDll : existsSync(defaultMainfestPath) ? [defaultMainfestPath] : [];
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = merge(webpackConfig, {
                    target: 'web',
                    context: root,
                    entry: __assign(__assign({}, entry), (!isEmpty(styles) && { styles: styles } || {})),
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
                        plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: serverTsConfig || tsConfig })] : []
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
                    plugins: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                        new ProgressPlugin()
                    ], copyPlugin(assets, outputPath, sourceRoot), true), [
                        // new CircularDependencyPlugin({
                        //   exclude: /node_modules/,
                        //   failOnError: true,
                        //   allowAsyncCycles: false,
                        //   cwd: root
                        // }),
                        new WebpackAssetsManifest({
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
                                    return (__assign(__assign({}, obj), (_a = {}, _a[key] = __assign({}, entrypoints[key].assets), _a)));
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
                        new BundleAnalyzerPlugin({
                            analyzerMode: 'disabled',
                            generateStatsFile: true,
                            statsFilename: 'stats/stats.json'
                        })
                    ] : [], true), manifestDll.map(function (manifest) { return new DllReferencePlugin({ context: root, manifest: require(manifest) }); }), true), index ? [new HtmlWebpackPlugin({
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
                _a = merge;
                _b = [config];
                return [4 /*yield*/, getMergeConfig(builder, jsRules, cssRules, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); });
