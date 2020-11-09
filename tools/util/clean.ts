import { cleanDir } from '../core/fs';
import { buildDir } from '../config';

export default async () => {
  await cleanDir(buildDir);
  // await cleanDir(distDir);
};
