import { __awaiter, __generator } from "tslib";
import webpack from 'webpack';
import { existenceServerEntry, webpackDevServerEntry } from '../config';
import { createCompilationPromise } from './compilation';
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, multiCompiler, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!existenceServerEntry) {
                    return [2 /*return*/, Promise.resolve()];
                }
                return [4 /*yield*/, webpackDevServerEntry()];
            case 1:
                config = _a.sent();
                multiCompiler = webpack(config, function (error, stats) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log(stats.toString(config.stats));
                });
                promise = createCompilationPromise('server-entry', multiCompiler, config);
                multiCompiler.watch({ aggregateTimeout: 300 }, function () { });
                return [2 /*return*/, promise];
        }
    });
}); });
