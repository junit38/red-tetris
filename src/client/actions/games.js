export const GET_GAMES_EVENT = "getGames";
export const GET_GAME_ID_EVENT = "getGameId";

export const getGamesAction = (res) => ({
  type: "GET_GAMES",
  games: res
})

export const loadGamesEvent = (socket) => {
  return (dispatch) => {
    socket.on(GET_GAMES_EVENT,(res)=>{
      dispatch(getGamesAction(res))
    })
  }
}

