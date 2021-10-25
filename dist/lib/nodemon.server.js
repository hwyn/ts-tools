"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tree_kill_1 = tslib_1.__importDefault(require("tree-kill"));
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const child_process_1 = require("child_process");
const config_1 = require("../config");
const config_2 = require("../config");
const { entry, watchFile, root, tsConfig } = config_1.platformConfig('server');
const entryFile = entry;
let host = `localhost:${process.env.PORT || 3000}`;
let clearNodemon = () => Promise.resolve();
const delay = (timer, callback) => {
    let _delay = null;
    const clearDely = () => _delay = null;
    return () => !_delay && (_delay = setTimeout(() => callback().then(clearDely).catch(clearDely), timer));
};
const stdioPipe = (cp, pro) => {
    const stdio = (fnName) => (callback) => cp[fnName].on('data', (data) => pro[fnName].write(callback ? callback(data) || data : data));
    return {
        stdout: stdio('stdout'),
        stderr: stdio('stderr'),
    };
};
const getSpawnArgs = () => {
    const platform = process.platform;
    const spawnArgs = [];
    let spawnFlags = [];
    const spawnOptions = {
        env: { ...process.env, PATH: `${root}/node_modules/.bin:${process.env.PATH}` }
    };
    if (platform === 'win32') {
        spawnArgs.push(process.env.ComSpec || 'cmd.exe');
        spawnFlags = ['/d', '/s', '/c'];
        spawnOptions.windowsVerbatimArguments = true;
    }
    else {
        spawnArgs.push('sh');
        spawnFlags.push('-c');
    }
    spawnFlags.push(`ts-node --project ${tsConfig} -r tsconfig-paths/register ${entryFile}`);
    spawnArgs.push(spawnFlags);
    spawnArgs.push(spawnOptions);
    process.env.TS_NODE_PROJECT = tsConfig;
    return spawnArgs;
};
function startServer() {
    const cp = child_process_1.spawn.apply(null, getSpawnArgs());
    const killCp = () => {
        _stdion = null;
        return new Promise((resolve, reject) => {
            tree_kill_1.default(cp.pid, 'SIGKILL', (err) => err ? reject(err) : resolve(null));
        });
    };
    let _stdion = stdioPipe(cp, process);
    return new Promise((_resolve, _reject) => {
        let count = 0;
        _stdion.stderr(() => _reject(killCp));
        if (!config_2.existenceClient) {
            _resolve(killCp);
        }
        _stdion.stdout((data) => {
            if (config_2.existenceClient) {
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
async function runNodemon() {
    let nodemonExa;
    const watch = chokidar_1.default.watch(Array.isArray(watchFile) ? watchFile : [watchFile], {});
    const finallServer = () => startServer().then((exa) => exa && (nodemonExa = exa)).catch((exa) => exa && (nodemonExa = exa));
    const watchClose = () => watch.close();
    try {
        nodemonExa = await startServer();
    }
    catch (e) {
        nodemonExa = e;
    }
    finally {
        watch.on('change', delay(100, () => {
            console.log(`server reset run......`);
            return nodemonExa().then(finallServer).catch(finallServer);
        }));
    }
    return () => nodemonExa().then(watchClose).catch(watchClose);
}
process.on('SIGINT', () => process.exit(1));
process.on('exit', () => clearNodemon());
exports.default = () => clearNodemon().then(runNodemon).then((clear) => clearNodemon = clear).then(() => {
    if (host) {
        return host;
    }
    throw new Error(`server run fail`);
});
