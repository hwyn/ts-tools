import path from 'path';
import { requireSync } from '../core/fs';
import pkg from '../../package.json';

const isDebug = !process.argv.includes('--release');
const baseDir: string = process.cwd();
const resolve = (base: string) => (_path: string) => path.resolve(base, _path);
const baseResolve = resolve(baseDir);
const processPkg = requireSync(`${baseDir}/package.json`);
let mergePackage = Object.assign({}, {
  babellrc: pkg.babel,
  browserslist: pkg.browserslist,
}, processPkg ? {
  babellrc: processPkg.babel,
  browserslist: processPkg.browserslist,
} : {});

export default {
  baseDir,
  isDebug,
  srcDir: baseResolve('src'),
  buildDir: baseResolve('build'),
  distDir: baseResolve('dist'),
  babellrc: mergePackage.babellrc,
  browserslist: mergePackage.browserslist,
};
