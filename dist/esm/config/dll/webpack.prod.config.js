import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.base.config';
export default (entryKey) => merge(baseConfig(entryKey), {
    optimization: {
        splitChunks: {},
        minimize: true,
        minimizer: [
            new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                terserOptions: {},
                extractComments: false,
            })
        ]
    },
});