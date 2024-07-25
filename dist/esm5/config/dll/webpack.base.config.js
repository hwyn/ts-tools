import { __awaiter, __generator, __spreadArray } from "tslib";
import { existsSync } from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack, { DllReferencePlugin, ProgressPlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { assetResource, cssLoader, jsLoader } from '../../core/util';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
var _a = babellrc.presets, presets = _a === void 0 ? [] : _a, plugins = babellrc.plugins;
var _b = platformConfig(PlatformEnum.dll), root = _b.root, resolveAlias = _b.resolveAlias, externals = _b.externals, manifestDll = _b.manifestDll, builder = _b.builder, originEntry = _b.entry, outputPath = _b.outputPath, tsConfig = _b.tsConfig, browserTarget = _b.browserTarget, analyzerStatus = _b.analyzerStatus;
var jsRules = jsLoader({
    options: {
        presets: __spreadArray([
            ["@babel/preset-env", { "targets": browserTarget }]
        ], presets.filter(function (item) { return (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env'; }), true),
        plugins: __spreadArray([], (plugins || []), true),
    }
});
var cssRules = cssLoader({}, true);
var fileResource = assetResource();
export default (function (entryKey) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                config = merge(webpackConfig, {
                    target: 'web',
                    context: root,
                    entry: (_c = {}, _c[entryKey] = originEntry[entryKey], _c),
                    output: {
                        path: outputPath,
                        filename: 'javascript/[name].dll.js',
                        chunkFilename: "javascript/[name].[chunkhash:8].js",
                        library: "[name]_[fullhash:8]",
                    },
                    externals: externals,
                    resolve: {
                        alias: resolveAlias,
                    },
                    module: {
                        rules: [
                            jsRules.babel(),
                            jsRules.ts({
                                transpileOnly: true,
                                context: root,
                                configFile: tsConfig,
                            }),
                            cssRules.css(),
                            cssRules.less({ javascriptEnabled: true }),
                            cssRules.sass(),
                            fileResource.image({ generator: { filename: 'images/[name][contenthash:4][ext]' } }),
                            fileResource.font({ generator: { filename: 'fonts/[name][contenthash:4][ext]' } })
                        ]
                    },
                    plugins: __spreadArray(__spreadArray(__spreadArray([
                        new ProgressPlugin(),
                        new MiniCssExtractPlugin({
                            filename: 'styleSheet/[name].css',
                            chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
                        }),
                        new WebpackAssetsManifest({
                            output: path.join(outputPath, "static/dll-".concat(entryKey, ".json")),
                            writeToDisk: true,
                            publicPath: true,
                            customize: function (_a) {
                                var key = _a.key, value = _a.value;
                                if (key.toLowerCase().endsWith('.map'))
                                    return false;
                                return { key: key, value: value };
                            }
                        })
                    ], manifestDll.filter(function (filePath) { return existsSync(filePath); }).map(function (manifest) { return new DllReferencePlugin({ context: root, manifest: require(manifest) }); }), true), [
                        new webpack.DllPlugin({
                            context: root,
                            path: path.join(outputPath, "manifest/dll-".concat(entryKey, "-manifest.json")),
                            name: "[name]_[fullhash:8]"
                        })
                    ], false), analyzerStatus ? [
                        new BundleAnalyzerPlugin({
                            analyzerMode: 'disabled',
                            generateStatsFile: true,
                            statsFilename: "stats/dll-".concat(entryKey, "-stats.json")
                        })
                    ] : [], true),
                });
                _a = merge;
                _b = [config];
                return [4 /*yield*/, getMergeConfig(builder, jsRules, cssRules, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_d.sent()]))];
        }
    });
}); });
