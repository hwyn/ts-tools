import { __awaiter } from "tslib";
import { cleanDir } from '../core/fs';
import { project } from '../config';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    yield cleanDir(project.outputRoot);
});
