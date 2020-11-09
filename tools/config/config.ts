import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { requireSync } from '../core/fs';
import pkg from '../../package.json';

const factoryConfig = (str: string) => (attr: string) => {
  if (str.indexOf(attr) === -1) return null;
  return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^,\]+\)\[\\s\\S\]*`, 'g'), '$1');
};

const resolve = (base: string) => (_path: string) => path.resolve(base, _path);

const argv = process.argv;
const argvStr = argv.join(',');

const getArvgConfig = factoryConfig(argvStr);


export const baseDir: string = process.cwd();

const baseResolve = resolve(baseDir);
const processPkg = requireSync(`${baseDir}/package.json`);
const babel = `${baseDir}/.babelrc`;
const mergePackage = Object.assign({}, {
  babellrc: pkg.babel,
  browserslist: pkg.browserslist,
}, !processPkg ? {} : {
  ...processPkg,
}, !existsSync(babel) ? {} : {
  babellrc: JSON.parse(readFileSync(babel).toString('utf-8')),
});

export const buildDir = baseResolve('build');

export const srcDir = baseResolve('src');

export const distDir = baseResolve('dist');

export const webpackDir = getArvgConfig('webpackDir');

export const runClient = getArvgConfig('runClient') === 'false' ? false : true;

export const isDebug = !argv.includes('--release');

export const babellrc = mergePackage.babellrc;

export const browserslist = mergePackage.browserslist;
