import { __awaiter } from "tslib";
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { analyzerStatus } = platformConfig(PlatformEnum.dll);
export default (entryKey) => __awaiter(void 0, void 0, void 0, function* () {
    return merge(yield baseConfig(entryKey), {
        optimization: Object.assign(Object.assign({ splitChunks: {}, mergeDuplicateChunks: true, minimize: true }, analyzerStatus ? { concatenateModules: false } : {}), { minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify,
                    terserOptions: {},
                    extractComments: false,
                })
            ] }),
    });
});
