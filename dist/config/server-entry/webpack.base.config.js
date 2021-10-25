"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const webpack_1 = require("webpack");
const webpack_node_externals_1 = tslib_1.__importDefault(require("webpack-node-externals"));
const webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const { entry, builder, isDevelopment, outputPath, themeVariable, nodeModules, sourceRoot } = config_1.platformConfig(config_1.PlatformEnum.serverEntry);
const jsRules = util_1.jsLoader({ options: config_1.babellrc });
const cssRules = util_1.cssLoader({
    ...(themeVariable ? { resources: themeVariable } : {}),
    options: {
        modules: {
            localIdentName: `[hash:base64:5]`
        }
    }
}, !isDevelopment);
exports.default = () => webpack_merge_1.default(webpack_config_1.default, {
    target: 'node',
    entry,
    output: {
        publicPath: '',
        path: outputPath,
        chunkFilename: `check/[name].js`,
        filename: `[name].js`,
        libraryTarget: 'commonjs',
    },
    resolve: {
        symlinks: true,
        modules: [nodeModules, sourceRoot],
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
    },
    externals: [
        `${outputPath}/assets.json`,
        webpack_node_externals_1.default(),
    ],
    module: {
        rules: [],
    },
    plugins: [
        new webpack_1.ProgressPlugin(),
    ],
    node: false,
}, webpack_config_1.getMergeConfig(builder, jsRules, cssRules));
