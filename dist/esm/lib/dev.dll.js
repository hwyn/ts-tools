import { webpackRun } from '../util/bundle';
import { webpackDll, existenceDll } from '../config';
export default async () => {
    if (!existenceDll) {
        return Promise.resolve();
    }
    const dll = webpackDll();
    return webpackRun(dll, dll.stats);
};
