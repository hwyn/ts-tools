import { cleanDir } from '../core/fs';
import { platformConfig, PlatformEnum } from '../config';

const outputPath = platformConfig(PlatformEnum.server).outputPath || platformConfig(PlatformEnum.client).outputPath;

export default async () => {
  await cleanDir(outputPath);
};
