export function format(time) {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
export function createCompilationPromise(name, compiler, config) {
    return new Promise((resolve, reject) => {
        let timeStart = new Date();
        compiler.hooks.beforeCompile.tap(name, () => {
            timeStart = new Date();
            console.info(`[${format(timeStart)}] Compiling '${name}'...`);
        });
        compiler.hooks.afterDone.tap(name, (stats) => {
            const timeEnd = new Date();
            const time = timeEnd.getTime() - timeStart.getTime();
            if (stats.hasErrors()) {
                console.info(`[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`);
                reject(new Error('Compilation failed!'));
            }
            else {
                resolve(stats);
                // console.info(`[${format(timeEnd, )}] Finished '${name}' compilation after ${time} ms`);
            }
        });
    });
}
