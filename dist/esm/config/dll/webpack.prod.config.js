import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig, PlatformEnum } from '../config';
const { analyzerStatus } = platformConfig(PlatformEnum.dll);
export default (entryKey) => merge(baseConfig(entryKey), {
    optimization: Object.assign(Object.assign({ splitChunks: {}, mergeDuplicateChunks: true, minimize: true }, analyzerStatus ? { concatenateModules: false } : {}), { minimizer: [
            new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                terserOptions: {},
                extractComments: false,
            })
        ] }),
});
