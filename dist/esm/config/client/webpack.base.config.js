import { __rest } from "tslib";
import merge from 'webpack-merge';
import { ProgressPlugin, DllReferencePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { existsSync } from 'fs';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader, cssLoader, assetResource } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';
import { isEmpty } from 'lodash';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const { presets = [], plugins } = babellrc, babellrcOthers = __rest(babellrc, ["presets", "plugins"]);
const { root, externals = {}, resolveAlias, sourceRoot, nodeModules, index, entry, publicPath = '/', themeVariable, styles, assets, outputPath, tsConfig, isDevelopment, analyzerStatus, builder, browserTarget = [], manifestDll: originManifestDll, styleLoaderOptions } = platformConfig(PlatformEnum.client);
// tsconfig path 可以统一配置
const { tsConfig: serverTsConfig = tsConfig } = platformConfig(PlatformEnum.server);
const cssRules = cssLoader(Object.assign(Object.assign({ options: {
        modules: {
            localIdentName: isDevelopment ? `[local]--[hash:base64:4]` : `[contenthash:base64:5]`,
            mode: (resourcePath) => /node_modules/.test(resourcePath) ? 'global' : 'local'
        }
    } }, (themeVariable ? { resources: themeVariable } : {})), { styleLoaderOptions }), !isDevelopment);
const jsRules = jsLoader({
    options: Object.assign({ presets: [
            ['@babel/preset-env', { targets: browserTarget }],
            ...presets.filter((item) => (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env'),
        ], plugins: plugins || [] }, babellrcOthers)
});
const fileResource = assetResource();
const defaultMainfestPath = `${outputPath}/manifest/dll-common-manifest.json`;
const manifestDll = originManifestDll ? originManifestDll : existsSync(defaultMainfestPath) ? [defaultMainfestPath] : [];
export default () => {
    const config = merge(webpackConfig, {
        target: 'web',
        context: root,
        entry: Object.assign(Object.assign({}, entry), (!isEmpty(styles) && { styles } || {})),
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
            ...copyPlugin(assets, outputPath, sourceRoot),
            // new CircularDependencyPlugin({
            //   exclude: /node_modules/,
            //   failOnError: true,
            //   allowAsyncCycles: false,
            //   cwd: root
            // }),
            new WebpackAssetsManifest({
                output: `${outputPath}/static/assets.json`,
                writeToDisk: true,
                publicPath: true,
                entrypoints: true,
                transform: (assets) => {
                    const { entrypoints } = assets;
                    const assetsKeys = Object.keys(assets);
                    const entrypointsKeys = Object.keys(entrypoints);
                    const assetsObject = Object.keys(entrypoints).reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: Object.assign({}, entrypoints[key].assets) })), { chunk: { css: [] } });
                    assetsObject.chunk.css = assetsKeys.filter((key) => /.css$/.test(key) && !entrypointsKeys.includes(key.replace(/.css$/, ''))).map((key) => assets[key]);
                    ;
                    return assetsObject;
                },
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
                    statsFilename: 'stats/stats.json'
                })
            ] : [],
            ...manifestDll.map((manifest) => new DllReferencePlugin({ context: root, manifest: require(manifest) })),
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
    });
    return merge(config, getMergeConfig(builder, jsRules, cssRules, config));
};
