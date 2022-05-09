"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const arvg = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
if (require.main === module || require.main === module.parent && arvg.length > 2) {
    delete require.cache[__filename];
    const { default: exports } = require(`${path_1.default.join(__dirname, arvg.slice(2)[0])}`);
    run(exports);
}
exports.default = run;
