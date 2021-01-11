import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

import '../global';
import {loadGameEvent, loadErrorEvent, getGameEvent} from '../actions/game'
import {useStore} from 'react-redux';

const GameService = (room, player_name) => {
  const socketRef = useRef();
  const store = useStore();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room, player_name },
    });

    store.dispatch(loadGameEvent(socketRef.current));
    store.dispatch(loadErrorEvent(socketRef.current));

    socketRef.current.emit(GET_GAME_EVENT);

    return () => {
      socketRef.current.disconnect();
    };
  }, [room, player_name]);

  const launchGame = () => {
    socketRef.current.emit(LAUNCH_GAME_EVENT);
  }

  const getNewPiece = () => {
    socketRef.current.emit(NEW_PIECE_EVENT);
  }

  const gameOver = () => {
    socketRef.current.emit(GAME_OVER_EVENT);
  }

  const sendBlocks = (blocks) => {
    socketRef.current.emit(SEND_BLOCKS_EVENT, blocks);
  }

  const sendLines = (lines) => {
    socketRef.current.emit(SEND_LINES_EVENT, lines);
  }

  const resetGame = (lines) => {
    socketRef.current.emit(RESET_GAME_EVENT);
  }

  const getSocketRef = () => {
    return socketRef;
  }

  return { launchGame, getNewPiece, gameOver, sendBlocks, sendLines, getSocketRef, resetGame };
};

export default GameService;
