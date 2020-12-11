"use strict";

var LAUNCH_GAME_EVENT = "launchGame";
var GET_ROOM_ID_EVENT = "getRoomId";
var GET_GAME_EVENT = "getGame";
var GET_GAMES_EVENT = "getGames";
var GAME_ERROR_EVENT = "gameError";

var initEngine = function initEngine(io) {
  var rooms = [];

  io.on('connection', function (socket) {
    loginfo("Socket connected: " + socket.id);
    socket.on('action', function (action) {
      if (action.type === 'server/ping') {
        socket.emit('action', { type: 'pong' });
      }
    });

    var _socket$handshake$que = socket.handshake.query,
        room = _socket$handshake$que.room,
        player_name = _socket$handshake$que.player_name;


    if (room && player_name) {
      var index = getRoomIndex(rooms, room);
      if (index != -1) {
        if (rooms[index].users.indexOf(player_name) != -1) {
          socket.emit(GAME_ERROR_EVENT, { message: 'Name already used.' });
          room = null;
          player_name = null;
        } else {
          socket.join(room);
          if (rooms[index].admin == null) rooms[index].admin = player_name;
          rooms[index].users.push(player_name);
        }
      } else {
        socket.join(room);
        rooms.push({
          id: room,
          launched: false,
          admin: player_name,
          users: [player_name]
        });
        getGames();
      }
    } else socket.join(socket.id);

    function getRoomIndex(rooms, room) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == room) return i;
      }
      return -1;
    }

    socket.on("disconnect", function () {
      console.log("Client " + socket.id + " diconnected");
      if (room && player_name) {
        socket.leave(room);
        var _index = getRoomIndex(rooms, room);
        if (_index != -1) {
          var userIndex = rooms[_index].users.indexOf(player_name);
          rooms[_index].users.splice(userIndex, 1);
          if (rooms[_index].admin == player_name && rooms[_index].users[0]) rooms[_index].admin = rooms[_index].users[0];
          if (rooms[_index].users.length == 0) rooms.splice(_index, 1);
          getGame();
          getGames();
        }
      } else socket.leave(socket.id);
    });

    function getGame() {
      if (room) {
        var _index2 = getRoomIndex(rooms, room);
        if (_index2 != -1) {
          var data = rooms[_index2];
          io.in(room).emit(GET_GAME_EVENT, data);
        }
      }
    }

    socket.on(GET_GAME_EVENT, function () {
      getGame();
    });

    function getGames() {
      io.emit(GET_GAMES_EVENT, rooms);
    }

    socket.on(GET_GAMES_EVENT, function () {
      getGames();
    });

    function launchGame(rooms, room) {
      var index = getRoomIndex(rooms, room);
      if (index != -1) rooms[index].launched = true;
      return rooms;
    }

    socket.on(LAUNCH_GAME_EVENT, function (data) {
      rooms = launchGame(rooms, room);
      getGames();
      io.in(room).emit(LAUNCH_GAME_EVENT, data);
    });

    function findRoom(room) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == room) return 1;
      }
      return -1;
    }

    function getRoomId(rooms) {
      var id = 0;
      var room = 'room_' + id;
      while (findRoom(room) != -1) {
        id = id + 1;
        room = 'room_' + id;
      }
      rooms.push({
        id: room,
        launched: false,
        admin: null,
        users: []
      });
      io.in(socket.id).emit(GET_ROOM_ID_EVENT, {
        room: room
      });
      return rooms;
    }

    socket.on(GET_ROOM_ID_EVENT, function () {
      rooms = getRoomId(rooms);
      getGames();
    });
  });
};