import React, { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { Board } from './Board';
import { Game } from './Game';
import GameService from "../services/GameService";

export const Tetris = () => {
  const location = useLocation();
  const room = location.pathname.substring(1).split('[')[0]
  const player_name_unformated = location.pathname.substring(1).split('[')[1]
  const index = player_name_unformated.indexOf(']')
  const player_name = player_name_unformated.substring(0, index);
  const {game, error, launchGame, getNewPiece, gameOver, getSocketRef} = GameService(room, player_name)
  const [alertSended, setAlertSended] = useState(false);

  const getUser = (game) => {
    for (let i = 0; i < game.users.length; i++)
    {
      if (game.users[i].name == player_name)
        return game.users[i];
    }
    return (null);
  }

  const getUsersPlaying = (game) => {
    let usersPlaying = 0;
    if (game && game.users)
    {
      for (let i = 0; i < game.users.length; i++)
      {
        if (game.users[i].playing == true)
          usersPlaying++;
      }
    }
    return (usersPlaying);
  }

  const isGameOver = (game) => {
    const user = getUser(game, player_name);
    if (user && user.playing == false)
    {
      if (!alertSended)
      {
        setAlertSended(true);
        alert('Game Over');
      }
      return true;
    }
    else if (user && user.playing == true && getUsersPlaying(game) <= 1
      && game && getUsersPlaying(game) != game.users.length)
    {
      console.log(getUsersPlaying(game));
      console.log(game.users);
      alert('You Win');
    }
    return false;
  }

  const setGameOver = () => {
    if (isGameOver(game))
      setGameOver(true);
  }

  if (error)
    return (
      <div className="jumbotron">
        <h3>{error}</h3>
        <Link to={`/`}>
          Return
        </Link>
      </div>
      )
  else if (game && !game.launched)
    return (
      <Board launchGame={launchGame}
             game={game}
             room={room}
             player_name={player_name}
             isGameOver={isGameOver}/>
    )
  else if (game && game.launched && isGameOver(game))
    return (
      <div className="jumbotron">
        <h3>Game Over</h3>
        <p>Waiting for the end of the game...</p>
        <Link to={`/`}>
          Return
        </Link>
      </div>
      )
  else if (game && game.launched)
    return (
      <Game game={game}
            getNewPiece={getNewPiece}
            gameOver={gameOver}
            getSocketRef={getSocketRef}/>
    )
  else
    return (
      <div className="jumbotron">
        <h3>Loading...</h3>
      </div>
    )
}
