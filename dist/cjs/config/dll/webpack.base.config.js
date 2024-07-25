"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var mini_css_extract_plugin_1 = tslib_1.__importDefault(require("mini-css-extract-plugin"));
var path_1 = tslib_1.__importDefault(require("path"));
var webpack_1 = tslib_1.__importStar(require("webpack"));
var webpack_assets_manifest_1 = tslib_1.__importDefault(require("webpack-assets-manifest"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var util_1 = require("../../core/util");
var webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
var config_1 = require("../config");
var _a = config_1.babellrc.presets, presets = _a === void 0 ? [] : _a, plugins = config_1.babellrc.plugins;
var _b = (0, config_1.platformConfig)(config_1.PlatformEnum.dll), root = _b.root, resolveAlias = _b.resolveAlias, externals = _b.externals, manifestDll = _b.manifestDll, builder = _b.builder, originEntry = _b.entry, outputPath = _b.outputPath, tsConfig = _b.tsConfig, browserTarget = _b.browserTarget, analyzerStatus = _b.analyzerStatus;
var jsRules = (0, util_1.jsLoader)({
    options: {
        presets: tslib_1.__spreadArray([
            ["@babel/preset-env", { "targets": browserTarget }]
        ], presets.filter(function (item) { return (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env'; }), true),
        plugins: tslib_1.__spreadArray([], (plugins || []), true),
    }
});
var cssRules = (0, util_1.cssLoader)({}, true);
var fileResource = (0, util_1.assetResource)();
exports.default = (function (entryKey) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    var _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                config = (0, webpack_merge_1.default)(webpack_config_1.default, {
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
                    plugins: tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([
                        new webpack_1.ProgressPlugin(),
                        new mini_css_extract_plugin_1.default({
                            filename: 'styleSheet/[name].css',
                            chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
                        }),
                        new webpack_assets_manifest_1.default({
                            output: path_1.default.join(outputPath, "static/dll-".concat(entryKey, ".json")),
                            writeToDisk: true,
                            publicPath: true,
                            customize: function (_a) {
                                var key = _a.key, value = _a.value;
                                if (key.toLowerCase().endsWith('.map'))
                                    return false;
                                return { key: key, value: value };
                            }
                        })
                    ], manifestDll.filter(function (filePath) { return (0, fs_1.existsSync)(filePath); }).map(function (manifest) { return new webpack_1.DllReferencePlugin({ context: root, manifest: require(manifest) }); }), true), [
                        new webpack_1.default.DllPlugin({
                            context: root,
                            path: path_1.default.join(outputPath, "manifest/dll-".concat(entryKey, "-manifest.json")),
                            name: "[name]_[fullhash:8]"
                        })
                    ], false), analyzerStatus ? [
                        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                            analyzerMode: 'disabled',
                            generateStatsFile: true,
                            statsFilename: "stats/dll-".concat(entryKey, "-stats.json")
                        })
                    ] : [], true),
                });
                _a = webpack_merge_1.default;
                _b = [config];
                return [4 /*yield*/, (0, webpack_config_1.getMergeConfig)(builder, jsRules, cssRules, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_d.sent()]))];
        }
    });
}); });
