"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const webpack_node_externals_1 = (0, tslib_1.__importDefault)(require("webpack-node-externals"));
const webpack_1 = require("webpack");
const webpack_config_1 = (0, tslib_1.__importStar)(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const tsconfig_paths_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("tsconfig-paths-webpack-plugin"));
const circular_dependency_plugin_1 = (0, tslib_1.__importDefault)(require("circular-dependency-plugin"));
const { entry, nodeExternals, builder, tsConfig, root, isDevelopment, outputPath, themeVariable, resolveAlias, nodeModules, sourceRoot } = (0, config_1.platformConfig)(config_1.PlatformEnum.serverEntry);
// tsconfig path 可以统一配置
const { tsConfig: serverTsConfig = tsConfig } = (0, config_1.platformConfig)(config_1.PlatformEnum.server);
const jsRules = (0, util_1.jsLoader)({ options: config_1.babellrc });
const cssRules = (0, util_1.cssLoader)({
    ...(themeVariable ? { resources: themeVariable } : {}),
    options: {
        modules: {
            exportOnlyLocals: true,
            localIdentName: isDevelopment ? `[local]--[hash:base64:4]` : `[contenthash:base64:5]`,
            mode: (resourcePath) => /node_modules/.test(resourcePath) ? 'global' : 'local'
        }
    }
}, !isDevelopment);
exports.default = () => (0, webpack_merge_1.default)(webpack_config_1.default, {
    target: 'node',
    context: root,
    entry,
    output: {
        path: outputPath,
        chunkFilename: `check/[name].js`,
        filename: `[name].js`,
        libraryTarget: 'commonjs',
    },
    resolve: {
        symlinks: true,
        alias: resolveAlias,
        modules: [nodeModules, sourceRoot],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        plugins: tsConfig ? [new tsconfig_paths_webpack_plugin_1.default({ configFile: serverTsConfig || tsConfig })] : []
    },
    externals: (nodeExternals !== false ? [(0, webpack_node_externals_1.default)()] : []).concat(`${outputPath}/assets.json`),
    module: {
        rules: [
            jsRules.babel(),
            jsRules.ts({
                happyPackMode: true,
                transpileOnly: !isDevelopment,
                context: root,
                configFile: tsConfig,
                exclude: nodeModules
            }),
            cssRules.sass({}, false)
        ]
    },
    plugins: [
        new webpack_1.ProgressPlugin(),
        new circular_dependency_plugin_1.default({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: root
        })
    ],
    node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
}, (0, webpack_config_1.getMergeConfig)(builder, jsRules, cssRules));
