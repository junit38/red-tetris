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
        done();
    });
    socket.emit(NEW_PIECE_EVENT);
  });

});
