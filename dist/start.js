"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _browserSync = _interopRequireDefault(require("browser-sync"));
var _config = require("./config");
var _clean = _interopRequireDefault(require("./clean"));
var _dev = _interopRequireDefault(require("./lib/dev.server"));
var _dev2 = _interopRequireDefault(require("./lib/dev.client"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { buildDir } = _config.config;
const app = (0, _express.default)();var _default =
async () => {
  app.use(_express.default.static(_path.default.join(buildDir, 'public')));
  await (0, _clean.default)();
  await (0, _dev2.default)(app);
  const host = await (0, _dev.default)(app);
  return new Promise((resolve, reject) => {
    _browserSync.default.create().init({
      ui: false,
      proxy: {
        target: host,
        middleware: app } },

    (error, bs) => error ? reject(error) : resolve(bs));
  });
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Rvb2xzL3N0YXJ0LnRzIl0sIm5hbWVzIjpbImJ1aWxkRGlyIiwiY29uZmlnIiwiYXBwIiwidXNlIiwiZXhwcmVzcyIsInN0YXRpYyIsInBhdGgiLCJqb2luIiwiaG9zdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYnJvd3NlclN5bmMiLCJjcmVhdGUiLCJpbml0IiwidWkiLCJwcm94eSIsInRhcmdldCIsIm1pZGRsZXdhcmUiLCJlcnJvciIsImJzIl0sIm1hcHBpbmdzIjoib0dBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0U7O0FBRUEsTUFBTSxFQUFFQSxRQUFGLEtBQWVDLGNBQXJCO0FBQ0EsTUFBTUMsR0FBRyxHQUFHLHVCQUFaLEM7QUFDZSxZQUEwQjtBQUN2Q0EsRUFBQUEsR0FBRyxDQUFDQyxHQUFKLENBQVFDLGlCQUFRQyxNQUFSLENBQWVDLGNBQUtDLElBQUwsQ0FBVVAsUUFBVixFQUFvQixRQUFwQixDQUFmLENBQVI7QUFDQSxRQUFNLHFCQUFOO0FBQ0EsUUFBTSxtQkFBYUUsR0FBYixDQUFOO0FBQ0EsUUFBTU0sSUFBSSxHQUFHLE1BQU0sa0JBQWFOLEdBQWIsQ0FBbkI7QUFDQSxTQUFPLElBQUlPLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdENDLHlCQUFZQyxNQUFaLEdBQXFCQyxJQUFyQixDQUEwQjtBQUN4QkMsTUFBQUEsRUFBRSxFQUFFLEtBRG9CO0FBRXhCQyxNQUFBQSxLQUFLLEVBQUU7QUFDTEMsUUFBQUEsTUFBTSxFQUFFVCxJQURIO0FBRUxVLFFBQUFBLFVBQVUsRUFBRWhCLEdBRlAsRUFGaUIsRUFBMUI7O0FBTUcsS0FBQ2lCLEtBQUQsRUFBUUMsRUFBUixLQUFlRCxLQUFLLEdBQUdSLE1BQU0sQ0FBQ1EsS0FBRCxDQUFULEdBQWtCVCxPQUFPLENBQUNVLEVBQUQsQ0FOaEQ7QUFPRCxHQVJNLENBQVA7QUFTRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBicm93c2VyU3luYyBmcm9tICdicm93c2VyLXN5bmMnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGNsZWFuRGlyIGZyb20gJy4vY2xlYW4nO1xuaW1wb3J0IHNlcnZlckhvdERldiBmcm9tICAnLi9saWIvZGV2LnNlcnZlcic7XG5pbXBvcnQgY2xpZW50SG90RGV2IGZyb20gJy4vbGliL2Rldi5jbGllbnQnO1xuXG5jb25zdCB7IGJ1aWxkRGlyIH0gPSBjb25maWc7XG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5leHBvcnQgZGVmYXVsdCBhc3luYyAoKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oYnVpbGREaXIsICdwdWJsaWMnKSkpO1xuICBhd2FpdCBjbGVhbkRpcigpO1xuICBhd2FpdCBjbGllbnRIb3REZXYoYXBwKTtcbiAgY29uc3QgaG9zdCA9IGF3YWl0IHNlcnZlckhvdERldihhcHApO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGJyb3dzZXJTeW5jLmNyZWF0ZSgpLmluaXQoe1xuICAgICAgdWk6IGZhbHNlLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgdGFyZ2V0OiBob3N0LFxuICAgICAgICBtaWRkbGV3YXJlOiBhcHAsXG4gICAgICB9LFxuICAgIH0sIChlcnJvciwgYnMpID0+IGVycm9yID8gcmVqZWN0KGVycm9yKTogcmVzb2x2ZShicykpO1xuICB9KTtcbn1cbiJdfQ==