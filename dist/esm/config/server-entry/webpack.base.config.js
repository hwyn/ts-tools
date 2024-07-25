import { __awaiter } from "tslib";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { ProgressPlugin } from 'webpack';
import merge from 'webpack-merge';
import nodeExtrnals from 'webpack-node-externals';
import { cssLoader, jsLoader } from '../../core/util';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
const { entry, nodeExternals, builder, tsConfig, root, isDevelopment, outputPath, themeVariable, resolveAlias, nodeModules, sourceRoot } = platformConfig(PlatformEnum.serverEntry);
// tsconfig path 可以统一配置
const { tsConfig: serverTsConfig = tsConfig } = platformConfig(PlatformEnum.server);
const jsRules = jsLoader({ options: babellrc });
const cssRules = cssLoader(Object.assign(Object.assign({}, (themeVariable ? { resources: themeVariable } : {})), { options: {
        modules: {
            exportOnlyLocals: true,
            localIdentName: isDevelopment ? `[local]--[hash:base64:4]` : `[contenthash:base64:5]`,
            mode: (resourcePath) => /node_modules/.test(resourcePath) ? 'global' : 'local'
        }
    } }), !isDevelopment);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    const config = merge(webpackConfig, {
        target: 'node',
        context: root,
        entry,
        output: {
            path: outputPath,
            chunkFilename: `check/[name].js`,
            filename: `[name].js`,
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
        externals: (nodeExternals !== false ? [nodeExtrnals()] : []).concat(`${outputPath}/assets.json`),
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
    return merge(config, yield getMergeConfig(builder, jsRules, cssRules, config));
});
