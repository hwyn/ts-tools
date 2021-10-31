"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const webpack_1 = require("webpack");
const webpack_config_1 = (0, tslib_1.__importStar)(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const { entry, builder, tsConfig, root, isDevelopment, outputPath, themeVariable, nodeModules, sourceRoot } = (0, config_1.platformConfig)(config_1.PlatformEnum.serverEntry);
const jsRules = (0, util_1.jsLoader)({ options: config_1.babellrc });
const cssRules = (0, util_1.cssLoader)({
    ...(themeVariable ? { resources: themeVariable } : {}),
    options: {
        modules: {
            exportOnlyLocals: true,
            localIdentName: `[contenthash:base64:5]`
        }
    }
}, false);
exports.default = () => (0, webpack_merge_1.default)(webpack_config_1.default, {
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
        `${outputPath}/assets.json`
    ],
    module: {
        rules: [
            jsRules.ts({
                happyPackMode: true,
                transpileOnly: !isDevelopment,
                configFile: tsConfig,
                exclude: nodeModules,
                context: root
            }),
            cssRules.sass({}, false)
        ],
    },
    plugins: [
        new webpack_1.ProgressPlugin(),
    ],
    node: false,
}, (0, webpack_config_1.getMergeConfig)(builder, jsRules, cssRules));
