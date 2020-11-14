import path from 'path';

type FN = (options?: object) => Promise<any>;
const arvg: string[] = process.argv;

function run<T>(fn: FN | any, options?: object): Promise<T> {
  const task: FN = typeof fn.default === 'undefined' ? fn : fn.default;
  return (task as FN)(options) as Promise<T>;
}

if (require.main === module || require.main === module.parent && arvg.length > 2) {
  delete require.cache[__filename];
  const { default: exports } = require(`${path.join(__dirname, arvg.slice(2)[0])}`);
  run(exports);
}

export default run;
