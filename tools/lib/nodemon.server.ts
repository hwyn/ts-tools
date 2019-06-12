import path from 'path';
import kill from 'tree-kill';
import chokidar from 'chokidar';
import { spawn } from 'child_process';
import { config } from '../config';

const { baseDir, srcDir } = config;
let host: number | string = 'localhost:3000';
let clearNodemon: any = () => Promise.resolve();
const delay = (timer: number, callback: any): any => {
  let _delay: any = null;
  return () => !_delay && (_delay = setTimeout(() => callback().then(() => {
    _delay = null;
  }), timer));
}

const stdioPipe = (cp: any, pro: any): any => {
  const stdio = (fnName: string) => (callback?: any) =>
    cp[fnName].on('data', (data: Buffer) =>
      pro[fnName].write(callback ? callback(data) || data : data)
    );

  return {
    stdout: stdio('stdout'),
    stderr: stdio('stderr'),
  };
};

function startServer(): Promise<any> {
  const cp = spawn('sh', ['-c', 'babel-node src/server/index.ts --extensions \'.ts,.tsx\''], {
    env: Object.assign({}, process.env, {
      PATH: `${baseDir}/node_modules/.bin:${process.env.PATH}`
    }),
  });
  const killCp = (): Promise<any> => {
    _stdion = null;
    return new Promise((resolve, reject) => {
      kill(cp.pid, (err) => err ? reject(err) : resolve());
    });
  }
  let _stdion: any = stdioPipe(cp, process);;
  _stdion.stderr();
  return new Promise((_resolve) => 
    _stdion.stdout((data: Buffer) => {
      const match = data.toString('utf-8').match(/http:\/\/(.*?)\//);
      if (match && match[1]) {
        host = match[1];
        _resolve(killCp);
      }
    })
  );
}

async function runNodemon(): Promise<any> {
  let nodemonExa = await startServer();
  const watch = chokidar.watch([path.join(srcDir, 'server/index.ts')], {});
  watch.on('change', delay(100, () => nodemonExa()
    .then(startServer)
    .then((exa: any) => exa && (nodemonExa = exa))));
  return async ():Promise<any> => nodemonExa().then(() => {
    watch.close();
  });
}

process.on('exit', () => clearNodemon());

export default async (app?: any) => clearNodemon().then(() => clearNodemon = runNodemon()).then(() => host);
