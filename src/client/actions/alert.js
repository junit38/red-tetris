export const ALERT_POP = 'ALERT_POP'
export const GET_GAMES_EVENT = "getGames";

export const alert = (message) => {
  return {
    type: ALERT_POP,
    message: message
  }
}

/* Used only by actions for sockets */
export const initialItems = (res) => ({
  type: "INITIAL_ITEMS",
  items: res
})

export const loadInitialDataSocket = (socket) => {
  return (dispatch) => {
    // dispatch(clearAllItems())
    socket.on(GET_GAMES_EVENT,(res)=>{
       console.dir(res)
       dispatch(initialItems(res))
     })
  }
}
