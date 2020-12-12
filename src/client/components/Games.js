import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client";

export const Games = (props) => {
  const games = props.games
  const selectGame = props.selectGame;
  let elems = [];

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

  if (games.length)
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
