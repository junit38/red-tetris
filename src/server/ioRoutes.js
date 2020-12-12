import debug from 'debug'

const loginfo = debug('tetris:info')
  , ioConnect = require('./ioConnect')
  , ioController = require('./ioController')
  , tools = require('./tools')

const LAUNCH_GAME_EVENT = "launchGame";
const GET_GAME_ID_EVENT = "getGameId";
const GET_GAME_EVENT = "getGame";
const GET_GAMES_EVENT = "getGames";
const GAME_ERROR_EVENT = "gameError";

exports.initEngine = function(io) {
  let rooms = [];

  io.on('connection', function(socket) {

    let { room, player_name } = socket.handshake.query;

    rooms = ioConnect.connect(rooms, room, player_name, socket, io);

    socket.on("disconnect", () => {
      rooms = ioConnect.disconnect(rooms, room, player_name, socket, io)
    });

    socket.on(GET_GAME_EVENT, () => {
      ioController.getGame(rooms, room, io);
    });

    socket.on(GET_GAMES_EVENT, () => {
      ioController.getGames(rooms, io);
    });

    socket.on(LAUNCH_GAME_EVENT, (data) => {
      rooms = ioController.launchGame(rooms, room);
      ioController.getGames(rooms, io);
      io.in(room).emit(LAUNCH_GAME_EVENT, data);
    });

    socket.on(GET_GAME_ID_EVENT, () => {
      rooms = ioController.getRoomId(rooms, io, socket);
      ioController.getGames(rooms, io);
    });
  })
}
