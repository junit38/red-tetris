import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { Board } from './Board';

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const LAUNCH_GAME_EVENT = "launchGame";
const GET_GAME_EVENT = "getGame";
const GAME_ERROR_EVENT = "gameError";

export const Tetris = () => {
  const location = useLocation();
  const room = location.pathname.substring(1).split('[')[0]
  const player_name_unformated = location.pathname.substring(1).split('[')[1]
  const index = player_name_unformated.indexOf(']')
  const player_name = player_name_unformated.substring(0, index);
  const socketRef = useRef();
  const [launched, setLaunched] = useState(0);
  const [game, setGame] = useState(0);
  const [error, setError] = useState(0);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room, player_name },
    });

    setLaunched(false);
    socketRef.current.on(LAUNCH_GAME_EVENT, (data) => {
      setLaunched(true);
    });

    setGame({});
    socketRef.current.on(GET_GAME_EVENT, (data) => {
      setGame(data);
      console.log('getGame');
      console.log(data);
    });

    setError(null);
    socketRef.current.on(GAME_ERROR_EVENT, (data) => {
      setError(data.message)
    });

    if (!game)
      socketRef.current.emit(GET_GAME_EVENT, {});

    return () => {
      socketRef.current.disconnect();
    };
  }, [room, player_name]);

  const launchGame = () => {
    console.log("launch Game");
    socketRef.current.emit(LAUNCH_GAME_EVENT, {});
  }

  if (error)
    return (
      <div>
        <h2>{error}</h2>
        <Link to={`/`}>
          Return
        </Link>
      </div>
      )
  else if (!launched)
    return (
      <Board launchGame={launchGame} game={game} room={room} player_name={player_name}/>
    )
  else
    return (
      <div>Launched</div>
    )
}
