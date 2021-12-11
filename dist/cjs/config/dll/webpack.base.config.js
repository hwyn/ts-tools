"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = (0, tslib_1.__importDefault)(require("webpack"));
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const webpack_2 = require("webpack");
const webpack_assets_manifest_1 = (0, tslib_1.__importDefault)(require("webpack-assets-manifest"));
const mini_css_extract_plugin_1 = (0, tslib_1.__importDefault)(require("mini-css-extract-plugin"));
const webpack_config_1 = (0, tslib_1.__importStar)(require("../base/webpack.config"));
const util_1 = require("../../core/util");
const config_1 = require("../config");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const { presets, plugins } = config_1.babellrc;
const { root, builder, entry, outputPath, tsConfig, browserTarget, analyzerStatus } = (0, config_1.platformConfig)(config_1.PlatformEnum.dll);
const jsRules = (0, util_1.jsLoader)({
    options: {
        presets: [
            ["@babel/preset-env", { "targets": browserTarget }],
            ...(presets || []).slice(1),
        ],
        plugins: [
            ...(plugins || []),
        ],
    }
});
const cssRules = (0, util_1.cssLoader)({}, true);
const fileResource = (0, util_1.assetResource)();
exports.default = () => (0, webpack_merge_1.default)(webpack_config_1.default, {
    target: 'web',
    entry,
    output: {
        path: outputPath,
        filename: 'javascript/[name].dll.js',
        chunkFilename: `javascript/[name].[chunkhash:8].js`,
        library: "[name]_[fullhash:8]",
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
            cssRules.less({
                javascriptEnabled: true,
            }),
            cssRules.sass(),
            fileResource.image({ generator: { filename: 'images/[name][contenthash:4][ext]' } }),
            fileResource.font({ generator: { filename: 'fonts/[name][contenthash:4][ext]' } })
        ]
    },
    plugins: [
        new webpack_2.ProgressPlugin(),
        new mini_css_extract_plugin_1.default({
            filename: 'styleSheet/[name].css',
            chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
        }),
        new webpack_assets_manifest_1.default({
            output: path_1.default.join(outputPath, 'static/dll.json'),
            writeToDisk: true,
            publicPath: true,
            customize: ({ key, value }) => {
                if (key.toLowerCase().endsWith('.map'))
                    return false;
                return { key, value };
            }
        }),
        new webpack_1.default.DllPlugin({
            context: root,
            path: path_1.default.join(outputPath, 'static/dll-manifest.json'),
            name: "[name]_[fullhash:8]"
        }),
        ...analyzerStatus ? [
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true,
                statsFilename: 'dll-stats.json'
            })
        ] : [],
    ],
}, (0, webpack_config_1.getMergeConfig)(builder, jsRules));
