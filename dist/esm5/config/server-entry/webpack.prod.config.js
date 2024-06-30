import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig, PlatformEnum } from '../config';
var tsConfig = platformConfig(PlatformEnum.serverEntry).tsConfig;
export default (function () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(baseConfig(), {
        optimization: {
            emitOnErrors: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify,
                    terserOptions: {},
                    extractComments: false,
                })
            ]
        }
    });
});
