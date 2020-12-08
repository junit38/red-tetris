import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const {host, port} = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({host, port}, () =>{
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

const LAUNCH_GAME_EVENT = "launchGame";
const GET_ROOM_ID_EVENT = "getRoomId";
const GET_GAME_EVENT = "getGame";
const GET_GAMES_EVENT = "getGames";
const GAME_ERROR_EVENT = "gameError";

const initEngine = io => {
  let rooms = [];

  io.on('connection', function(socket){
    loginfo("Socket connected: " + socket.id)
    socket.on('action', (action) => {
      if(action.type === 'server/ping'){
        socket.emit('action', {type: 'pong'})
      }
    })

    let { room, player_name } = socket.handshake.query;

    if (room && player_name)
    {
      const index = getRoomIndex(rooms, room);
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
        getGames();
      }
    }
    else
      socket.join(socket.id)

    function getRoomIndex(rooms, room) {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == room)
          return (i);
      }
      return (-1);
    }

    socket.on("disconnect", () => {
      console.log(`Client ${socket.id} diconnected`);
      if (room && player_name)
      {
        socket.leave(room);
        const index = getRoomIndex(rooms, room);
        if (index != -1)
        {
          const userIndex = rooms[index].users.indexOf(player_name);
          rooms[index].users.splice(userIndex, 1);
          if (rooms[index].admin == player_name && rooms[index].users[0])
            rooms[index].admin = rooms[index].users[0];
          if (rooms[index].users.length == 0)
            rooms.splice(index, 1);
          getGame();
          getGames();
        }
      }
      else
        socket.leave(socket.id);
    });

    function getGame() {
      if (room) {
        const index = getRoomIndex(rooms, room);
        if (index != -1)
        {
          const data = rooms[index];
          io.in(room).emit(GET_GAME_EVENT, data);
        }
      }
    }

    socket.on(GET_GAME_EVENT, () => {
      console.log('Get Game')
      getGame();
    });

    function getGames() {
      io.emit(GET_GAMES_EVENT, rooms);
    }

    socket.on(GET_GAMES_EVENT, () => {
      console.log('Get Game')
      getGames();
    });

    function launchGame(rooms, room) {
      const index = getRoomIndex(rooms, room);
      if (index != -1)
        rooms[index].launched = true;
      return (rooms);
    }

    socket.on(LAUNCH_GAME_EVENT, (data) => {
      console.log('Launch Game')
      rooms = launchGame(rooms, room);
      getGames();
      io.in(room).emit(LAUNCH_GAME_EVENT, data);
    });

    function findRoom(room) {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == room)
          return (1);
      }
      return (-1);
    }

    function getRoomId(rooms) {
      console.log('Get Room ID')
      console.log(rooms);
      let id = 0;
      let room = 'room_' + id;
      while (findRoom(room) != -1)
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
      io.in(socket.id).emit(GET_ROOM_ID_EVENT, {
        room: room
      });
      return (rooms);
    }

    socket.on(GET_ROOM_ID_EVENT, () => {
      rooms = getRoomId(rooms);
      getGames();
    });
  })
}

export function create(params){
  const promise = new Promise( (resolve, reject) => {
    const app = require('http').createServer()
    initApp(app, params, () =>{
      const io = require('socket.io')(app)
      const stop = (cb) => {
        io.close()
        app.close( () => {
          app.unref()
        })
        loginfo(`Engine stopped.`)
        cb()
      }

      initEngine(io)
      resolve({stop})
    })
  })
  return promise
}
