import React from 'react'

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
