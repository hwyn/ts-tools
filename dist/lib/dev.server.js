"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _express = _interopRequireDefault(require("express"));
var _config = require("../config");
var _nodemon = _interopRequireDefault(require("./nodemon.server"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { buildDir } = _config.config;var _default =

async app => {
  app.use(_express.default.static(_path.default.resolve(buildDir, '/public')));
  return await (0, _nodemon.default)(app);
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3Rvb2xzL2xpYi9kZXYuc2VydmVyLnRzIl0sIm5hbWVzIjpbImJ1aWxkRGlyIiwiY29uZmlnIiwiYXBwIiwidXNlIiwiZXhwcmVzcyIsInN0YXRpYyIsInBhdGgiLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoib0dBQUE7QUFDQTtBQUNBO0FBQ0EsbUU7O0FBRUEsTUFBTSxFQUFFQSxRQUFGLEtBQWVDLGNBQXJCLEM7O0FBRWUsTUFBT0MsR0FBUCxJQUFvQjtBQUNqQ0EsRUFBQUEsR0FBRyxDQUFDQyxHQUFKLENBQVFDLGlCQUFRQyxNQUFSLENBQWVDLGNBQUtDLE9BQUwsQ0FBYVAsUUFBYixFQUF1QixTQUF2QixDQUFmLENBQVI7QUFDQSxTQUFPLE1BQU0sc0JBQVFFLEdBQVIsQ0FBYjtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBub2RlbW9uIGZyb20gJy4vbm9kZW1vbi5zZXJ2ZXInO1xuXG5jb25zdCB7IGJ1aWxkRGlyIH0gPSBjb25maWc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChhcHA6IGFueSkgPT4ge1xuICBhcHAudXNlKGV4cHJlc3Muc3RhdGljKHBhdGgucmVzb2x2ZShidWlsZERpciwgJy9wdWJsaWMnKSkpO1xuICByZXR1cm4gYXdhaXQgbm9kZW1vbihhcHApO1xufTtcbiJdfQ==