import React, {useEffect,useState} from 'react'

export const Game = (props) => {
  const game = props.game;
  const [show, setShow] = useState(false);
  const [piece, setPiece] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tetrisElem, setTetrisElem] = useState([]);
  let tetris = [];

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

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

  if (!pieces.length)
    setPieces([{
      form: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      x: 19,
      y: 0,
      color: "orange"
    }]);

  game.piecesWaiting = [];
  game.piecesWaiting.push({
    form: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    x: 0,
    y: 4,
    color: "red"
  });

  if (!piece)
    setPiece(game.piecesWaiting[0]);

  const isInPiece = (piece, i, j) => {
    for (let k = 0; k < piece.form.length; k++)
    {
      for (let l = 0; l < piece.form[k].length; l++)
      {
        if (piece.form[k][l] == 1)
        {
          if (piece.y + l == j && piece.x + k == i)
            return true;
        }
      }
    }
  }

  const getContainPiece = (i, j, checkMainPiece) => {
    let containPiece = null;
    if (pieces)
    {
      pieces.forEach(function(piece) {
        if (isInPiece(piece, i, j))
          containPiece = piece;
      })
    }
    if (piece && checkMainPiece && isInPiece(piece, i, j))
      containPiece = piece
    return containPiece;
  }

  const canMoveDown = () => {
    let can = true;
    for (let i = 0; i < piece.form.length; i++)
    {
      for (let j = 0; j < piece.form[i].length; j++)
      {
        let containPiece = getContainPiece(piece.x + i + 1, piece.y + j, false);
        if (piece.form[i][j] == 1 && containPiece)
          can = false;
      }
    }
    return can;
  }

  const canMoveLeft = () => {
    let can = true;
    for (let i = 0; i < piece.form.length; i++)
    {
      for (let j = 0; j < piece.form[i].length; j++)
      {
        let containPiece = getContainPiece(piece.x + i, piece.y + j - 1, false);
        if (piece.form[i][j] == 1 && containPiece)
          can = false;
      }
    }
    return can;
  }

  const canMoveRight = () => {
    let can = true;
    for (let i = 0; i < piece.form.length; i++)
    {
      for (let j = 0; j < piece.form[i].length; j++)
      {
        let containPiece = getContainPiece(piece.x + i, piece.y + j + 1, false);
        if (piece.form[i][j] == 1 && containPiece)
          can = false;
      }
    }
    return can;
  }

  const checkPiece = () => {
    if (piece.x == 19 || !canMoveDown())
    {
      let piecesDuplicate = pieces;
      piecesDuplicate.push({...piece});
      setPieces(piecesDuplicate);
      piece.x = 0;
      piece.y = 4;
      setPiece(piece);
    }
  }

  const handleKeyDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const KEY_LEFT_EVENT = 37;
    const KEY_UP_EVENT = 38;
    const KEY_RIGHT_EVENT = 39;
    const KEY_DOWN_EVENT = 40;
    if (event.keyCode == KEY_LEFT_EVENT) {
      if (piece.y > 0 && canMoveLeft())
        piece.y--;
    }
    else if (event.keyCode == KEY_RIGHT_EVENT) {
      if (piece.y + piece.form[0].length < 10 && canMoveRight())
        piece.y++;
    }
    else if (event.keyCode == KEY_DOWN_EVENT) {
      if (piece.x < 19 && canMoveDown())
        piece.x++;
    }
    setPiece(piece);
    setTetrisElem(getTetris());
    checkPiece();
  }

  const getTetris = () => {
    tetris = [];
    for (let i = 0; i < 20; i++)
    {
      let tetrisLine = [];
      for (let j = 0; j < 10; j++)
      {
        let brick = <div className="brick" style={brickStyle} key={j}></div>
        let containPiece = getContainPiece(i, j, true);
        if (containPiece) {
          let style = {...brickStyle};
          style.backgroundColor = containPiece.color;
            brick = <div className="brick" style={style} key={j}></div>
        }
        tetrisLine.push(brick)
      }
      tetris.push(<div className="line" style={lineStyle} key={i}>
        {tetrisLine}
        </div>)
    }
    return tetris;
  }

  if (!tetrisElem.length)
    setTetrisElem(getTetris());

  return (
    <div className="jumbotron" onKeyDown={handleKeyDown}>
      <h3>{game.users.length}</h3>
      {show ? piece.x + ' ' + piece.y : ''}
      <div className="tetris" style={tetrisStyle}>{tetrisElem}</div>
    </div>
  )
}
