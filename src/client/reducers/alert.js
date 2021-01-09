import { ALERT_POP } from '../actions/alert'

const reducer = (state = {} , action) => {
  switch(action.type){
    case ALERT_POP:
      return {
        ...state,
        message: action.message
      }
    case 'INITIAL_ITEMS':
      return {
        ...state,
        items: action.items
      }
    default:
      return state
  }
}

export default reducer

