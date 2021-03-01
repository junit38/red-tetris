import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client";

export const Games = (props) => {
  const games = props.games
  const selectGame = props.selectGame;
  let elems = [];

  const getGamesLength = (games) => {
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
          <div className="card-header" data-testid="header">{games[i].id}</div>
          <div className="card-body">
            <h4 className="card-title" data-testid="title">{games[i].id}</h4>
            <p className="card-text" data-testid="players">{games[i].users.length} players</p>
            <button type="button" data-testid="join" className="btn btn-secondary" onClick={() => selectGame(games[i])}>Join</button>
          </div>
        </div>
      )
  }

  if (getGamesLength(games))
  {
    return (
      <div>
        <h3 data-testid="games">{getGamesLength(games)} games:</h3>
        {elems}
      </div>
      )
  }
  else
    return (
      <div/>
    )
}
