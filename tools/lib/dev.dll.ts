import { webpackRun } from '../util/bundle';
import { webpackDevDll } from '../config';

export default async () => {
  const dll = webpackDevDll();
  return webpackRun(dll, dll.stats);
};
