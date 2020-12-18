import debug from 'debug'

const tools = require('./tools')
  , app = require('./index.js')
  , ioRoutes = require('./ioRoutes')

exports.getGame = function(rooms, room) {
  if (room) {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      const data = rooms[index];
      app.io.in(room).emit(ioRoutes.GET_GAME_EVENT, data);
    }
  }
}

exports.getGames = function(rooms) {
  app.io.emit(ioRoutes.GET_GAMES_EVENT, rooms);
}

exports.launchGame = function(rooms, room) {
  const index = tools.getRoomIndex(rooms, room);
  if (index != -1)
    rooms[index].launched = true;
  return (rooms);
}

exports.getGameId = function (rooms, socket) {
  let id = 0;
  let room = 'room_' + id;

  function findGame(room) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id == room)
        return (1);
    }
    return (-1);
  }

  while (findGame(room) != -1)
  {
    id = id + 1
    room = 'room_' + id;
  }
  rooms.push({
    id: room,
    launched: false,
    admin: null,
    users: []
  });
  app.io.in(app.socket.id).emit(ioRoutes.GET_GAME_ID_EVENT, {
    room: room
  });
  return (rooms);
}

let jsonPieces = require('./json/pieces.json');

exports.getNewPiece = function(room) {
  if (room) {
    let rand = Math.floor(Math.random() * jsonPieces.length);
    const data = jsonPieces[0];
    app.io.in(room).emit(ioRoutes.NEW_PIECE_EVENT, data);
  }
}
