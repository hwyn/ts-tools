"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _config = require("./config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

async () => {
  const client = (0, _config.webpackClient)();
  return new Promise((resolve, reject) => {
    (0, _webpack.default)([client, (0, _config.webpackServer)()]).run((err, stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(client.stats));
      resolve();
    });
  });
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Rvb2xzL2J1bmRsZS50cyJdLCJuYW1lcyI6WyJjbGllbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJ1biIsImVyciIsInN0YXRzIiwiY29uc29sZSIsImluZm8iLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Im9HQUFBO0FBQ0Esa0M7O0FBRWUsWUFBMEI7QUFDdkMsUUFBTUEsTUFBTSxHQUFHLDRCQUFmO0FBQ0EsU0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDLDBCQUFRLENBQUNILE1BQUQsRUFBUyw0QkFBVCxDQUFSLEVBQW1DSSxHQUFuQyxDQUF1QyxDQUFDQyxHQUFELEVBQU1DLEtBQU4sS0FBZ0I7QUFDckQsVUFBSUQsR0FBSixFQUFTO0FBQ1AsZUFBT0YsTUFBTSxFQUFiO0FBQ0Q7QUFDREksTUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWFGLEtBQUssQ0FBQ0csUUFBTixDQUFlVCxNQUFNLENBQUNNLEtBQXRCLENBQWI7QUFDQUosTUFBQUEsT0FBTztBQUNSLEtBTkQ7QUFPRCxHQVJNLENBQVA7QUFTRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdlYnBhY2ssIHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0IHsgd2VicGFja1NlcnZlciwgd2VicGFja0NsaWVudCwgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgY2xpZW50ID0gd2VicGFja0NsaWVudCgpO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHdlYnBhY2soW2NsaWVudCwgd2VicGFja1NlcnZlcigpXSkucnVuKChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuaW5mbyhzdGF0cy50b1N0cmluZyhjbGllbnQuc3RhdHMpKTtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTsgXG4gIH0pO1xufTtcbiJdfQ==