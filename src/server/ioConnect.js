import debug from 'debug'

const loginfo = debug('tetris:info')
  , ioController = require('./ioController')
  , tools = require('./tools')
  , ioRoutes = require('./ioRoutes')
  , app = require('./index.js')
  , Game = require('./classes/Game')

exports.connect = function(games, room, player_name) {
  loginfo("Socket connected: " + app.socket.id)

  app.socket.on('action', (action) => {
    if(action.type === 'server/ping'){
      app.socket.emit('action', {type: 'pong'})
    }
  })

  if (room && player_name)
  {
    const index = tools.getGameIndex(games, room);
    if (index != -1)
    {
      if (tools.findUser(games[index], player_name) != -1)
      {
        app.socket.emit(ioRoutes.GAME_ERROR_EVENT, {message: 'Name already used.'});
        room = null;
        player_name = null;
      }
      else if (games[index].launched)
      {
        app.socket.emit(ioRoutes.GAME_ERROR_EVENT, {message: 'Game already launched'});
        app.socket.join(room);
        games[index].addUser(player_name);
        ioController.getGames(games);
        ioController.getGame(games, room);
      }
      else {
        app.socket.join(room);
        games[index].addUser(player_name);
        ioController.getGames(games);
        ioController.getGame(games, room);
      }
    }
    else {
      app.socket.join(room);
      const newGame = new Game(room);
      newGame.addUser(player_name);
      games.push(newGame);
      ioController.getGames(games);
      ioController.getGame(games, room);
    }
  }
  else
    app.socket.join(app.socket.id)
  return ({
    'games': games,
    'room': room,
    'player_name': player_name
  });
}

exports.disconnect = function(games, room, player_name) {
  console.log(`Client ${app.socket.id} diconnected`);

  if (room && player_name)
  {
    const index = tools.getGameIndex(games, room);
    if (index != -1)
    {
      games[index].removeUser(player_name)
      if (games[index].users.length == 0)
      {
        app.socket.leave(room);
        games.splice(index, 1);
      }
    }
    ioController.getGame(games, room);
    ioController.getGames(games);
  }
  else
    app.socket.leave(app.socket.id);
  return (games);
}
