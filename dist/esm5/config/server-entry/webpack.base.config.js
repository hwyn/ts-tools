import { __assign, __awaiter, __generator } from "tslib";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { ProgressPlugin } from 'webpack';
import merge from 'webpack-merge';
import nodeExtrnals from 'webpack-node-externals';
import { cssLoader, jsLoader } from '../../core/util';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
var _a = platformConfig(PlatformEnum.serverEntry), entry = _a.entry, nodeExternals = _a.nodeExternals, builder = _a.builder, tsConfig = _a.tsConfig, root = _a.root, isDevelopment = _a.isDevelopment, outputPath = _a.outputPath, themeVariable = _a.themeVariable, resolveAlias = _a.resolveAlias, nodeModules = _a.nodeModules, sourceRoot = _a.sourceRoot;
// tsconfig path 可以统一配置
var _b = platformConfig(PlatformEnum.server).tsConfig, serverTsConfig = _b === void 0 ? tsConfig : _b;
var jsRules = jsLoader({ options: babellrc });
var cssRules = cssLoader(__assign(__assign({}, (themeVariable ? { resources: themeVariable } : {})), { options: {
        modules: {
            exportOnlyLocals: true,
            localIdentName: isDevelopment ? "[local]--[hash:base64:4]" : "[contenthash:base64:5]",
            mode: function (resourcePath) { return /node_modules/.test(resourcePath) ? 'global' : 'local'; }
        }
    } }), !isDevelopment);
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = merge(webpackConfig, {
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
                        plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: serverTsConfig || tsConfig })] : []
                    },
                    externals: (nodeExternals !== false ? [nodeExtrnals()] : []).concat("".concat(outputPath, "/assets.json")),
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
                        new ProgressPlugin(),
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
                _a = merge;
                _b = [config];
                return [4 /*yield*/, getMergeConfig(builder, jsRules, cssRules, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); });
