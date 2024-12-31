import { __awaiter } from "tslib";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { tsConfig, analyzerStatus } = platformConfig(PlatformEnum.client);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(yield baseConfig(), {
        optimization: Object.assign(Object.assign({ emitOnErrors: true, mergeDuplicateChunks: true }, analyzerStatus ? { mergeDuplicateChunks: false, concatenateModules: false } : {}), { minimize: true, minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: { comments: false }
                    },
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
