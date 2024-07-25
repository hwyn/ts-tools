"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var webpack_node_externals_1 = tslib_1.__importDefault(require("webpack-node-externals"));
var util_1 = require("../../core/util");
var webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
var config_1 = require("../config");
var jsRules = (0, util_1.jsLoader)({ options: config_1.babellrc });
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.server), root = _a.root, entry = _a.entry, assets = _a.assets, sourceRoot = _a.sourceRoot, nodeModules = _a.nodeModules, resolveAlias = _a.resolveAlias, outputPath = _a.outputPath, isDevelopment = _a.isDevelopment, nodeExternals = _a.nodeExternals, tsConfig = _a.tsConfig, builder = _a.builder, analyzerStatus = _a.analyzerStatus;
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = (0, webpack_merge_1.default)(webpack_config_1.default, {
                    target: 'node',
                    context: root,
                    entry: entry,
                    output: {
                        path: outputPath,
                        chunkFilename: "[name].[chunkhash:8].js",
                        filename: "[name].js",
                        library: 'commonjs',
                    },
                    resolve: {
                        alias: resolveAlias,
                        modules: [nodeModules, sourceRoot],
                        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                        plugins: tsConfig ? [new tsconfig_paths_webpack_plugin_1.default({ configFile: tsConfig })] : []
                    },
                    externals: nodeExternals !== false ? [(0, webpack_node_externals_1.default)(isDevelopment ? { allowlist: function (name) { return /(@fm|@hwy-fm)\/.*/g.test(name); } } : {})] : [],
                    module: {
                        rules: [
                            jsRules.ts({
                                transpileOnly: true,
                                context: root,
                                configFile: tsConfig,
                            }),
                        ],
                    },
                    plugins: tslib_1.__spreadArray(tslib_1.__spreadArray([], (0, webpack_config_1.copyPlugin)(assets, outputPath, sourceRoot), true), analyzerStatus ? [
                        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                            analyzerMode: 'disabled',
                            generateStatsFile: true,
                            statsFilename: 'client/stats/server-stats.json'
                        })
                    ] : [], true),
                    node: {
                        global: false,
                        __filename: false,
                        __dirname: false
                    },
                });
                _a = webpack_merge_1.default;
                _b = [config];
                return [4 /*yield*/, (0, webpack_config_1.getMergeConfig)(builder, jsRules, null, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); });
