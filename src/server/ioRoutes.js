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

exports.initRoute = function(socket, rooms, room, player_name) {
  socket.on(GET_GAME_EVENT, () => {
    ioController.getGame(rooms, room);
  });

  socket.on(GET_GAMES_EVENT, () => {
    ioController.getGames(rooms);
  });

  socket.on(LAUNCH_GAME_EVENT, (data) => {
    rooms = ioController.launchGame(rooms, room);
    ioController.getGames(rooms);
    app.io.in(room).emit(LAUNCH_GAME_EVENT, data);
  });

  socket.on(GET_GAME_ID_EVENT, () => {
    rooms = ioController.getRoomId(rooms);
    ioController.getGames(rooms);
  });
}
