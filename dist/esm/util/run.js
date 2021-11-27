import path from 'path';
const arvg = process.argv;
function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
if (require.main === module || require.main === module.parent && arvg.length > 2) {
    delete require.cache[__filename];
    const { default: exports } = require(`${path.join(__dirname, arvg.slice(2)[0])}`);
    run(exports);
}
export default run;
