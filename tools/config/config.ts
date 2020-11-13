import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { requireSync } from '../core/fs';
import pkg from '../../package.json';
import { isEmpty } from 'lodash';

const factoryConfig = (str: string) => (attr: string) => {
  if (str.indexOf(attr) === -1) return null;
  return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^,\]+\)\[\\s\\S\]*`, 'g'), '$1');
};

const resolve = (base: string) => (_path: string) => path.resolve(base, _path);

const argv = process.argv;
const argvStr = argv.join(',');

const getArvgConfig = factoryConfig(argvStr);

const baseDir: string = process.cwd();
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

export {
  baseDir
}

const projectName = path.join(baseDir, 'project.json');

export class ProjectConfig {
  static _project: ProjectConfig;
  static arvg: string[] = [];
  static load = (arvg: string[]) => ProjectConfig.arvg = argv;

  protected config: object;
  constructor(private arvg: string[]) { }

  private loadProjectConfig() {
    if (existsSync(projectName)) {
      this.config = JSON.parse(readFileSync(projectName, 'utf-8'));
    }
    return this.config;
  }

  static get project(): object {
    if (!isEmpty(this._project)) {
      this._project = new ProjectConfig(this.arvg);
      this._project.loadProjectConfig();
    }
    return this._project && this._project.config || {};
  }
}

export const config = ProjectConfig.project;