import { isEmpty } from 'lodash';
import webpack from 'webpack';
import { webpackServer, webpackClient, webpackDll, webpackServerEntry, platformConfig, PlatformEnum } from '../config';
import { existenceClient, existenceDll, existenceServer, existenceServerEntry } from '../config';
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
    return Object.keys(entry).reduce((promise, key) => promise.then(() => {
        const dll = webpackDll(key);
        return webpackRun(dll, dll.stats);
    }), Promise.resolve());
}
export default async () => {
    return (existenceDll ? webpackRunDll() : Promise.resolve()).then(() => webpackRun([
        ...existenceServerEntry ? [webpackServerEntry()] : [],
        ...existenceClient ? [webpackClient()] : [],
    ])).then(() => webpackRun([...existenceServer ? [webpackServer()] : []]));
};
