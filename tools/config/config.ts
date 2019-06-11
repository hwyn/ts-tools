import path from 'path';
import pkg from '../../package.json';

const isDebug = !process.argv.includes('--release');
const baseDir: string = process.cwd();
const resolve = (base: string) => (_path: string) => path.resolve(base, _path);
const baseResolve = resolve(baseDir);

export default {
  baseDir,
  isDebug,
  srcDir: baseResolve('src'),
  buildDir: baseResolve('build'),
  distDir: baseResolve('dist'),
  babellrc: pkg.babel,
  browserslist: pkg.browserslist,
};
