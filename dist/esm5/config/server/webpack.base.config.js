import { __spreadArray } from "tslib";
import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
var jsRules = jsLoader({ options: babellrc });
var _a = platformConfig(PlatformEnum.server), root = _a.root, entry = _a.entry, assets = _a.assets, sourceRoot = _a.sourceRoot, nodeModules = _a.nodeModules, resolveAlias = _a.resolveAlias, outputPath = _a.outputPath, isDevelopment = _a.isDevelopment, nodeExternals = _a.nodeExternals, tsConfig = _a.tsConfig, builder = _a.builder, analyzerStatus = _a.analyzerStatus;
export default (function () {
    var config = merge(webpackConfig, {
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
            plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: tsConfig })] : []
        },
        externals: nodeExternals !== false ? [nodeExtrnals(isDevelopment ? { allowlist: function (name) { return /@fm\/.*/g.test(name); } } : {})] : [],
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
    return merge(config, getMergeConfig(builder, jsRules, null, config));
});
