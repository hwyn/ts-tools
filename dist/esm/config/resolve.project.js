import { __awaiter } from "tslib";
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { requireSync } from '../core/fs';
import { getArgv } from './project-argv';
const factoryConfig = (str) => (attr) => {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp(`\[\\s\\S\]*${attr}=\(\[^ \]+\)\[\\s\\S\]*`, 'g'), '$1');
};
export const resolve = (base) => (..._path) => path.resolve(...[base, ..._path]);
export const baseDir = process.cwd();
export const baseResolve = resolve(baseDir);
class ResolveConfig {
    constructor() {
        this.baseResolve = baseResolve;
        this.getArgvConfig = factoryConfig(getArgv()(process.argv).join(' '));
        this.projectPath = baseResolve(this.getArgvConfig('project') || '.');
    }
    loadProjectConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let projectConfig = this._projectConfig;
            if (!this._projectConfig) {
                const projectConfigJs = this.baseResolve(this.projectPath, 'project.config.js');
                const projectConfigPath = this.baseResolve(this.projectPath, 'project.config.json');
                const projectFunction = yield requireSync(projectConfigJs);
                if (projectFunction) {
                    projectConfig = (typeof projectFunction === 'function' ? projectFunction : () => projectFunction || {})();
                }
                if (!projectConfig && existsSync(projectConfigPath)) {
                    projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
                }
                this._projectConfig = projectConfig;
            }
            return this;
        });
    }
    get projectConfig() {
        return this._projectConfig;
    }
}
export const resolveProject = new ResolveConfig();
