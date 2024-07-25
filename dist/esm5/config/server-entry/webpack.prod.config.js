import { __awaiter, __generator } from "tslib";
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var tsConfig = platformConfig(PlatformEnum.serverEntry).tsConfig;
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                process.env.TS_NODE_PROJECT = tsConfig;
                _a = merge;
                return [4 /*yield*/, baseConfig()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
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
                    }])];
        }
    });
}); });
