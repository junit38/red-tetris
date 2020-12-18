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

exports.initRoute = function(socket, rooms, room, player_name) {
  socket.on(GET_GAME_ID_EVENT, () => {
    rooms = ioController.getGameId(rooms);
    ioController.getGames(rooms);
  });

  socket.on(GET_GAME_EVENT, () => {
    ioController.getGame(rooms, room);
  });

  socket.on(GET_GAMES_EVENT, () => {
    ioController.getGames(rooms);
  });

  socket.on(LAUNCH_GAME_EVENT, () => {
    rooms = ioController.launchGame(rooms, room);
    ioController.getGames(rooms);
    ioController.getGame(rooms, room);
  });

  socket.on(NEW_PIECE_EVENT, () => {
    ioController.getNewPiece(room);
  });

  socket.on(GAME_OVER_EVENT, () => {
    rooms = ioController.gameOver(rooms, room, player_name);
    ioController.getGame(rooms, room);
    console.log(tools.getUsersPlaying(rooms, room));
    if (tools.getUsersPlaying(rooms, room) <= 1)
    {
      rooms = ioController.stopGame(rooms, room);
      ioController.getGames(rooms);
      ioController.getGame(rooms, room);
    }
  });
}

exports.GET_GAME_ID_EVENT = GET_GAME_ID_EVENT;
exports.GET_GAME_EVENT = GET_GAME_EVENT;
exports.GET_GAMES_EVENT = GET_GAMES_EVENT;
exports.LAUNCH_GAME_EVENT = LAUNCH_GAME_EVENT;
exports.GAME_ERROR_EVENT = GAME_ERROR_EVENT;
exports.NEW_PIECE_EVENT = NEW_PIECE_EVENT;
exports.GAME_OVER_EVENT = GAME_OVER_EVENT;
