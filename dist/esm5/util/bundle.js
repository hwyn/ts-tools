import { __awaiter, __generator, __spreadArray } from "tslib";
import { isEmpty } from 'lodash';
import webpack from 'webpack';
import { webpackServer, webpackClient, webpackDll, webpackServerEntry, platformConfig, PlatformEnum } from '../config';
import { existenceClient, existenceDll, existenceServer, existenceServerEntry } from '../config';
export var isRun = function (webpackconfig) {
    return !isEmpty(webpackconfig.entry);
};
export function webpackRun(webpackconfig, _stast) {
    if (Array.isArray(webpackconfig)) {
        return Promise.all(webpackconfig.map(function (config) { return webpackRun(config, config.stats); }));
    }
    return new Promise(function (resolve, reject) {
        if (!isRun(webpackconfig)) {
            return resolve(null);
        }
        var multiCompiler = webpack(webpackconfig);
        multiCompiler.run(function (err, stats) {
            if (err) {
                return reject();
            }
            console.info(stats.toString(webpackconfig.stats || _stast));
            resolve(null);
        });
    });
}
export function webpackRunDll() {
    var entry = platformConfig(PlatformEnum.dll).entry;
    return Object.keys(entry).reduce(function (promise, key) { return promise.then(function () {
        var dll = webpackDll(key);
        return webpackRun(dll, dll.stats);
    }); }, Promise.resolve());
}
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (existenceDll ? webpackRunDll() : Promise.resolve()).then(function () { return webpackRun(__spreadArray(__spreadArray([], existenceServerEntry ? [webpackServerEntry()] : [], true), existenceClient ? [webpackClient()] : [], true)); }).then(function () { return webpackRun(__spreadArray([], existenceServer ? [webpackServer()] : [], true)); })];
    });
}); });
