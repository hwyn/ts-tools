"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_node_externals_1 = tslib_1.__importDefault(require("webpack-node-externals"));
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const circular_dependency_plugin_1 = tslib_1.__importDefault(require("circular-dependency-plugin"));
const tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const jsRules = (0, util_1.jsLoader)({ options: config_1.babellrc });
const { root, entry, assets, sourceRoot, nodeModules, resolveAlias, outputPath, nodeExternals, tsConfig, builder, analyzerStatus } = (0, config_1.platformConfig)(config_1.PlatformEnum.server);
exports.default = () => (0, webpack_merge_1.default)(webpack_config_1.default, {
    target: 'node',
    context: root,
    entry,
    output: {
        path: outputPath,
        chunkFilename: `[name].[chunkhash:8].js`,
        filename: `[name].js`,
        library: 'commonjs',
    },
    resolve: {
        alias: resolveAlias,
        modules: [nodeModules, sourceRoot],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        plugins: tsConfig ? [new tsconfig_paths_webpack_plugin_1.default({ configFile: tsConfig })] : []
    },
    externals: nodeExternals !== false ? [(0, webpack_node_externals_1.default)()] : [],
    module: {
        rules: [
            jsRules.ts({
                transpileOnly: true,
                context: root,
                configFile: tsConfig,
            }),
        ],
    },
    plugins: [
        ...(0, webpack_config_1.copyPlugin)(assets, outputPath, sourceRoot),
        new circular_dependency_plugin_1.default({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: root
        }),
        ...analyzerStatus ? [
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true,
                statsFilename: 'client/stats/server-stats.json'
            })
        ] : [],
    ],
    node: {
        global: false,
        __filename: false,
        __dirname: false
    },
}, (0, webpack_config_1.getMergeConfig)(builder, jsRules));
