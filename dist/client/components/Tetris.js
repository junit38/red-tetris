"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tetris = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _Board = require("./Board");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOCKET_SERVER_URL = "http://0.0.0.0:3004";
var LAUNCH_GAME_EVENT = "launchGame";
var GET_GAME_EVENT = "getGame";
var GAME_ERROR_EVENT = "gameError";

var Tetris = exports.Tetris = function Tetris() {
  var location = (0, _reactRouterDom.useLocation)();
  var room = location.pathname.substring(1).split('[')[0];
  var player_name_unformated = location.pathname.substring(1).split('[')[1];
  var index = player_name_unformated.indexOf(']');
  var player_name = player_name_unformated.substring(0, index);
  var socketRef = (0, _react.useRef)();

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      launched = _useState2[0],
      setLaunched = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      game = _useState4[0],
      setGame = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      error = _useState6[0],
      setError = _useState6[1];

  (0, _react.useEffect)(function () {
    socketRef.current = (0, _socket2.default)(SOCKET_SERVER_URL, {
      query: { room: room, player_name: player_name }
    });

    setLaunched(false);
    socketRef.current.on(LAUNCH_GAME_EVENT, function (data) {
      setLaunched(true);
    });

    setGame({});
    socketRef.current.on(GET_GAME_EVENT, function (data) {
      setGame(data);
      console.log('getGame');
      console.log(data);
    });

    setError(null);
    socketRef.current.on(GAME_ERROR_EVENT, function (data) {
      setError(data.message);
    });

    if (!game) socketRef.current.emit(GET_GAME_EVENT, {});

    return function () {
      socketRef.current.disconnect();
    };
  }, [room, player_name]);

  var launchGame = function launchGame() {
    console.log("launch Game");
    socketRef.current.emit(LAUNCH_GAME_EVENT, {});
  };

  if (error) return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "h2",
      null,
      error
    ),
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: "/" },
      "Return"
    )
  );else if (!launched) return _react2.default.createElement(_Board.Board, { launchGame: launchGame, game: game, room: room, player_name: player_name });else return _react2.default.createElement(
    "div",
    null,
    "Launched"
  );
};