import chai from "chai"
import {startServer, configureStore} from './helpers/server'
import rootReducer from '../src/client/reducers'
import {ping} from '../src/client/actions/server'
import io from 'socket.io-client'
import params from '../params'

import '../src/client/global'
import GamesService from '../src/client/services/GamesService'

chai.should()

describe('Fake server test', function(){
  let tetrisServer
  before(cb => startServer( params.server, function(err, server){
    tetrisServer = server
    cb()
  }))

  after(function(done){tetrisServer.stop(done)})

  it('should get game', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    socket.on(GET_GAME_EVENT, function(res) {
      if (res.id === 'room_0')
      {
        socket.off(GET_GAME_EVENT);
        socket.disconnect();
        done();
      }
    });
  });

  it('should return error', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    const socket2 = io(params.server.url, {
      query: {room, player_name},
    })
    socket2.on(GAME_ERROR_EVENT, function(res) {
      if (res.message === 'Name already used.')
      {
        socket2.off(GAME_ERROR_EVENT);
        socket.disconnect();
        socket2.disconnect();
        done();
      }
    });
  });

  it('should launch game 1', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    socket.on(GET_GAME_EVENT, function(res) {
      if (res.id === 'room_0' && res.launched === true)
      {
        socket.off(GET_GAME_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(LAUNCH_GAME_EVENT);
  });

  it('should launch game 2', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    socket.on(GET_GAMES_EVENT, function(res) {
      if (res[0].id === 'room_0' && res[0].launched === true)
      {
        socket.off(GET_GAMES_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(LAUNCH_GAME_EVENT);
  });

  it('should get new piece', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    socket.on(NEW_PIECE_EVENT, function(res) {
      if (res)
      {
        socket.off(NEW_PIECE_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(NEW_PIECE_EVENT);
  });

  it('should stop user playing', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    socket.on(GET_GAME_EVENT, function(res) {
      if (res) {
        res.users.forEach(function(user) {
          if (user.name === player_name && user.playing === false) {
            socket.off(GET_GAME_EVENT);
            socket.disconnect();
            done();
          }
        })
      }
    });
    socket.emit(LAUNCH_GAME_EVENT);
    socket.emit(GAME_OVER_EVENT);
  });

  it('should send blocks', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    const player_name2 = 'player_name2';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    const socket2 = io(params.server.url, {
      query: {'room': room, 'player_name': player_name2},
    })
    socket.on(GET_USERS_EVENT, function(res) {
      if (res) {
        let ok = true;
        res.forEach(function(user) {
          if (user.name !== player_name && user.blocks !== 2) {
             console.log(user);
            ok = false
          }
        })
        if (ok === true) {
          socket.off(GET_GAME_EVENT);
          socket.disconnect();
          socket2.disconnect();
          done();
        }
      }
    });
    socket.emit(SEND_BLOCKS_EVENT, 2);
  });

  it('should send lines', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    const player_name2 = 'player_name2';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    const socket2 = io(params.server.url, {
      query: {'room': room, 'player_name': player_name2},
    })
    socket.on(GET_GAME_EVENT, function(res) {
      if (res) {
        let ok = false;
        res.users.forEach(function(user) {
          if (user.name === player_name && user.lines === 18) {
            ok = true;
          }
        })
        if (ok === true) {
          socket.off(GET_GAME_EVENT);
          socket.disconnect();
          socket2.disconnect();
          done();
        }
      }
    });
    socket.emit(SEND_LINES_EVENT, 18);
  });

  it('should reset game', function(done){
    const initialState = {};
    const room = 'room_0';
    const player_name = 'player_name';
    const player_name2 = 'player_name2';
    let socket = io(params.server.url);
    socket.emit(GET_GAME_ID_EVENT);
    socket.disconnect();
    socket = io(params.server.url, {
      query: {room, player_name},
    })
    const socket2 = io(params.server.url, {
      query: {'room': room, 'player_name': player_name2},
    })
    socket.on(GET_GAME_EVENT, function(res) {
      if (res) {
        let ok = true;
        res.users.forEach(function(user) {
          if (user.playing !== false && user.waiting !== false &&
            user.blocks !== 0 && users.lines !== 20) {
            ok = false;
          }
        })
        if (ok === true) {
          socket.off(GET_GAME_EVENT);
          socket.disconnect();
          socket2.disconnect();
          done();
        }
      }
    });
    socket.emit(LAUNCH_GAME_EVENT);
    socket.emit(SEND_BLOCKS_EVENT, 2);
    socket.emit(SEND_LINES_EVENT, 18);
    socket.emit(RESET_GAME_EVENT);
  });

});
