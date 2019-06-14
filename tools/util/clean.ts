import { cleanDir } from '../core/fs';
import { config } from '../config';

const { buildDir, distDir } = config;

export default async () => {
  await cleanDir(buildDir);
  // await cleanDir(distDir);
};
