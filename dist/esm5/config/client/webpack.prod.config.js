import { __assign, __awaiter, __generator } from "tslib";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var _a = platformConfig(PlatformEnum.client), tsConfig = _a.tsConfig, analyzerStatus = _a.analyzerStatus;
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                process.env.TS_NODE_PROJECT = tsConfig;
                _a = merge;
                return [4 /*yield*/, baseConfig()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
                        optimization: __assign(__assign({ emitOnErrors: true, mergeDuplicateChunks: true }, analyzerStatus ? { mergeDuplicateChunks: false, concatenateModules: false } : {}), { minimize: true, minimizer: [
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
                    }])];
        }
    });
}); });
