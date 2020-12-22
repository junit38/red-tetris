import debug from 'debug'

const loginfo = debug('tetris:info')
  , ioController = require('./ioController')
  , tools = require('./tools')
  , ioRoutes = require('./ioRoutes')
  , app = require('./index.js')

exports.connect = function(rooms, room, player_name) {
  loginfo("Socket connected: " + app.socket.id)

  // app.socket.on('action', (action) => {
  //   if(action.type === 'server/ping'){
  //     app.socket.emit('action', {type: 'pong'})
  //   }
  // })

  if (room && player_name)
  {
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      if (rooms[index].users.indexOf(player_name) != -1)
      {
        app.socket.emit(ioRoutes.GAME_ERROR_EVENT, {message: 'Name already used.'});
        room = null;
        player_name = null;
      }
      else if (rooms[index].launched)
      {
        app.socket.emit(ioRoutes.GAME_ERROR_EVENT, {message: 'Game already launched'});
        app.socket.join(room);
        if (rooms[index].admin == null)
          rooms[index].admin = player_name;
        rooms[index].users.push({
          name: player_name,
          lines: 20,
          blocks: 0,
          playing: false,
          waiting: true
        });
        ioController.getGames(rooms);
        ioController.getGame(rooms, room);
      }
      else {
        app.socket.join(room);
        if (rooms[index].admin == null)
          rooms[index].admin = player_name;
        rooms[index].users.push({
          name: player_name,
          lines: 20,
          blocks: 0,
          playing: false,
          waiting: false
        });
        ioController.getGames(rooms);
        ioController.getGame(rooms, room);
      }
    }
    else {
      app.socket.join(room);
      rooms.push({
        id: room,
        launched: false,
        admin: player_name,
        users: [{
          name: player_name,
          lines: 20,
          blocks: 0,
          playing: false,
          waiting: false
        }],
        piecesWaiting: []
      });
      ioController.getGames(rooms);
      ioController.getGame(rooms, room);
    }
  }
  else
    app.socket.join(app.socket.id)
  return (rooms);
}

exports.disconnect = function(rooms, room, player_name) {
  console.log(`Client ${app.socket.id} diconnected`);

  if (room && player_name)
  {
    app.socket.leave(room);
    const index = tools.getRoomIndex(rooms, room);
    if (index != -1)
    {
      const userIndex = tools.getUserIndex(rooms[index].users, player_name);
      rooms[index].users.splice(userIndex, 1);
      if (rooms[index].admin == player_name && rooms[index].users[0])
        rooms[index].admin = rooms[index].users[0];
      if (rooms[index].users.length == 0)
        rooms.splice(index, 1);
    }
    ioController.getGame(rooms, room);
    ioController.getGames(rooms);
  }
  else
    app.socket.leave(app.socket.id);
  return (rooms);
}
