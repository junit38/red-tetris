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

  it('should pong', function(done){
    const initialState = {}
    const socket = io(params.server.url)
    const store =  configureStore(rootReducer, socket, initialState, {
      'pong': () =>  done()
    })
    store.dispatch(ping())
  });

  it('should not get games', function(done){
    const initialState = {}
    const socket = io(params.server.url);
    socket.on(GET_GAMES_EVENT, function(res) {
      if (res.length === 0)
      {
        socket.off(GET_GAMES_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(GET_GAMES_EVENT);
  });

  it('should get room id', function(done){
    const initialState = {}
    const socket = io(params.server.url);
    socket.on(GET_GAME_ID_EVENT, function(res) {
      if (res.room === 'room_0')
      {
        socket.off(GET_GAME_ID_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(GET_GAME_ID_EVENT);
  });

  it('should get games', function(done){
    const initialState = {}
    const socket = io(params.server.url);
    socket.on(GET_GAMES_EVENT, function(res) {
      if (res[0].id === 'room_0')
      {
        socket.off(GET_GAMES_EVENT);
        socket.disconnect();
        done();
      }
    });
    socket.emit(GET_GAMES_EVENT);
  });

});
