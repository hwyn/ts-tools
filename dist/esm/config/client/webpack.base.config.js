import merge from 'webpack-merge';
import { ProgressPlugin, DllReferencePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { existsSync } from 'fs';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader, cssLoader, assetResource } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import { isEmpty } from 'lodash';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const { presets, plugins, ...babellrcOthers } = babellrc;
const { root, externals = {}, resolveAlias, sourceRoot, sourceClient, nodeModules, index, entry, publicPath = '/', themeVariable, styles, assets, outputPath, tsConfig, isDevelopment, analyzerStatus, builder, browserTarget = [], manifestDll, styleLoaderOptions } = platformConfig(PlatformEnum.client);
// tsconfig path 可以统一配置
const { tsConfig: serverTsConfig = tsConfig } = platformConfig(PlatformEnum.server);
const cssRules = cssLoader({
    options: {
        modules: {
            localIdentName: isDevelopment ? `[local]--[hash:base64:4]` : `[contenthash:base64:5]`,
            mode: (resourcePath) => /node_modules/.test(resourcePath) ? 'global' : 'local'
        }
    },
    ...(themeVariable ? { resources: themeVariable } : {}),
    styleLoaderOptions
}, !isDevelopment);
const jsRules = jsLoader({
    options: {
        presets: [
            ["@babel/preset-env", { targets: browserTarget }],
            ...(presets || []).slice(1),
        ],
        plugins: plugins || [],
        ...babellrcOthers
    }
});
const fileResource = assetResource();
export default () => merge(webpackConfig, {
    target: 'web',
    context: root,
    entry: {
        ...entry,
        ...(!isEmpty(styles) && { styles } || {}),
    },
    output: {
        publicPath,
        path: outputPath,
        chunkFilename: `javascript/[name].[chunkhash:8].js`,
        filename: `javascript/[name].[contenthash:8].js`
    },
    externals,
    resolve: {
        symlinks: true,
        alias: resolveAlias,
        modules: [nodeModules, sourceRoot],
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
        plugins: tsConfig ? [new TsconfigPathsPlugin({ configFile: serverTsConfig || tsConfig })] : []
    },
    module: {
        rules: [
            jsRules.ts({
                happyPackMode: true,
                transpileOnly: !isDevelopment,
                configFile: tsConfig,
                exclude: nodeModules,
                context: root
            }),
            cssRules.sass(),
            fileResource.image({ generator: { filename: 'images/[name][contenthash:4][ext]' } }),
            fileResource.font({ generator: { filename: 'fonts/[name][contenthash:4][ext]' } })
        ],
    },
    plugins: [
        new ProgressPlugin(),
        ...copyPlugin(assets, outputPath, sourceClient),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: root
        }),
        new WebpackAssetsManifest({
            output: `${outputPath}/static/assets.json`,
            writeToDisk: true,
            publicPath: true,
            entrypoints: true,
            transform: ({ entrypoints }) => Object.keys(entrypoints).reduce((obj, key) => ({ ...obj, [key]: { ...entrypoints[key].assets } }), {}),
            customize: ({ key, value }) => {
                if (key.toLowerCase().endsWith('.map'))
                    return false;
                return { key, value };
            }
        }),
        ...analyzerStatus ? [
            new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true,
                statsFilename: 'stats.json'
            })
        ] : [],
        ...(manifestDll || existsSync(`${outputPath}/static/dll-manifest.json`)) ? [
            new DllReferencePlugin({
                context: root,
                manifest: require(manifestDll || `${outputPath}/static/dll-manifest.json`)
            })
        ] : [],
        ...index ? [new HtmlWebpackPlugin({
                template: index,
                minify: {
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: false,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            })] : []
    ],
}, getMergeConfig(builder, jsRules, cssRules));
