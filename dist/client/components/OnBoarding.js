"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OnBoarding = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _Games = require("./Games");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOCKET_SERVER_URL = "http://0.0.0.0:3004";
var GET_ROOM_ID_EVENT = "getRoomId";
var GET_GAMES_EVENT = "getGames";

var OnBoarding = exports.OnBoarding = function OnBoarding() {
  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      login = _useState2[0],
      setLogin = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      roomName = _useState4[0],
      setRoomName = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      games = _useState6[0],
      setGames = _useState6[1];

  var _useState7 = (0, _react.useState)(0),
      _useState8 = _slicedToArray(_useState7, 2),
      game = _useState8[0],
      setGame = _useState8[1];

  var socket = (0, _socket2.default)(SOCKET_SERVER_URL);
  var history = (0, _reactRouterDom.useHistory)();

  (0, _react.useEffect)(function () {
    return function () {
      socket.disconnect();
    };
  });

  var selectGame = function selectGame(game) {
    setGame(game);
  };

  var unselectGame = function unselectGame() {
    setGame(null);
  };

  var handleClick = function handleClick(e) {
    if (!login) {
      alert('Login required');
      e.preventDefault();
    } else {
      if (game) history.push(game.id + "[" + login + "]");else {
        socket.on(GET_ROOM_ID_EVENT, function (data) {
          history.push(data.room + "[" + login + "]");
        });
        socket.emit(GET_ROOM_ID_EVENT, {});
      }
    }
  };

  var onChangeForm = function onChangeForm(e) {
    if (e.target.name === 'login') {
      setLogin(e.target.value);
    }
  };

  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement("input", { type: "text", onChange: onChangeForm, name: "login", id: "login" }),
    _react2.default.createElement(
      "button",
      { onClick: handleClick },
      "Join room"
    ),
    _react2.default.createElement(
      "div",
      { onClick: unselectGame },
      game ? game.id + ' selected' : ''
    ),
    _react2.default.createElement(_Games.Games, { games: games, selectGame: selectGame })
  );
};