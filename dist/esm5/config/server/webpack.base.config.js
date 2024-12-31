import { __awaiter, __generator, __spreadArray } from "tslib";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import nodeExtrnals from 'webpack-node-externals';
import { jsLoader } from '../../core/util';
import webpackConfig, { copyPlugin, getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
var jsRules = jsLoader({ options: babellrc });
var _a = platformConfig(PlatformEnum.server), root = _a.root, entry = _a.entry, assets = _a.assets, sourceRoot = _a.sourceRoot, nodeModules = _a.nodeModules, resolveAlias = _a.resolveAlias, outputPath = _a.outputPath, isDevelopment = _a.isDevelopment, nodeExternals = _a.nodeExternals, tsConfig = _a.tsConfig, builder = _a.builder, analyzerStatus = _a.analyzerStatus;
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config = merge(webpackConfig, {
                    target: 'node',
                    externalsPresets: { node: true },
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
                        plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: tsConfig })] : []
                    },
                    externals: nodeExternals !== false ? [nodeExtrnals(isDevelopment ? { allowlist: function (name) { return /@hwy-fm\/.*/g.test(name); } } : {})] : [],
                    module: {
                        rules: [
                            jsRules.ts({
                                transpileOnly: true,
                                context: root,
                                configFile: tsConfig,
                            }),
                        ],
                    },
                    plugins: __spreadArray(__spreadArray([], copyPlugin(assets, outputPath, sourceRoot), true), analyzerStatus ? [
                        new BundleAnalyzerPlugin({
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
                _a = merge;
                _b = [config];
                return [4 /*yield*/, getMergeConfig(builder, jsRules, null, config)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); });
