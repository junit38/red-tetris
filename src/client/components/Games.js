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
        <div className="card text-white bg-primary mb-3"
             style={{maxWidth: "20rem", minWidth: "20rem", display: "inline-block", marginRight: "20px"}}
             key={i}>
          <div className="card-header">{games[i].id}</div>
          <div className="card-body">
            <h4 className="card-title">{games[i].id}</h4>
            <p className="card-text">{games[i].users.length} players</p>
            <button type="button" className="btn btn-secondary" onClick={() => selectGame(games[i])}>Join</button>
          </div>
        </div>
      )
  }

  if (getGamesLength())
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
