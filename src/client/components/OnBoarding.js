import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Games } from './Games';
import GamesService from "../services/GamesService";

export const OnBoarding = () => {
  const [login, setLogin] = useState(0);
  const [game, setGame] = useState(0);
  const {gameId, getGameId, games, getGames} = GamesService()
  let history = useHistory();

  useEffect(() => {
    getGames();
    if (gameId) {
      history.push(gameId + "[" + login + "]");
    }
  })

  const selectGame = (game) => {
    setGame(game);
  }

  const unselectGame = () => {
    setGame(null);
  }

  const handleClick = (e) => {
    if (!login)
    {
      alert('Login required');
      e.preventDefault()
    }
    else
    {
      if (game)
        history.push(game.id + "[" + login + "]");
      else
        getGameId();
    }
  }

  const onChangeForm = (e) => {
    if (e.target.name === 'login')
      setLogin(e.target.value)
  }

  return (
    <div>
      <input type="text" onChange={onChangeForm} name="login" id="login"/>
      <button onClick={handleClick}>
        Join room
      </button>
      <div onClick={unselectGame}>{game ? game.id + ' selected' : ''}</div>
      <Games games={games} selectGame={selectGame}/>
    </div>
  )
}
