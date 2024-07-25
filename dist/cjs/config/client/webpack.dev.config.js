"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var happypack_1 = require("../../core/happypack");
var config_1 = require("../config");
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var hotPlug = function (key) { return "webpack-hot-middleware/client?path=__webpack_hmr&name=".concat(key, "&reload=true&dynamicPublicPath=true"); };
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.client), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var config, entry, _a, _b, _c, filename, _d, chunkFilename;
    return tslib_1.__generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, webpack_base_config_1.default)()];
            case 1:
                config = _e.sent();
                entry = config.entry;
                _a = config.output, _b = _a === void 0 ? {} : _a, _c = _b.filename, filename = _c === void 0 ? '' : _c, _d = _b.chunkFilename, chunkFilename = _d === void 0 ? '' : _d;
                delete config.entry;
                return [2 /*return*/, (0, happypack_1.happypackMerge)((0, webpack_merge_1.default)(config, tslib_1.__assign({ mode: 'development', entry: Object.keys(entry).reduce(function (obj, key) {
                            var _a;
                            return Object.assign(obj, (_a = {},
                                _a[key] = Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
                                _a));
                        }, {}), output: {
                            filename: typeof filename === 'string' ? filename.replace('\.[contenthash:8]', '') : filename,
                            chunkFilename: typeof chunkFilename === 'string' ? chunkFilename.replace('\.[chunkhash:8]', '') : chunkFilename,
                        }, plugins: [
                            new webpack_1.default.HotModuleReplacementPlugin(),
                            new webpack_1.default.NoEmitOnErrorsPlugin()
                        ] }, hasSourceMap ? { devtool: sourceMap } : {})))];
        }
    });
}); });
