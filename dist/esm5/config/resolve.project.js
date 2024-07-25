import { __awaiter, __generator, __spreadArray } from "tslib";
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { requireSync } from '../core/fs';
import { getArgv } from './project-argv';
var factoryConfig = function (str) { return function (attr) {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp("[\\s\\S]*".concat(attr, "=([^ ]+)[\\s\\S]*"), 'g'), '$1');
}; };
export var resolve = function (base) { return function () {
    var _path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _path[_i] = arguments[_i];
    }
    return path.resolve.apply(path, __spreadArray([base], _path, true));
}; };
export var baseDir = process.cwd();
export var baseResolve = resolve(baseDir);
var ResolveConfig = /** @class */ (function () {
    function ResolveConfig() {
        this.baseResolve = baseResolve;
        this.getArgvConfig = factoryConfig(getArgv()(process.argv).join(' '));
        this.projectPath = baseResolve(this.getArgvConfig('project') || '.');
    }
    ResolveConfig.prototype.loadProjectConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var projectConfig, projectConfigJs, projectConfigPath, projectFunction_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectConfig = this._projectConfig;
                        if (!!this._projectConfig) return [3 /*break*/, 2];
                        projectConfigJs = this.baseResolve(this.projectPath, 'project.config.js');
                        projectConfigPath = this.baseResolve(this.projectPath, 'project.config.json');
                        return [4 /*yield*/, requireSync(projectConfigJs)];
                    case 1:
                        projectFunction_1 = _a.sent();
                        if (projectFunction_1) {
                            projectConfig = (typeof projectFunction_1 === 'function' ? projectFunction_1 : function () { return projectFunction_1 || {}; })();
                        }
                        if (!projectConfig && existsSync(projectConfigPath)) {
                            projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
                        }
                        this._projectConfig = projectConfig;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    Object.defineProperty(ResolveConfig.prototype, "projectConfig", {
        get: function () {
            return this._projectConfig;
        },
        enumerable: false,
        configurable: true
    });
    return ResolveConfig;
}());
export var resolveProject = new ResolveConfig();
