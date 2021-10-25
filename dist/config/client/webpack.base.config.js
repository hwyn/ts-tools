"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const webpack_1 = require("webpack");
const html_webpack_plugin_1 = tslib_1.__importDefault(require("html-webpack-plugin"));
const webpack_assets_manifest_1 = tslib_1.__importDefault(require("webpack-assets-manifest"));
const fs_1 = require("fs");
const webpack_config_1 = tslib_1.__importStar(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const circular_dependency_plugin_1 = tslib_1.__importDefault(require("circular-dependency-plugin"));
const lodash_1 = require("lodash");
const tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const { presets, plugins, ...babellrcOthers } = config_1.babellrc;
const { root, sourceRoot, sourceClient, nodeModules, index, entry, themeVariable, styles, assets, outputPath, tsConfig, isDevelopment, analyzerStatus, builder, browserTarget = [] } = config_1.platformConfig(config_1.PlatformEnum.client);
const cssRules = util_1.cssLoader({
    ...(themeVariable ? { resources: themeVariable } : {}),
    options: {
        modules: {
            localIdentName: `[hash:base64:5]`
        }
    }
}, !isDevelopment);
const jsRules = util_1.jsLoader({
    options: {
        presets: [
            ["@babel/preset-env", { "targets": browserTarget }],
            ...(presets || []).slice(1),
        ],
        plugins: plugins || [],
        ...babellrcOthers
    }
});
const fileResource = util_1.assetResource();
exports.default = () => webpack_merge_1.default(webpack_config_1.default, {
    target: 'web',
    context: root,
    entry: {
        ...entry,
        ...(!lodash_1.isEmpty(styles) && { styles } || {}),
    },
    output: {
        publicPath: '/',
        path: outputPath,
        chunkFilename: `javascript/[name].[chunkhash:8].js`,
        filename: `javascript/[name].[hash:8].js`
    },
    resolve: {
        symlinks: true,
        modules: [nodeModules, sourceRoot],
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
        plugins: [new tsconfig_paths_webpack_plugin_1.default({ configFile: tsConfig })]
    },
    module: {
        rules: [
            jsRules.babel(),
            jsRules.ts({
                happyPackMode: true,
                transpileOnly: !isDevelopment,
                configFile: tsConfig,
                exclude: nodeModules,
                context: root
            }),
            cssRules.sass(),
            fileResource.image({ generator: { filename: 'images/[name][hash:4].[ext]' } }),
            fileResource.font({ generator: { filename: 'fonts/[name][hash:4].[ext]' } })
        ],
    },
    plugins: [
        new webpack_1.ProgressPlugin(),
        ...webpack_config_1.copyPlugin(assets, outputPath, sourceClient),
        new circular_dependency_plugin_1.default({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: root
        }),
        new webpack_assets_manifest_1.default({
            output: `${outputPath}/../static/assets.json`,
            writeToDisk: true,
            publicPath: true,
            customize: ({ key, value }) => {
                if (key.toLowerCase().endsWith('.map'))
                    return false;
                return { key, value };
            }
        }),
        ...analyzerStatus ? [
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true,
                statsFilename: 'stats.json'
            })
        ] : [],
        ...fs_1.existsSync(`${outputPath}/../static/dll-manifest.json`) ? [
            new webpack_1.DllReferencePlugin({
                context: root,
                manifest: require(`${outputPath}/../static/dll-manifest.json`)
            })
        ] : [],
        new html_webpack_plugin_1.default({
            template: index
        })
    ],
}, webpack_config_1.getMergeConfig(builder, jsRules, cssRules));
