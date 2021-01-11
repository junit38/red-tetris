import '../global'

export const getGameAction = (res) => ({
  type: "GET_GAME",
  game: res
})

export const loadGameEvent = (socket) => {
  return (dispatch) => {
    socket.on(GET_GAME_EVENT,(res)=>{
      dispatch(getGameAction(res))
    })
  }
}

export const getErrorAction = (res) => ({
  type: "GET_ERROR",
  error: res
})

export const loadErrorEvent = (socket) => {
  return (dispatch) => {
    socket.on(GAME_ERROR_EVENT,(res)=>{
      dispatch(getErrorAction(res))
    })
  }
}
