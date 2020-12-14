import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { Board } from './Board';
import GameService from "../services/GameService";

export const Tetris = () => {
  const location = useLocation();
  const room = location.pathname.substring(1).split('[')[0]
  const player_name_unformated = location.pathname.substring(1).split('[')[1]
  const index = player_name_unformated.indexOf(']')
  const player_name = player_name_unformated.substring(0, index);
  const {game, error, launched, launchGame} = GameService(room, player_name)

  if (error)
    return (
      <div class="jumbotron">
        <h3>{error}</h3>
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
      <div class="jumbotron">
        <h3>Loading...</h3>
      </div>
    )
}
