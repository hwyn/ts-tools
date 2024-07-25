import { __awaiter } from "tslib";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import nodeExtrnals from 'webpack-node-externals';
import { jsLoader } from '../../core/util';
import webpackConfig, { copyPlugin, getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
const jsRules = jsLoader({ options: babellrc });
const { root, entry, assets, sourceRoot, nodeModules, resolveAlias, outputPath, isDevelopment, nodeExternals, tsConfig, builder, analyzerStatus } = platformConfig(PlatformEnum.server);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    const config = merge(webpackConfig, {
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
            plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: tsConfig })] : []
        },
        externals: nodeExternals !== false ? [nodeExtrnals(isDevelopment ? { allowlist: (name) => /(@fm|@hwy-fm)\/.*/g.test(name) } : {})] : [],
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
            ...copyPlugin(assets, outputPath, sourceRoot),
            // new CircularDependencyPlugin({
            //   exclude: /node_modules/,
            //   failOnError: true,
            //   allowAsyncCycles: false,
            //   cwd: root
            // }),
            ...analyzerStatus ? [
                new BundleAnalyzerPlugin({
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
    });
    return merge(config, yield getMergeConfig(builder, jsRules, null, config));
});
