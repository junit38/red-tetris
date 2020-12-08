import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const LAUNCH_GAME_EVENT = "launchGame";
const GET_ROOM_ID_EVENT = "getRoomId";
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
  console.log(room);
  console.log(player_name);

  useEffect(() => {
    console.log(room, player_name);
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

export const Board = (props) => {
  const room = props.room;
  const player_name = props.player_name;
  const launchGame = props.launchGame;
  const game = props.game;

  return (
    <div>
      <h3>{room}</h3>
      <p>{player_name}</p>
      <p>{game && game.users ? game.users.length : 0} players</p>
      {game.admin == player_name ?
        <button onClick={launchGame}>Launch</button>
        : ''
      }
    </div>
  )
}

export const OnBoarding = ({onBoard}) => {
  const [login, setLogin] = useState(0);
  const [roomName, setRoomName] = useState(0);
  let history = useHistory();

  const handleClick = () => {
    const socket = socketIOClient(SOCKET_SERVER_URL);
    socket.emit(GET_ROOM_ID_EVENT, {});
    socket.on(GET_ROOM_ID_EVENT, (data) => {
      history.push(data.room + "[" + login + "]");
    });
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
    </div>
  )
}
