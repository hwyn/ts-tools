import { config } from '../config';
import { writeFile } from '../core/fs';
import pkg from '../../package.json';
import clean from './clean';
import bundle from './bundle';
import run from './run';

export default ((pkg: any, buildDir) => async () => {
  await run(clean);
  await run(bundle);
  await writeFile(`${buildDir}/package.json`, JSON.stringify({
    private: true,
    scripts: {
      "start": "node server/index.js",
    },
    dependencies: pkg.dependencies,
  }));
})(pkg, config.buildDir);
