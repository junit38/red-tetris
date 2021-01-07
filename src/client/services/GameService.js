import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://0.0.0.0:3004";
const LAUNCH_GAME_EVENT = "launchGame";
const GET_GAME_EVENT = "getGame";
const GAME_ERROR_EVENT = "gameError";
const NEW_PIECE_EVENT = "newPiece";
const GAME_OVER_EVENT = "gameOver";
const SEND_BLOCKS_EVENT = "sendBlocks";
const SEND_LINES_EVENT = "sendLines";
const RESET_GAME_EVENT = "resetGame";

const GameService = (room, player_name) => {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room, player_name },
    });

    socketRef.current.on(GET_GAME_EVENT, (data) => {
      setGame(data);
      console.log('Get Game Event')
      console.log(data);
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

  return { game, error, launchGame, getNewPiece, gameOver, sendBlocks, sendLines, getSocketRef, resetGame };
};

export default GameService;
