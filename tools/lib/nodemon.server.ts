import kill from 'tree-kill';
import chokidar from 'chokidar';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { platformConfig } from '../config';
import { existenceClient } from '../config';

const { main, watchFile, root, tsConfig } = platformConfig('server');
const entryFile = main;

let host: number | string = `localhost:${process.env.PORT || 3000}`;
let clearNodemon: any = () => Promise.resolve();
const delay = (timer: number, callback: any): any => {
  let _delay: any = null;
  const clearDely = (): any => _delay = null;
  return () => !_delay && (_delay = setTimeout(() => callback().then(clearDely).catch(clearDely), timer));
};

const stdioPipe = (cp: any, pro: any): any => {
  const stdio = (fnName: string) => (callback?: any) =>
    cp[fnName].on('data', (data: Buffer) => pro[fnName].write(callback ? callback(data) || data : data));

  return {
    stdout: stdio('stdout'),
    stderr: stdio('stderr'),
  };
};

const getSpawnArgs = () => {
  const platform = process.platform;
  const spawnArgs = [];
  let spawnFlags = [];
  const spawnOptions: SpawnOptionsWithoutStdio = {
    env: { ...process.env, PATH: `${root}/node_modules/.bin:${process.env.PATH}` }
  };
  if (platform === 'win32') {
    spawnArgs.push(process.env.ComSpec || 'cmd.exe');
    spawnFlags = ['/d', '/s', '/c'];
    spawnOptions.windowsVerbatimArguments = true;
  } else {
    spawnArgs.push('sh');
    spawnFlags.push('-c');
  }

  spawnFlags.push(`ts-node --project ${tsConfig} -r tsconfig-paths/register ${entryFile}`);
  spawnArgs.push(spawnFlags);
  spawnArgs.push(spawnOptions);
  process.env.TS_NODE_PROJECT = tsConfig;
  return spawnArgs;
};

function startServer(): Promise<any> {
  const cp = spawn.apply(null, getSpawnArgs());
  const killCp = (): Promise<any> => {
    _stdion = null;
    return new Promise((resolve, reject) => {
      kill(cp.pid, 'SIGKILL', (err) => err ? reject(err) : resolve());
    });
  };
  let _stdion: any = stdioPipe(cp, process);
  return new Promise((_resolve, _reject) => {
    let count = 0;
    _stdion.stderr(() => _reject(killCp));
    if (!existenceClient) {
      _resolve(killCp);
    }
    _stdion.stdout((data: Buffer) => {
      if (existenceClient) {
        const match = data.toString('utf-8').match(/(http|tcp|udp):\/\/(.*?)\//);
        if (match && match[2] && count === 0) {
          host = match[2];
          _resolve(killCp);
          count++;
        }
      }
    });
  });
}

async function runNodemon(): Promise<any> {
  let nodemonExa: any;
  const watch = chokidar.watch(Array.isArray(watchFile) ? watchFile : [watchFile], {});
  const finallServer = () => startServer().then((exa: any) => exa && (nodemonExa = exa)).catch((exa: any) => exa && (nodemonExa = exa));
  const watchClose = () => watch.close();
  try {
    nodemonExa = await startServer();
  } catch (e) {
    nodemonExa = e;
  } finally {
    watch.on('change', delay(100, () => {
      console.log(`server reset run......`);
      return nodemonExa().then(finallServer).catch(finallServer);
    }));
  }
  return (): Promise<any> => nodemonExa().then(watchClose).catch(watchClose);
}

process.on('SIGINT', () => process.exit(1));
process.on('exit', () => clearNodemon());

export default () => clearNodemon().then(runNodemon).then((clear: any) => clearNodemon = clear).then(() => {
  if (host) {
    return host;
  }
  throw new Error(`server run fail`)
});
