import React, { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Games } from './Games';
import GamesService from "../services/GamesService";

import '../global';
import {useSelector} from 'react-redux';

export const OnBoarding = (props) => {
  const [login, setLogin] = useState('');
  const [game, setGame] = useState(null);
  const {getGameId, getSocketRef} = GamesService()
  const socketRef = getSocketRef();
  let history = useHistory();
  let games = [];

  games = useSelector(state=>state.games);

  useEffect(() => {
    socketRef.current.on(GET_GAME_ID_EVENT, (res)=>{
      history.push(res.room + "[" + login + "]");
    });

    return () => {
      socketRef.current.off(GET_GAME_ID_EVENT);
    };
  }, [])

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
    <div className="jumbotron">
      <fieldset>
        <div className="form-group">
          <label htmlFor="login">Login</label>
          <input type="text" className="form-control" onChange={onChangeForm} name="login" id="login" placeholder="Enter login"/>
          <button type="submit" className="btn btn-primary" onClick={handleClick}>
            { game ? "Join Game" : "Create Game" }
          </button>
        </div>
      </fieldset>
      { game ?
        <div>
          <h3>Room selected:</h3>
          <div className="card text-white bg-primary mb-3" style={{maxWidth: "20rem"}}>
            <div className="card-header">{game.id}</div>
            <div className="card-body">
              <h4 className="card-title">{game.id}</h4>
              <p className="card-text">{game.users.length} players</p>
              <button type="button" className="btn btn-secondary" onClick={unselectGame}>Leave</button>
            </div>
          </div>
        </div>
       : '' }
      <Games games={games} selectGame={selectGame}/>
    </div>
  )
}
