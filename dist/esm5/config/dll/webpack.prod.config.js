import { __assign, __awaiter, __generator } from "tslib";
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var analyzerStatus = platformConfig(PlatformEnum.dll).analyzerStatus;
export default (function (entryKey) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = merge;
                return [4 /*yield*/, baseConfig(entryKey)];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
                        optimization: __assign(__assign({ mergeDuplicateChunks: true }, analyzerStatus ? { mergeDuplicateChunks: false, concatenateModules: false } : {}), { minimize: true, minimizer: [
                                new TerserPlugin({
                                    terserOptions: {
                                        format: { comments: false }
                                    },
                                    extractComments: false,
                                })
                            ] }),
                    }])];
        }
    });
}); });
