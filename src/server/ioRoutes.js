import debug from 'debug'

const loginfo = debug('tetris:info')
  , ioController = require('./ioController')
  , tools = require('./tools')
  , app = require('./index.js');

const LAUNCH_GAME_EVENT = "launchGame";
const GET_GAME_ID_EVENT = "getGameId";
const GET_GAME_EVENT = "getGame";
const GET_GAMES_EVENT = "getGames";
const GAME_ERROR_EVENT = "gameError";
const NEW_PIECE_EVENT = "newPiece";
const GAME_OVER_EVENT = "gameOver";
const SEND_BLOCKS_EVENT = "sendBlocks";
const GET_USERS_EVENT = "getUsers";
const SEND_LINES_EVENT = "sendLines";
const RESET_GAME_EVENT = "resetGame";

exports.initRoute = function(socket, games, room, player_name) {
  socket.on(GET_GAME_ID_EVENT, () => {
    games = ioController.getGameId(games);
    ioController.getGames(games);
  });

  socket.on(GET_GAME_EVENT, () => {
    ioController.getGame(games, room);
  });

  socket.on(GET_GAMES_EVENT, () => {
    ioController.getGames(games);
  });

  socket.on(LAUNCH_GAME_EVENT, () => {
    games = ioController.launchGame(games, room);
    ioController.getGames(games);
    ioController.getGame(games, room);
  });

  socket.on(NEW_PIECE_EVENT, () => {
    ioController.getNewPiece(room);
  });

  socket.on(GAME_OVER_EVENT, () => {
    games = ioController.gameOver(games, room, player_name);
    ioController.getGame(games, room);
    if (tools.getUsersPlaying(games, room) <= 1)
    {
      games = ioController.stopGame(games, room);
      ioController.getGames(games);
      ioController.getGame(games, room);
    }
  });

  socket.on(SEND_BLOCKS_EVENT, (blocks) => {
    ioController.sendBlocks(games, room, player_name, blocks);
    ioController.getGame(games, room);
    ioController.getUsers(games, room);
  });

  socket.on(SEND_LINES_EVENT, (lines) => {
    ioController.sendLines(games, room, player_name, lines);
    ioController.getGame(games, room);
  });

  socket.on(RESET_GAME_EVENT, () => {
    games = ioController.resetGame(games, room);
    ioController.getGame(games, room);
  });
}

exports.GET_GAME_ID_EVENT = GET_GAME_ID_EVENT;
exports.GET_GAME_EVENT = GET_GAME_EVENT;
exports.GET_GAMES_EVENT = GET_GAMES_EVENT;
exports.LAUNCH_GAME_EVENT = LAUNCH_GAME_EVENT;
exports.GAME_ERROR_EVENT = GAME_ERROR_EVENT;
exports.NEW_PIECE_EVENT = NEW_PIECE_EVENT;
exports.GAME_OVER_EVENT = GAME_OVER_EVENT;
exports.SEND_BLOCKS_EVENT = SEND_BLOCKS_EVENT;
exports.GET_USERS_EVENT = GET_USERS_EVENT;
exports.SEND_LINES_EVENT = SEND_LINES_EVENT;
exports.RESET_GAME_EVENT = RESET_GAME_EVENT;
