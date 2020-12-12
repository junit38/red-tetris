import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const LAUNCH_GAME_EVENT = "launchGame";
const GET_GAME_EVENT = "getGame";
const GAME_ERROR_EVENT = "gameError";

const getGame = (room, player_name) => {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [launched, setLaunched] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room, player_name },
    });

    socketRef.current.on(GET_GAME_EVENT, (data) => {
      setGame(data);
    });

    socketRef.current.on(GAME_ERROR_EVENT, (data) => {
      setError(data.message)
    });

    socketRef.current.emit(GET_GAME_EVENT);

    return () => {
      socketRef.current.disconnect();
    };
  }, [room, player_name]);

  const launchGame = () => {
    const setLaunchedToTrue = setLaunched(true);
    socketRef.current.emit(LAUNCH_GAME_EVENT, setLaunchedToTrue);
  }

  return { game, error, launched, launchGame };
};

export default getGame;
