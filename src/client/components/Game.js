import React, {useEffect} from 'react'

export const Game = (props) => {
  const game = props.game;
  let tetris = [];

  const tetrisStyle = {
    marginLeft: "auto",
    marginRight: "auto",
    width: "auto"
  }

  const lineStyle = {
    height: "20px"
  }

  const brickStyle = {
    width: "20px",
    height: "20px",
    border: "0.5px solid gray",
    display: "inline-block"
  }

  useEffect(() => {

  })

  game.pieces = [];
  game.pieces.push({
    form: [1, 1, 1, 1],
    x: 0,
    y: 4,
    color: "red"
  });

  const isInPiece = (piece, i, j) => {
    for (let k = 0; k < piece.form.length; k++)
    {
      if (piece.form[k] == 1)
      {
        console.log('here');
        if (piece.y + k == j && piece.x == i)
          return true;
      }
    }
  }

  for (let i = 0; i < 20; i++)
  {
    let tetrisLine = [];
    for (let j = 0; j < 10; j++)
    {
      if (game.pieces) {
        game.pieces.forEach(function(piece) {
          if (isInPiece(piece, i, j))
          {
            let style = {...brickStyle};
            style.backgroundColor = piece.color;
            tetrisLine.push(
              <div className="brick" style={style} key={j}></div>
            )
          }
          else {
            tetrisLine.push(
            <div className="brick" style={brickStyle} key={j}></div>
            )
          }
        })
      }
      else {
        tetrisLine.push(
        <div className="brick" style={brickStyle} key={j}></div>
        )
      }
    }
    tetris.push(<div className="line" style={lineStyle} key={i}>
      {tetrisLine}
      </div>)
  }

  return (
    <div className="jumbotron">
      <h3>{game.users.length}</h3>
      <div className="tetris" style={tetrisStyle}>{tetris}</div>
    </div>
  )
}
