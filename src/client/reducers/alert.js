import { ALERT_POP } from '../actions/alert'

const reducer = (state = {} , action) => {
  switch(action.type){
    case ALERT_POP:
      return {
        ...state,
        message: action.message
      }
    case 'GET_GAMES':
      return {
        ...state,
        games: action.games
      }
    case 'GET_GAME':
      return {
        ...state,
        game: action.game
      }
    case 'GET_ERROR':
      return {
        ...state,
        error: action.error.message
      }
    default:
      return state
  }
}

export default reducer

