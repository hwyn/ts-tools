"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveProject = exports.baseResolve = exports.baseDir = exports.resolve = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_2 = require("../core/fs");
var project_argv_1 = require("./project-argv");
var factoryConfig = function (str) { return function (attr) {
    if (str.indexOf(attr) === -1)
        return null;
    return str.replace(new RegExp("[\\s\\S]*".concat(attr, "=([^ ]+)[\\s\\S]*"), 'g'), '$1');
}; };
var resolve = function (base) { return function () {
    var _path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _path[_i] = arguments[_i];
    }
    return path_1.default.resolve.apply(path_1.default, tslib_1.__spreadArray([base], _path, true));
}; };
exports.resolve = resolve;
exports.baseDir = process.cwd();
exports.baseResolve = (0, exports.resolve)(exports.baseDir);
var ResolveConfig = /** @class */ (function () {
    function ResolveConfig() {
        this.baseResolve = exports.baseResolve;
        this.getArgvConfig = factoryConfig((0, project_argv_1.getArgv)()(process.argv).join(' '));
        this.projectPath = (0, exports.baseResolve)(this.getArgvConfig('project') || '.');
    }
    ResolveConfig.prototype.loadProjectConfig = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var projectConfig, projectConfigJs, projectConfigPath, projectFunction_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectConfig = this._projectConfig;
                        if (!!this._projectConfig) return [3 /*break*/, 2];
                        projectConfigJs = this.baseResolve(this.projectPath, 'project.config.js');
                        projectConfigPath = this.baseResolve(this.projectPath, 'project.config.json');
                        return [4 /*yield*/, (0, fs_2.requireSync)(projectConfigJs)];
                    case 1:
                        projectFunction_1 = _a.sent();
                        if (projectFunction_1) {
                            projectConfig = (typeof projectFunction_1 === 'function' ? projectFunction_1 : function () { return projectFunction_1 || {}; })();
                        }
                        if (!projectConfig && (0, fs_1.existsSync)(projectConfigPath)) {
                            projectConfig = JSON.parse((0, fs_1.readFileSync)(projectConfigPath, 'utf-8'));
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
exports.resolveProject = new ResolveConfig();
