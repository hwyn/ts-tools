import { __awaiter } from "tslib";
import fs from 'fs';
import { project } from '../config';
import { requireSync, writeFile } from '../core/fs';
import bundle from './bundle';
import clean from './clean';
import run from './run';
const defaultPath = `${project.packagePath}/package.json`;
export default ((buildDir) => () => __awaiter(void 0, void 0, void 0, function* () {
    const pkg = (yield requireSync(fs.existsSync(defaultPath) ? defaultPath : project.packagePath)) || {};
    yield run(clean);
    yield run(bundle);
    yield writeFile(`${buildDir}/package.json`, JSON.stringify({
        private: true,
        scripts: {
            "start": "node server.js",
        },
        dependencies: pkg.dependencies,
    }));
}))(project.outputRoot);
