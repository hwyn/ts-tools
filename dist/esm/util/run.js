import { __awaiter } from "tslib";
import path from 'path';
const arvg = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
export function init() {
    return __awaiter(this, void 0, void 0, function* () {
        if (arvg.length > 2) {
            const { default: exports } = require(`${path.join(__dirname, arvg.slice(2)[0])}`);
            yield run(exports);
        }
    });
}
export default run;
