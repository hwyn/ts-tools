import { __awaiter, __generator } from "tslib";
import { project } from '../config';
import { writeFile, requireSync } from '../core/fs';
import clean from './clean';
import bundle from './bundle';
import run from './run';
import fs from 'fs';
var defaultPath = "".concat(project.packagePath, "/package.json");
var pkg = requireSync(fs.existsSync(defaultPath) ? defaultPath : project.packagePath);
export default (function (pkg, buildDir) { return function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run(clean)];
            case 1:
                _a.sent();
                return [4 /*yield*/, run(bundle)];
            case 2:
                _a.sent();
                return [4 /*yield*/, writeFile("".concat(buildDir, "/package.json"), JSON.stringify({
                        private: true,
                        scripts: {
                            "start": "node server.js",
                        },
                        dependencies: pkg.dependencies,
                    }))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; })(pkg || {}, project.outputRoot);
