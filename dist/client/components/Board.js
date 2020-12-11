'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Board = exports.Board = function Board(props) {
  var room = props.room;
  var player_name = props.player_name;
  var launchGame = props.launchGame;
  var game = props.game;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h3',
      null,
      room
    ),
    _react2.default.createElement(
      'p',
      null,
      player_name
    ),
    _react2.default.createElement(
      'p',
      null,
      game && game.users ? game.users.length : 0,
      ' players'
    ),
    game.admin == player_name ? _react2.default.createElement(
      'button',
      { onClick: launchGame },
      'Launch'
    ) : ''
  );
};