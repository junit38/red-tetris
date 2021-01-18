import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const GET_GAME_ID_EVENT = "getGameId";
const GET_GAMES_EVENT = "getGames";

import '../global'
import {loadGamesEvent, getGamesEvent, getGameIdEvent} from '../actions/games'
import {useStore} from 'react-redux';

const GamesService = () => {
  const socketRef = useRef();
  const store = useStore();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    store.dispatch(loadGamesEvent(socketRef.current));

    socketRef.current.emit(GET_GAMES_EVENT)

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getGameId = () => {
    socketRef.current.emit(GET_GAME_ID_EVENT)
  };

  const getSocketRef = () => {
    return socketRef;
  }

  return { getGameId, getSocketRef };
};

export default GamesService;
