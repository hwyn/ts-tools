import { __awaiter } from "tslib";
import { existsSync } from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack, { DllReferencePlugin, ProgressPlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { assetResource, cssLoader, jsLoader } from '../../core/util';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { babellrc, platformConfig, PlatformEnum } from '../config';
const { presets = [], plugins } = babellrc;
const { root, resolveAlias, externals, manifestDll, builder, entry: originEntry, outputPath, tsConfig, browserTarget, analyzerStatus } = platformConfig(PlatformEnum.dll);
const jsRules = jsLoader({
    options: {
        presets: [
            ["@babel/preset-env", { "targets": browserTarget }],
            ...presets.filter((item) => (Array.isArray(item) ? item[0] : item) !== '@babel/preset-env')
        ],
        plugins: [
            ...(plugins || []),
        ],
    }
});
const cssRules = cssLoader({}, true);
const fileResource = assetResource();
export default (entryKey) => __awaiter(void 0, void 0, void 0, function* () {
    const config = merge(webpackConfig, {
        target: 'web',
        context: root,
        entry: { [entryKey]: originEntry[entryKey] },
        output: {
            path: outputPath,
            filename: 'javascript/[name].dll.js',
            chunkFilename: `javascript/[name].[chunkhash:8].js`,
            library: "[name]_[fullhash:8]",
        },
        externals,
        resolve: {
            alias: resolveAlias,
        },
        module: {
            rules: [
                jsRules.babel(),
                jsRules.ts({
                    transpileOnly: true,
                    context: root,
                    configFile: tsConfig,
                }),
                cssRules.css(),
                cssRules.less({ javascriptEnabled: true }),
                cssRules.sass(),
                fileResource.image({ generator: { filename: 'images/[name][contenthash:4][ext]' } }),
                fileResource.font({ generator: { filename: 'fonts/[name][contenthash:4][ext]' } })
            ]
        },
        plugins: [
            new ProgressPlugin(),
            new MiniCssExtractPlugin({
                filename: 'styleSheet/[name].css',
                chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
            }),
            new WebpackAssetsManifest({
                output: path.join(outputPath, `static/dll-${entryKey}.json`),
                writeToDisk: true,
                publicPath: true,
                customize: ({ key, value }) => {
                    if (key.toLowerCase().endsWith('.map'))
                        return false;
                    return { key, value };
                }
            }),
            ...manifestDll.filter((filePath) => existsSync(filePath)).map((manifest) => new DllReferencePlugin({ context: root, manifest: require(manifest) })),
            new webpack.DllPlugin({
                context: root,
                path: path.join(outputPath, `manifest/dll-${entryKey}-manifest.json`),
                name: "[name]_[fullhash:8]"
            }),
            ...analyzerStatus ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'disabled',
                    generateStatsFile: true,
                    statsFilename: `stats/dll-${entryKey}-stats.json`
                })
            ] : [],
        ],
    });
    return merge(config, yield getMergeConfig(builder, jsRules, cssRules, config));
});
