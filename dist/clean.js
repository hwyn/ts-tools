"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _fs = require("./core/fs");
var _config = require("./config");

const { buildDir, distDir } = _config.config;var _default =

async () => {
  await (0, _fs.cleanDir)(buildDir);
  await (0, _fs.cleanDir)(distDir);
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Rvb2xzL2NsZWFuLnRzIl0sIm5hbWVzIjpbImJ1aWxkRGlyIiwiZGlzdERpciIsImNvbmZpZyJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0E7O0FBRUEsTUFBTSxFQUFFQSxRQUFGLEVBQVlDLE9BQVosS0FBd0JDLGNBQTlCLEM7O0FBRWUsWUFBWTtBQUN6QixRQUFNLGtCQUFTRixRQUFULENBQU47QUFDQSxRQUFNLGtCQUFTQyxPQUFULENBQU47QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xlYW5EaXIgfSBmcm9tICcuL2NvcmUvZnMnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5jb25zdCB7IGJ1aWxkRGlyLCBkaXN0RGlyIH0gPSBjb25maWc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICgpID0+IHtcbiAgYXdhaXQgY2xlYW5EaXIoYnVpbGREaXIpO1xuICBhd2FpdCBjbGVhbkRpcihkaXN0RGlyKTtcbn07XG4iXX0=