"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Games = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOCKET_SERVER_URL = "http://0.0.0.0:3004";
var GET_GAMES_EVENT = "getGames";

var Games = exports.Games = function Games(props) {
  var selectGame = props.selectGame;

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      games = _useState2[0],
      setGames = _useState2[1];

  var elems = [];
  var socket = (0, _socket2.default)(SOCKET_SERVER_URL);

  socket.on(GET_GAMES_EVENT, function (data) {
    setGames(data);
    for (var i = 0; i < data.length; i++) {
      if (data[i].launched == false) elems.push(_react2.default.createElement(
        "div",
        { key: i },
        "data[i].id"
      ));
    }
  });

  (0, _react.useEffect)(function () {
    if (!games.length) socket.emit(GET_GAMES_EVENT, {});

    return function () {
      socket.disconnect();
    };
  });

  var getGamesLength = function getGamesLength() {
    var length = 0;
    for (var i = 0; i < games.length; i++) {
      if (games[i].launched == false) length++;
    }
    return length;
  };

  var _loop = function _loop(i) {
    if (games[i].launched == false) elems.push(_react2.default.createElement(
      "div",
      { key: i, onClick: function onClick() {
          return selectGame(games[i]);
        } },
      games[i].id
    ));
  };

  for (var i = 0; i < games.length; i++) {
    _loop(i);
  }

  if (games) {
    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "h3",
        null,
        getGamesLength(),
        " games:"
      ),
      elems
    );
  } else return _react2.default.createElement("div", null);
};