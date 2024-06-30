"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var webpack_node_externals_1 = tslib_1.__importDefault(require("webpack-node-externals"));
var webpack_1 = require("webpack");
var webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
var util_1 = require("../../core/util");
var config_1 = require("../config");
var tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.serverEntry), entry = _a.entry, nodeExternals = _a.nodeExternals, builder = _a.builder, tsConfig = _a.tsConfig, root = _a.root, isDevelopment = _a.isDevelopment, outputPath = _a.outputPath, themeVariable = _a.themeVariable, resolveAlias = _a.resolveAlias, nodeModules = _a.nodeModules, sourceRoot = _a.sourceRoot;
// tsconfig path 可以统一配置
var _b = (0, config_1.platformConfig)(config_1.PlatformEnum.server).tsConfig, serverTsConfig = _b === void 0 ? tsConfig : _b;
var jsRules = (0, util_1.jsLoader)({ options: config_1.babellrc });
var cssRules = (0, util_1.cssLoader)(tslib_1.__assign(tslib_1.__assign({}, (themeVariable ? { resources: themeVariable } : {})), { options: {
        modules: {
            exportOnlyLocals: true,
            localIdentName: isDevelopment ? "[local]--[hash:base64:4]" : "[contenthash:base64:5]",
            mode: function (resourcePath) { return /node_modules/.test(resourcePath) ? 'global' : 'local'; }
        }
    } }), !isDevelopment);
exports.default = (function () {
    var config = (0, webpack_merge_1.default)(webpack_config_1.default, {
        target: 'node',
        context: root,
        entry: entry,
        output: {
            path: outputPath,
            chunkFilename: "check/[name].js",
            filename: "[name].js",
            libraryTarget: 'commonjs',
            asyncChunks: false
        },
        resolve: {
            symlinks: true,
            alias: resolveAlias,
            modules: [nodeModules, sourceRoot],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            plugins: tsConfig ? [new tsconfig_paths_webpack_plugin_1.default({ configFile: serverTsConfig || tsConfig })] : []
        },
        externals: (nodeExternals !== false ? [(0, webpack_node_externals_1.default)()] : []).concat("".concat(outputPath, "/assets.json")),
        module: {
            rules: [
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
            // new CircularDependencyPlugin({
            //   exclude: /node_modules/,
            //   failOnError: true,
            //   allowAsyncCycles: false,
            //   cwd: root
            // })
        ],
        node: {
            global: false,
            __filename: false,
            __dirname: false,
        },
    });
    return (0, webpack_merge_1.default)(config, (0, webpack_config_1.getMergeConfig)(builder, jsRules, cssRules, config));
});
