"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackRunDll = exports.webpackRun = exports.isRun = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const config_1 = require("../config");
const config_2 = require("../config");
const isRun = (webpackconfig) => {
    return !(0, lodash_1.isEmpty)(webpackconfig.entry);
};
exports.isRun = isRun;
function webpackRun(webpackconfig, _stast) {
    if (Array.isArray(webpackconfig)) {
        return Promise.all(webpackconfig.map((config) => webpackRun(config, config.stats)));
    }
    return new Promise((resolve, reject) => {
        if (!(0, exports.isRun)(webpackconfig)) {
            return resolve(null);
        }
        const multiCompiler = (0, webpack_1.default)(webpackconfig);
        multiCompiler.run((err, stats) => {
            if (err) {
                return reject();
            }
            console.info(stats.toString(webpackconfig.stats || _stast));
            resolve(null);
        });
    });
}
exports.webpackRun = webpackRun;
function webpackRunDll() {
    const { entry } = (0, config_1.platformConfig)(config_1.PlatformEnum.dll);
    return Object.keys(entry).reduce((promise, key) => {
        const dll = (0, config_1.webpackDll)(key);
        return promise.then(() => webpackRun(dll, dll.stats));
    }, Promise.resolve());
}
exports.webpackRunDll = webpackRunDll;
exports.default = async () => {
    return (config_2.existenceDll ? webpackRunDll() : Promise.resolve()).then(() => webpackRun([
        ...config_2.existenceServerEntry ? [(0, config_1.webpackServerEntry)()] : [],
        ...config_2.existenceClient ? [(0, config_1.webpackClient)()] : [],
    ])).then(() => webpackRun([...config_2.existenceServer ? [(0, config_1.webpackServer)()] : []]));
};
