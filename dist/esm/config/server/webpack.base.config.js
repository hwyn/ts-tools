import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
const jsRules = jsLoader({ options: babellrc });
const { root, entry, assets, sourceRoot, resolveAlias, outputPath, nodeExternals, tsConfig, builder } = platformConfig(PlatformEnum.server);
export default () => merge(webpackConfig, {
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
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: tsConfig })] : []
    },
    externals: nodeExternals !== false ? [nodeExtrnals()] : [],
    module: {
        rules: [
            jsRules.babel(),
            jsRules.ts({
                transpileOnly: true,
                context: root,
                configFile: tsConfig,
            }),
        ],
    },
    plugins: [
        ...copyPlugin(assets, outputPath, sourceRoot),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: root
        }),
    ],
    node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
}, getMergeConfig(builder, jsRules));
