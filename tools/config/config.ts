import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { requireSync } from '../core/fs';
import pkg from '../../package.json';
import { isEmpty, merge } from 'lodash';

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

const projectName = path.join(baseDir, 'project.config.json');

interface Project {
  output: string;
  environmental?: object | undefined;
  development?: object;
  production?: object;
}

const defaultProject: Project = {
  output: 'build',
};

class ProjectConfig {
  static _project: ProjectConfig;

  private environmental: string;
  private arvg: string = ``;
  private getArvgConfig = factoryConfig(this.arvg);
  protected config: Project;
  constructor(arvg: string[] = []) {
    this.arvg = argv.join(` `);
  }

  private parseArvg() {
    this.environmental = this.getArvgConfig('--environmental');
  }

  private parseConfig(config: Project) {
    this.config = merge(defaultProject, config);
    const { output , development, production } = this.config;
    this.config.output = baseResolve(output);
  }

  private loadProjectConfig(): Project {
    if (existsSync(projectName)) {
      this.parseConfig(JSON.parse(readFileSync(projectName, 'utf-8')));
    }
    return this.config;
  }

  static get project(): Project {
    if (isEmpty(this._project)) {
      this._project = new ProjectConfig(process.argv);
      this._project.loadProjectConfig();
    }
    return this._project && this._project.config || {} as Project;
  }
}

export const project = ProjectConfig.project;