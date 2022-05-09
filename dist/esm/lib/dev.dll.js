import { webpackRunDll } from '../util/bundle';
import { existenceDll } from '../config';
export default async () => {
    return !existenceDll ? Promise.resolve() : webpackRunDll();
};
