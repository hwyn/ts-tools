import { __assign } from "tslib";
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig, PlatformEnum } from '../config';
var _a = platformConfig(PlatformEnum.client), tsConfig = _a.tsConfig, analyzerStatus = _a.analyzerStatus;
export default (function () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(baseConfig(), {
        optimization: __assign(__assign({ emitOnErrors: true, runtimeChunk: false, mergeDuplicateChunks: true, splitChunks: {} }, analyzerStatus ? { concatenateModules: false } : {}), { minimize: true, minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify,
                    terserOptions: {},
                    extractComments: false,
                })
            ] }),
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styleSheet/[name].[contenthash:4].css',
                chunkFilename: 'styleSheet/[name].[chunkhash:4].css',
            }),
        ]
    });
});
