import { __awaiter, __generator } from "tslib";
import fs from 'fs';
import { project } from '../config';
import { requireSync, writeFile } from '../core/fs';
import bundle from './bundle';
import clean from './clean';
import run from './run';
var defaultPath = "".concat(project.packagePath, "/package.json");
export default (function (buildDir) { return function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireSync(fs.existsSync(defaultPath) ? defaultPath : project.packagePath)];
            case 1:
                pkg = (_a.sent()) || {};
                return [4 /*yield*/, run(clean)];
            case 2:
                _a.sent();
                return [4 /*yield*/, run(bundle)];
            case 3:
                _a.sent();
                return [4 /*yield*/, writeFile("".concat(buildDir, "/package.json"), JSON.stringify({
                        private: true,
                        scripts: {
                            "start": "node server.js",
                        },
                        dependencies: pkg.dependencies,
                    }))];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; })(project.outputRoot);
