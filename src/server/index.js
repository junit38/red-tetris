import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')
  , ioRoutes = require('./ioRoutes')
  , ioConnect = require('./ioConnect')
  , events = require('events')

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

const initEngine = io => {
  let rooms = [];

  exports.io = io;

  io.on('connection', function(socket) {
    exports.socket = socket;

    let { room, player_name } = socket.handshake.query;

    rooms = ioConnect.connect(rooms, room, player_name);

    socket.on("disconnect", () => {
      rooms = ioConnect.disconnect(rooms, room, player_name)
    });

    ioRoutes.initRoute(socket, rooms, room, player_name);
  });
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
