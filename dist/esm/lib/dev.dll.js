import { webpackRun } from '../util/bundle';
import { webpackDevDll, existenceDll } from '../config';
export default async () => {
    if (!existenceDll) {
        return Promise.resolve();
    }
    const dll = webpackDevDll();
    return webpackRun(dll, dll.stats);
};
