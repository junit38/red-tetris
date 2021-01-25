import debug from 'debug'

const tools = require('./tools')
  , app = require('./index.js')
  , ioRoutes = require('./ioRoutes')
  , Game = require('./classes/Game')
  , Piece = require('./classes/Piece')

exports.getGameId = function (games) {
  let id = 0;
  let room = 'room_' + id;

  while (tools.findGame(games, room) != null)
  {
    id = id + 1
    room = 'room_' + id;
  }

  const newGame = new Game(room);
  games.push(newGame);
  if (app && app.io && app.socket)
  {
    app.io.in(app.socket.id).emit(ioRoutes.GET_GAME_ID_EVENT, {
      room: room
    });
  }
  return (games);
}

exports.getGame = function(games, room) {
  if (games && room)
  {
    const game = tools.findGame(games, room)
    if (game)
      app.io.in(room).emit(ioRoutes.GET_GAME_EVENT, game);
  }
}

exports.getGames = function(games) {
  app.io.emit(ioRoutes.GET_GAMES_EVENT, games);
}

exports.launchGame = function(games, room) {
  const game = tools.findGame(games, room)
  if (game)
  {
    game.launch();
    game.startPlaying();
    app.io.in(room).emit(ioRoutes.LAUNCH_GAME_EVENT);
  }
  return (games);
}

exports.stopGame = function(games, room) {
  const game = tools.findGame(games, room)
  if (game)
    game.stop();
  return (games);
}

exports.getNewPiece = function(room) {
  if (room)
  {
    const newPiece = new Piece();
    app.io.in(room).emit(ioRoutes.NEW_PIECE_EVENT, newPiece);
  }
}

exports.gameOver = function(games, room, player_name) {
  if (room && games)
  {
    const game = tools.findGame(games, room)
    if (game)
    {
      if (game.users)
        game.stopUserPlaying(player_name);
    }
  }
  return games;
}

exports.sendBlocks = function(games, room, player_name, blocks) {
  if (room && games)
  {
    const game = tools.findGame(games, room)
    if (game)
    {
      if (game.users)
        game.addUsersBlocks(player_name, blocks);
    }
  }
  return games;
}

exports.sendLines = function(games, room, player_name, lines) {
  if (room && games)
  {
    const game = tools.findGame(games, room)
    if (game)
    {
      if (game.users)
        game.setUserLines(player_name, lines)
    }
  }
  return games;
}

exports.getUsers = function(games, room) {
  if (room && games)
  {
    const game = tools.findGame(games, room)
    if (game)
      app.io.in(room).emit(ioRoutes.GET_USERS_EVENT, game.users);
  }
}

exports.resetGame = function(games, room) {
  if (room && games)
  {
    const game = tools.findGame(games, room)
    if (game)
      game.resetUsers();
  }
  return games;
}
