"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRun = void 0;
exports.webpackRun = webpackRun;
exports.webpackRunDll = webpackRunDll;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var config_1 = require("../config");
var isRun = function (webpackconfig) {
    return !(0, lodash_1.isEmpty)(webpackconfig.entry);
};
exports.isRun = isRun;
function webpackRun(webpackconfig, _stast) {
    if (Array.isArray(webpackconfig)) {
        return Promise.all(webpackconfig.map(function (config) { return webpackRun(config, config.stats); }));
    }
    return new Promise(function (resolve, reject) {
        if (!(0, exports.isRun)(webpackconfig)) {
            return resolve(null);
        }
        var multiCompiler = (0, webpack_1.default)(webpackconfig);
        multiCompiler.run(function (err, stats) {
            if (err) {
                return reject();
            }
            console.info(stats.toString(webpackconfig.stats || _stast));
            resolve(null);
        });
    });
}
function webpackRunDll() {
    var entry = (0, config_1.platformConfig)(config_1.PlatformEnum.dll).entry;
    return Object.keys(entry).reduce(function (promise, key) { return promise
        .then(function () { return (0, config_1.webpackDll)(key); })
        .then(function (dll) { return webpackRun(dll, dll.stats); }); }, Promise.resolve());
}
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (config_1.existenceDll ? webpackRunDll() : Promise.resolve()).then(function () { return Promise.all(tslib_1.__spreadArray(tslib_1.__spreadArray([], config_1.existenceServerEntry ? [(0, config_1.webpackServerEntry)()] : [], true), config_1.existenceClient ? [(0, config_1.webpackClient)()] : [], true)); })
                .then(function (result) { return webpackRun(result); })
                .then(function () { return Promise.all(tslib_1.__spreadArray([], config_1.existenceServer ? [(0, config_1.webpackServer)()] : [], true)); })
                .then(function (result) { return webpackRun(result); })];
    });
}); });
