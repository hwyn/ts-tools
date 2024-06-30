import { __assign } from "tslib";
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig, PlatformEnum } from '../config';
var analyzerStatus = platformConfig(PlatformEnum.dll).analyzerStatus;
export default (function (entryKey) { return merge(baseConfig(entryKey), {
    optimization: __assign(__assign({ splitChunks: {}, mergeDuplicateChunks: true, minimize: true }, analyzerStatus ? { concatenateModules: false } : {}), { minimizer: [
            new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                terserOptions: {},
                extractComments: false,
            })
        ] }),
}); });
