import { __assign, __awaiter, __generator } from "tslib";
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var _a = platformConfig(PlatformEnum.serverEntry), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = happypackMerge;
                _b = merge;
                return [4 /*yield*/, baseConfig()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.apply(void 0, [_c.sent(), __assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})]), { excludeLoader: ['css-loader'] }])];
        }
    });
}); });
