import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const GET_GAMES_EVENT = "getGames";

export const Games = (props) => {
  const selectGame = props.selectGame;
  const [games, setGames] = useState(0);
  let elems = [];
  const socket = socketIOClient(SOCKET_SERVER_URL);

  socket.on(GET_GAMES_EVENT, (data) => {
    setGames(data);
    for(let i = 0; i < data.length; i++)
    {
      if (data[i].launched == false)
        elems.push(
            <div key={i}>
              data[i].id
            </div>
        )
    }
  });

  useEffect(() => {
    if (!games.length)
      socket.emit(GET_GAMES_EVENT, {});

    return () => {
      socket.disconnect();
    };
  })

  const getGamesLength = () => {
    let length = 0;
    for (let i = 0; i < games.length; i++)
    {
      if (games[i].launched == false)
        length++;
    }
    return (length);
  }

  for (let i = 0; i < games.length; i++)
  {
    if (games[i].launched == false)
      elems.push(
        <div key={i} onClick={() => selectGame(games[i])}>
          {games[i].id}
        </div>
      )
  }

  if (games)
  {
    return (
      <div>
        <h3>{getGamesLength()} games:</h3>
        {elems}
      </div>
      )
  }
  else
    return (
      <div/>
    )
}
