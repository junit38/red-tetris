import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { Board } from './Board';
import getGame from "../services/getGame";

export const Tetris = () => {
  const location = useLocation();
  const room = location.pathname.substring(1).split('[')[0]
  const player_name_unformated = location.pathname.substring(1).split('[')[1]
  const index = player_name_unformated.indexOf(']')
  const player_name = player_name_unformated.substring(0, index);
  const {game, error, launched, launchGame} = getGame(room, player_name)

  if (error)
    return (
      <div>
        <h2>{error}</h2>
        <Link to={`/`}>
          Return
        </Link>
      </div>
      )
  else if (!launched && game)
    return (
      <Board launchGame={launchGame} game={game} room={room} player_name={player_name}/>
    )
  else if (launched)
    return (
      <div>Launched</div>
    )
  else
    return (
      <div>Loading...</div>
    )
}
