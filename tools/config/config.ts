import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { isEmpty, merge } from 'lodash';

const factoryConfig = (str: string) => (attr: string) => {
  if (str.indexOf(attr) === -1) return null;
  return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^ \]+\)\[\\s\\S\]*`, 'g'), '$1');
};

const resolve = (base: string) => (..._path: string[]) => path.resolve(...[base, ..._path]);
const toArray = (obj: any) => Array.isArray(obj) ? obj : obj && [obj] || [];

const baseDir: string = process.cwd();
const baseResolve = resolve(baseDir);
const projectPath = baseResolve('project.config.json');
const babel = baseResolve('.babelrc');

export enum PlatformEnum {
  client = 'client',
  server = 'server',
  dll = 'dll',
  serverEntry = 'server-entry'
}

interface buildOptions {
  index?: string;
  main?: string | string[];
  sourceMap?: string;
  assets?: string[];
  styles: string[];
  tsConfig?: string;
  outputPath: string;
  sourceClient?: string;
  sourceServer?: string;
}

interface Configurations {
  browserTarget?: [],
  nodeExternals?: boolean;
  sourceMap?: boolean;
  watchFile?: string[];
}

interface Platform {
  [key: string]: {
    builder: string;
    options: buildOptions;
    configurations?: Configurations;
  };
}

interface Build {
  platform: Platform;
  options: buildOptions;
  configurations?: Configurations;
}

interface Project {
  root: string;
  sourceRoot: string;
  outputRoot: string;
  nodeModules: string;
  isDevelopment: boolean;
  architect: {
    build: Build;
    [key: string]: Build;
  };
}

const defaultProject: Project = {
  root: '.',
  sourceRoot: 'src',
  outputRoot: 'dist',
  nodeModules: baseResolve('node_modules'),
  isDevelopment: false,
  architect: {
    build: {
      platform: {},
      options: {
        outputPath: 'dist/assets',
        assets: [],
        styles: []
      },
    }
  }
};

class ProjectConfig {
  static _project: ProjectConfig;

  private isDevelopment: boolean = false;
  private environmental: string;
  private arvg: string = ``;
  private getArvgConfig = factoryConfig(this.arvg);
  private baseResolve = resolve(process.cwd());
  private rootResolve: (...path: string[]) => string;
  protected config: Project;
  constructor(arvg: string[] = []) {
    const [command] = arvg.slice(2);
    this.arvg = arvg.join(` `);
    this.environmental = command === 'start' ? 'development' : 'build';
    this.parseArvg();
  }

  private parseArvg() {
    this.environmental = this.getArvgConfig('--environmental') || this.environmental;
    this.isDevelopment = !!this.getArvgConfig('--prod');
  }

  private parseConfig(config: Project) {
    this.config = merge({}, defaultProject, config);
    const {
      root,
      sourceRoot,
      outputRoot,
      architect
    } = this.config;

    const environmentalBuild = merge({}, architect.build, architect[this.environmental]);

    this.rootResolve = resolve(this.baseResolve(root));
    this.config.isDevelopment = this.isDevelopment;
    this.config.sourceRoot = this.rootResolve(sourceRoot);
    this.config.outputRoot = this.rootResolve(outputRoot),
    this.config.root = this.baseResolve(root);
    architect.build = this.parseBuild(sourceRoot, environmentalBuild);
  }

  private parseBuild(sourceRoot: string, build: Build): Build {
    const { platform, options, configurations } = build;
    build.platform = Object.keys(platform).reduce((obj, p) => {
      const current = platform[p];
      current.options = merge({}, options, current.options);
      current.configurations = merge({}, configurations, current.configurations);

      const { options: pOptions, configurations: pConfigurations, builder } = current;
      const { main, styles, index, outputPath, assets, tsConfig, sourceClient, sourceServer } = pOptions;
      const { watchFile } = current.configurations;

      !!builder && (current.builder = this.rootResolve(current.builder));
      !!index && (pOptions.index = this.rootResolve(index));
      !!tsConfig && (pOptions.tsConfig = this.rootResolve(tsConfig));
      !!outputPath && (pOptions.outputPath = this.rootResolve(outputPath));
      !!sourceClient && (pOptions.sourceClient = this.rootResolve(sourceRoot, sourceClient));
      !!sourceServer && (pOptions.sourceServer = this.rootResolve(sourceRoot, sourceServer));

      if (p !== PlatformEnum.dll) {
        pOptions.main = toArray(main).map((f) => this.rootResolve(f));
      }
      pOptions.assets = toArray(assets).map((f) => this.rootResolve(f));
      pOptions.styles = toArray(styles).map((f) => this.rootResolve(f));
      pConfigurations.watchFile = toArray(watchFile).map((f) => this.rootResolve(f));
      return { ...obj, [p]: current };
    }, {});
    !!options.outputPath && (options.outputPath = this.rootResolve(options.outputPath));
    return build;
  }

  private loadProjectConfig(): Project {
    if (existsSync(projectPath)) {
      this.parseConfig(JSON.parse(readFileSync(projectPath, 'utf-8')));
    }
    return this.config;
  }

  static get existenceClient(): boolean {
    const { architect: { build: { platform } } } = this.project;
    return !isEmpty(platform.client);
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

export const existenceClient = ProjectConfig.existenceClient;

export const babellrc = existsSync(babel) && JSON.parse(readFileSync(babel).toString('utf-8')) || {};

export const platformConfig = (key?: string) => {
  const { root, isDevelopment, sourceRoot, outputRoot, nodeModules } = project;
  const { architect: { build: { platform } } } = project;
  const { options, configurations, builder } = platform[key] || {};
  const { index, main, styles, assets, sourceMap, outputPath, tsConfig, sourceClient, sourceServer } = options || {};
  const { nodeExternals, browserTarget, watchFile, sourceMap: hasSourceMap } = configurations || {};

  return {
    root,
    index,
    main,
    styles,
    assets,
    builder,
    tsConfig,
    outputPath,
    browserTarget,
    nodeExternals,
    sourceRoot,
    outputRoot,
    sourceClient,
    sourceServer,
    nodeModules,
    watchFile,
    sourceMap,
    hasSourceMap,
    isDevelopment
  };
}

export { baseDir }
