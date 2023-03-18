"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const arvg = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
async function init() {
    if (arvg.length > 2) {
        const { default: exports } = require(`${path_1.default.join(__dirname, arvg.slice(2)[0])}`);
        await run(exports);
    }
}
exports.init = init;
exports.default = run;
