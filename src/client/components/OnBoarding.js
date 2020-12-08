import React, { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Games } from './Games';

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const GET_ROOM_ID_EVENT = "getRoomId";
const GET_GAMES_EVENT = "getGames";

export const OnBoarding = () => {
  const [login, setLogin] = useState(0);
  const [roomName, setRoomName] = useState(0);
  const [games, setGames] = useState(0);
  const [game, setGame] = useState(0);
  const socket = socketIOClient(SOCKET_SERVER_URL);
  let history = useHistory();

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
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
      {
        socket.on(GET_ROOM_ID_EVENT, (data) => {
          history.push(data.room + "[" + login + "]");
        });
        socket.emit(GET_ROOM_ID_EVENT, {});
      }
    }
  }

  const onChangeForm = (e) => {
    if (e.target.name === 'login') {
      setLogin(e.target.value)
    }
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
