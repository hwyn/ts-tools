import { __awaiter } from "tslib";
import { project } from '../config';
import { cleanDir } from '../core/fs';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    yield cleanDir(project.outputRoot);
});
