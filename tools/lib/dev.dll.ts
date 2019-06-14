import { webpackRun } from '../bundle';
import { webpackDevDll } from '../config';

export default async () => {
  const dll = webpackDevDll();
  const isCanDll = Array.isArray(dll.entry) ? !!dll.entry.length : !!Object.keys(dll.entry).length;
  return isCanDll ? webpackRun(dll, dll.stats) : Promise.resolve();
};
