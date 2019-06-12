"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = require("./config");
var _fs = require("./core/fs");
var _package = _interopRequireDefault(require("../package.json"));
var _clean = _interopRequireDefault(require("./clean"));
var _bundle = _interopRequireDefault(require("./bundle"));
var _run = _interopRequireDefault(require("./run"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

((pkg, buildDir) => async () => {
  await (0, _run.default)(_clean.default);
  await (0, _run.default)(_bundle.default);
  await (0, _fs.writeFile)(`${buildDir}/package.json`, JSON.stringify({
    private: true,
    scripts: {
      "start": "node server.js" },

    dependencies: pkg.dependencies }));

})(_package.default, _config.config.buildDir);exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Rvb2xzL2J1aWxkLnRzIl0sIm5hbWVzIjpbInBrZyIsImJ1aWxkRGlyIiwiY2xlYW4iLCJidW5kbGUiLCJKU09OIiwic3RyaW5naWZ5IiwicHJpdmF0ZSIsInNjcmlwdHMiLCJkZXBlbmRlbmNpZXMiLCJjb25maWciXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0Q7O0FBRWUsQ0FBQyxDQUFDQSxHQUFELEVBQVdDLFFBQVgsS0FBd0IsWUFBWTtBQUNsRCxRQUFNLGtCQUFJQyxjQUFKLENBQU47QUFDQSxRQUFNLGtCQUFJQyxlQUFKLENBQU47QUFDQSxRQUFNLG1CQUFXLEdBQUVGLFFBQVMsZUFBdEIsRUFBc0NHLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQ3pEQyxJQUFBQSxPQUFPLEVBQUUsSUFEZ0Q7QUFFekRDLElBQUFBLE9BQU8sRUFBRTtBQUNQLGVBQVMsZ0JBREYsRUFGZ0Q7O0FBS3pEQyxJQUFBQSxZQUFZLEVBQUVSLEdBQUcsQ0FBQ1EsWUFMdUMsRUFBZixDQUF0QyxDQUFOOztBQU9ELENBVmMsRUFVWlIsZ0JBVlksRUFVUFMsZUFBT1IsUUFWQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgd3JpdGVGaWxlIH0gZnJvbSAnLi9jb3JlL2ZzJztcbmltcG9ydCBwa2cgZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCBjbGVhbiBmcm9tICcuL2NsZWFuJztcbmltcG9ydCBidW5kbGUgZnJvbSAnLi9idW5kbGUnO1xuaW1wb3J0IHJ1biBmcm9tICcuL3J1bic7XG5cbmV4cG9ydCBkZWZhdWx0ICgocGtnOiBhbnksIGJ1aWxkRGlyKSA9PiBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IHJ1bihjbGVhbik7XG4gIGF3YWl0IHJ1bihidW5kbGUpO1xuICBhd2FpdCB3cml0ZUZpbGUoYCR7YnVpbGREaXJ9L3BhY2thZ2UuanNvbmAsIEpTT04uc3RyaW5naWZ5KHtcbiAgICBwcml2YXRlOiB0cnVlLFxuICAgIHNjcmlwdHM6IHtcbiAgICAgIFwic3RhcnRcIjogXCJub2RlIHNlcnZlci5qc1wiLFxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiBwa2cuZGVwZW5kZW5jaWVzLFxuICB9KSk7XG59KShwa2csIGNvbmZpZy5idWlsZERpcik7XG4iXX0=