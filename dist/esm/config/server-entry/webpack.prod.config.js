import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig, PlatformEnum } from '../config';
const { tsConfig } = platformConfig(PlatformEnum.serverEntry);
export default () => {
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
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production"),
                },
            }),
        ]
    });
};
