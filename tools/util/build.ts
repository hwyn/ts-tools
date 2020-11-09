import { baseDir, buildDir } from '../config';
import { writeFile, requireSync } from '../core/fs';
import clean from './clean';
import bundle from './bundle';
import run from './run';

const pkg = requireSync(`${baseDir}/package.json`);

export default ((pkg: any, buildDir) => async () => {
  await run(clean);
  await run(bundle);
  await writeFile(`${buildDir}/package.json`, JSON.stringify({
    private: true,
    scripts: {
      "start": "node server.js",
    },
    dependencies: pkg.dependencies,
  }));
})(pkg, buildDir);
