import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const GET_GAME_ID_EVENT = "getGameId";
const GET_GAMES_EVENT = "getGames";
const SOCKET_SERVER_URL = "http://localhost:3004";

const GamesService = () => {
  const [gameId, setGameId] = useState(null);
  const [games, setGames] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(GET_GAME_ID_EVENT, (data) => {
      setGameId(data.room)
    });

    socketRef.current.on(GET_GAMES_EVENT, (data) => {
      setGames(data);
    });

    socketRef.current.emit(GET_GAMES_EVENT);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getGameId = () => {
    socketRef.current.emit(GET_GAME_ID_EVENT);
  };

  return { games, gameId, getGameId };
};

export default GamesService;
