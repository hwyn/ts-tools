import { __awaiter } from "tslib";
import { project } from '../config';
import { writeFile, requireSync } from '../core/fs';
import clean from './clean';
import bundle from './bundle';
import run from './run';
import fs from 'fs';
const defaultPath = `${project.packagePath}/package.json`;
const pkg = requireSync(fs.existsSync(defaultPath) ? defaultPath : project.packagePath);
export default ((pkg, buildDir) => () => __awaiter(void 0, void 0, void 0, function* () {
    yield run(clean);
    yield run(bundle);
    yield writeFile(`${buildDir}/package.json`, JSON.stringify({
        private: true,
        scripts: {
            "start": "node server.js",
        },
        dependencies: pkg.dependencies,
    }));
}))(pkg || {}, project.outputRoot);
