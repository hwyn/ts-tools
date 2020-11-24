import { cleanDir } from '../core/fs';
import { project } from '../config';


export default async () => {
  await cleanDir( project.outputRoot);
};
