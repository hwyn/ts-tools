import { __awaiter } from "tslib";
import webpack from 'webpack';
import { webpackDevServerEntry, existenceServerEntry } from '../config';
import { createCompilationPromise } from './compilation';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    if (!existenceServerEntry) {
        return Promise.resolve();
    }
    const config = webpackDevServerEntry();
    const multiCompiler = webpack(config, (error, stats) => {
        if (error) {
            return console.log(error);
        }
        console.log(stats.toString(config.stats));
    });
    const promise = createCompilationPromise('server-entry', multiCompiler, config);
    multiCompiler.watch({ aggregateTimeout: 300 }, () => { });
    return promise;
});
