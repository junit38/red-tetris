import debug from 'debug'

const loginfo = debug('tetris:info')
  , ioController = require('./ioController')
  , tools = require('./tools')

exports.connect = function(rooms, room, player_name, socket, io) {
  loginfo("Socket connected: " + socket.id)

  socket.on('action', (action) => {
    if(action.type === 'server/ping'){
      socket.emit('action', {type: 'pong'})
    }
  })

  if (room && player_name)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      if (rooms[index].users.indexOf(player_name) != -1)
      {
        socket.emit(GAME_ERROR_EVENT, {message: 'Name already used.'});
        room = null;
        player_name = null;
      }
      else {
        socket.join(room);
        if (rooms[index].admin == null)
          rooms[index].admin = player_name;
        rooms[index].users.push(player_name);
      }
    }
    else {
      socket.join(room);
      rooms.push({
        id: room,
        launched: false,
        admin: player_name,
        users: [player_name]
      });
      ioController.getGames(rooms, io);
    }
  }
  else
    socket.join(socket.id)
  return (rooms);
}

exports.disconnect = function(rooms, room, player_name, socket, io) {
  console.log(`Client ${socket.id} diconnected`);
  if (room && player_name)
  {
    socket.leave(room);
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      const userIndex = rooms[index].users.indexOf(player_name);
      rooms[index].users.splice(userIndex, 1);
      if (rooms[index].admin == player_name && rooms[index].users[0])
        rooms[index].admin = rooms[index].users[0];
      if (rooms[index].users.length == 0)
        rooms.splice(index, 1);
      ioController.getGame(rooms, room, io);
      ioController.getGames(rooms, io);
    }
  }
  else
    socket.leave(socket.id);
  return (rooms);
}
