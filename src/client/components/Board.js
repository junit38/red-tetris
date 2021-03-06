import React from 'react'

export const Board = (props) => {
  const room = props.room;
  const player_name = props.player_name;
  const launchGameBoard = props.launchGameBoard;
  const isGameOver = props.isGameOver;
  const game = props.game;

  return (
    <div className="jumbotron">
      <div className="card border-primary mb-3">
        <div className="card-header">{game.id}</div>
        <div className="card-body">
          <h4 className="card-title">{game.id}</h4>
          <p className="card-text">{game.users.length} players</p>
          { game && game.admin && game.admin == player_name && game.launched == false ?
            <button type="button" className="btn btn-secondary" onClick={launchGameBoard}>Launch</button>
          : '' }
        </div>
      </div>
    </div>
  )
}
