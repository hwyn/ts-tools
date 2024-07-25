import { __awaiter } from "tslib";
import path from 'path';
import { resolveProject } from '../config/resolve.project';
const argv = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
export function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield resolveProject.loadProjectConfig();
        if (argv.length > 2) {
            const { default: exports } = require(`${path.join(__dirname, argv.slice(2)[0])}`);
            yield run(exports);
        }
    });
}
export default run;
