import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')
  , ioController = require('./ioController')
  , tools = require('./tools')

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

    socket.on("disconnect", () => {
      console.log(`Client ${socket.id} diconnected`);
      console.log(room);
      console.log(player_name);
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

    socket.on(GET_ROOM_ID_EVENT, () => {
      rooms = ioController.getRoomId(rooms, io, socket);
      ioController.getGames(rooms, io);
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
