import path from 'path';
const arvg = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
export async function init() {
    if (arvg.length > 2) {
        const { default: exports } = require(`${path.join(__dirname, arvg.slice(2)[0])}`);
        await run(exports);
    }
}
export default run;
