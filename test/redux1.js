import {configureStore} from './helpers/server'
import rootReducer from '../src/client/reducers'
import {ALERT_POP, alert} from '../src/client/actions/alert'
import {GET_GAMES, getGamesAction} from '../src/client/actions/games'
import io from 'socket.io-client'
import params from '../params'

import chai from "chai"

const MESSAGE = "message"

chai.should()

describe('Fake redux test', function(){
  it('alert it', function(done){
    const initialState = {
      message: ''
    }
    const store =  configureStore(rootReducer, null, initialState, {
      ALERT_POP: ({dispatch, getState}) =>  {
        const state = getState()
        state.message.should.equal(MESSAGE)
        done()
      }
    })
    store.dispatch(alert(MESSAGE))
  });

  it('load games', function(done){
    const initialState = {
      games: []
    };
    const socket = io(params.server.url);
    const store = configureStore(rootReducer, null, initialState, {
      GET_GAMES: ({dispatch, getState}) =>  {
        const state = getState()
        state.games.should.equal([]);
        done();
      }
    })
    socket.on(GET_GAMES_EVENT,(res) => {
      store.dispatch(getGamesAction(res))
    })
    socket.emit(GET_GAMES_EVENT);
  });

});
