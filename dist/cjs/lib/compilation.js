"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
exports.createCompilationPromise = createCompilationPromise;
function format(time) {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
function createCompilationPromise(name, compiler, config) {
    return new Promise(function (resolve, reject) {
        var timeStart = new Date();
        compiler.hooks.beforeCompile.tap(name, function () {
            timeStart = new Date();
            console.info("[".concat(format(timeStart), "] Compiling '").concat(name, "'..."));
        });
        compiler.hooks.afterDone.tap(name, function (stats) {
            var timeEnd = new Date();
            var time = timeEnd.getTime() - timeStart.getTime();
            if (stats.hasErrors()) {
                console.info("[".concat(format(timeEnd), "] Failed to compile '").concat(name, "' after ").concat(time, " ms"));
                reject(new Error('Compilation failed!'));
            }
            else {
                resolve(stats);
                // console.info(`[${format(timeEnd, )}] Finished '${name}' compilation after ${time} ms`);
            }
        });
    });
}
