import { __assign, __awaiter, __generator } from "tslib";
import webpack from 'webpack';
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var hotPlug = function (key) { return "webpack-hot-middleware/client?path=__webpack_hmr&name=".concat(key, "&reload=true&dynamicPublicPath=true"); };
var _a = platformConfig(PlatformEnum.client), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, entry, _a, _b, _c, filename, _d, chunkFilename;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, baseConfig()];
            case 1:
                config = _e.sent();
                entry = config.entry;
                _a = config.output, _b = _a === void 0 ? {} : _a, _c = _b.filename, filename = _c === void 0 ? '' : _c, _d = _b.chunkFilename, chunkFilename = _d === void 0 ? '' : _d;
                delete config.entry;
                return [2 /*return*/, happypackMerge(merge(config, __assign({ mode: 'development', entry: Object.keys(entry).reduce(function (obj, key) {
                            var _a;
                            return Object.assign(obj, (_a = {},
                                _a[key] = Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
                                _a));
                        }, {}), output: {
                            filename: typeof filename === 'string' ? filename.replace('\.[contenthash:8]', '') : filename,
                            chunkFilename: typeof chunkFilename === 'string' ? chunkFilename.replace('\.[chunkhash:8]', '') : chunkFilename,
                        }, plugins: [
                            new webpack.HotModuleReplacementPlugin(),
                            new webpack.NoEmitOnErrorsPlugin()
                        ] }, hasSourceMap ? { devtool: sourceMap } : {})))];
        }
    });
}); });
