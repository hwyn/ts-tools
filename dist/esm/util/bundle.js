import { __awaiter } from "tslib";
import { isEmpty } from 'lodash';
import webpack from 'webpack';
import { existenceClient, existenceDll, existenceServer, existenceServerEntry, platformConfig, PlatformEnum, webpackClient, webpackDll, webpackServer, webpackServerEntry } from '../config';
export const isRun = (webpackconfig) => {
    return !isEmpty(webpackconfig.entry);
};
export function webpackRun(webpackconfig, _stast) {
    if (Array.isArray(webpackconfig)) {
        return Promise.all(webpackconfig.map((config) => webpackRun(config, config.stats)));
    }
    return new Promise((resolve, reject) => {
        if (!isRun(webpackconfig)) {
            return resolve(null);
        }
        const multiCompiler = webpack(webpackconfig);
        multiCompiler.run((err, stats) => {
            if (err) {
                return reject();
            }
            console.info(stats.toString(webpackconfig.stats || _stast));
            resolve(null);
        });
    });
}
export function webpackRunDll() {
    const { entry } = platformConfig(PlatformEnum.dll);
    return Object.keys(entry).reduce((promise, key) => promise
        .then(() => webpackDll(key))
        .then((dll) => webpackRun(dll, dll.stats)), Promise.resolve());
}
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return (existenceDll ? webpackRunDll() : Promise.resolve()).then(() => Promise.all([
        ...existenceServerEntry ? [webpackServerEntry()] : [],
        ...existenceClient ? [webpackClient()] : [],
    ]))
        .then((result) => webpackRun(result))
        .then(() => Promise.all([...existenceServer ? [webpackServer()] : []]))
        .then((result) => webpackRun(result));
});
