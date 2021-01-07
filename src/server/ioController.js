import debug from 'debug'

const tools = require('./tools')
  , app = require('./index.js')
  , ioRoutes = require('./ioRoutes')
  , jsonPieces = require('./json/pieces.json')

exports.getGameId = function (rooms) {
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
  {
    rooms[index].launched = true;
    rooms[index].users.forEach(function(user){
      user.playing = true;
      user.waiting = false;
    });
    app.io.in(room).emit(ioRoutes.LAUNCH_GAME_EVENT);
  }
  return (rooms);
}

exports.stopGame = function(rooms, room) {
  const index = tools.getRoomIndex(rooms, room);
  if (index != -1)
    rooms[index].launched = false;
  return (rooms);
}

exports.getNewPiece = function(room) {
  if (room) {
    let rand = Math.floor(Math.random() * jsonPieces.length);
    const data = jsonPieces[rand];
    app.io.in(room).emit(ioRoutes.NEW_PIECE_EVENT, data);
  }
}

exports.gameOver = function(rooms, room, player_name) {
  if (room && rooms)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      if (rooms[index].users)
      {
        const userIndex = tools.getUserIndex(rooms[index].users, player_name)
        if (userIndex != -1)
        {
          rooms[index].users[userIndex].playing = false;
        }
      }
    }
  }
  return rooms;
}

exports.sendBlocks = function(rooms, room, player_name, blocks) {
  if (room && rooms)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      if (rooms[index].users)
      {
        rooms[index].users.forEach(function(user) {
          if (user.name != player_name)
            user.blocks += blocks;
        });
      }
    }
  }
  return rooms;
}

exports.sendLines = function(rooms, room, player_name, lines) {
  if (room && rooms)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      if (rooms[index].users)
      {
        rooms[index].users.forEach(function(user) {
          if (user.name == player_name)
            user.lines = lines;
        });
      }
    }
  }
  return rooms;
}

exports.getUsers = function(rooms, room) {
  if (room && rooms)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
      app.io.in(room).emit(ioRoutes.GET_USERS_EVENT, rooms[index].users);
  }
}

exports.resetGame = function(rooms, room) {
  if (room && rooms)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      rooms[index].users.forEach(function(user){
        user.lines = 20;
        user.blocks = 0;
        user.playing = false;
        user.waiting = false;
      });
    }
  }
  return rooms;
}
