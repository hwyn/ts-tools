"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackRun = exports.isRun = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const config_1 = require("../config");
const config_2 = require("../config");
exports.isRun = (webpackconfig) => {
    return !lodash_1.isEmpty(webpackconfig.entry);
};
function webpackRun(webpackconfig, _stast) {
    if (Array.isArray(webpackconfig)) {
        return Promise.all(webpackconfig.map((config) => webpackRun(config, config.stats)));
    }
    return new Promise((resolve, reject) => {
        if (!exports.isRun(webpackconfig)) {
            return resolve(null);
        }
        const multiCompiler = webpack_1.default(webpackconfig);
        multiCompiler.run((err, stats) => {
            if (err) {
                console.log('-------------', err);
                return reject();
            }
            console.info(stats.toString(webpackconfig.stats || _stast));
            resolve(null);
        });
    });
}
exports.webpackRun = webpackRun;
exports.default = async () => {
    return webpackRun(config_1.webpackDll()).then(() => webpackRun([
        config_1.webpackServerEntry(),
        ...config_2.existenceClient ? [config_1.webpackClient()] : [],
    ])).then(() => webpackRun(config_1.webpackServer()));
};
