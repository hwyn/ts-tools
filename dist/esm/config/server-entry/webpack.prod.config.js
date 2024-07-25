import { __awaiter } from "tslib";
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { tsConfig } = platformConfig(PlatformEnum.serverEntry);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(yield baseConfig(), {
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
