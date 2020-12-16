import React, {useEffect,useState} from 'react'

const NEW_PIECE_EVENT = "newPiece";

export const Game = (props) => {
  const game = props.game;
  const getNewPiece = props.getNewPiece;
  const getSocketRef = props.getSocketRef;
  const [pieces, setPieces] = useState([]);
  const [piecesWaiting, setPiecesWaiting] = useState([]);
  const [tetrisElem, setTetrisElem] = useState([]);
  const socketRef = getSocketRef();
  let tetris = [];
  let piece = null;
  let piecesWaitingDuplicate;

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);

    getNewPiece();

    socketRef.current.on(NEW_PIECE_EVENT, (data) => {
      let piecesDuplicate = piecesWaiting;
      piecesDuplicate.push({...data});
      setPiecesWaiting(piecesDuplicate);
      if (!piece)
      {
        let piecesDuplicate = piecesWaiting;
        piece = piecesDuplicate.shift();
        setPiecesWaiting(piecesDuplicate);
        setTetrisElem(getTetris());
      }
    });

    const interval = setInterval(() => {
      checkPiece();
      if (piece.x + getFormLength(piece) - 1 < 19 && canMoveDown())
        piece.x++;
      setTetrisElem(getTetris());
    }, 1000);

    return () => {
      clearInterval(interval);
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
    if (piece.x + getFormLength(piece) - 1 == 19 || !canMoveDown())
    {
      let piecesDuplicate = pieces;
      piecesDuplicate.push(piece);
      setPieces(piecesDuplicate);
      if (!piecesWaiting.length)
        getNewPiece()
      else
      {
        piecesDuplicate = piecesWaiting;
        piece = piecesDuplicate.shift();
        setPiecesWaiting(piecesDuplicate);
        setTetrisElem(getTetris());
      }
    }
  }

  const getFormLength = (piece) => {
    let size = 0;
    for (let i = 0; i < piece.form.length; i++)
    {
      let contain = false
      for (let j = 0; j < piece.form[i].length; j++)
      {
        if (piece.form[i][j] == 1)
          contain = true;
      }
      if (contain)
        size++;
    }
    return (size)
  }

  const handleKeyDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const KEY_SPACE_EVENT = 32;
    const KEY_LEFT_EVENT = 37;
    const KEY_UP_EVENT = 38;
    const KEY_RIGHT_EVENT = 39;
    const KEY_DOWN_EVENT = 40;
    if (event.keyCode == KEY_SPACE_EVENT)
    {
      while (piece.x + getFormLength(piece) - 1 < 19 && canMoveDown())
        piece.x++;
    }
    else if (event.keyCode == KEY_LEFT_EVENT) {
      if (piece.y > 0 && canMoveLeft())
        piece.y--;
    }
    else if (event.keyCode == KEY_RIGHT_EVENT) {
      if (piece.y + piece.form[0].length < 10 && canMoveRight())
        piece.y++;
    }
    else if (event.keyCode == KEY_DOWN_EVENT) {
      if (piece.x + getFormLength(piece) - 1 < 19 && canMoveDown())
        piece.x++;
    }
    setTetrisElem(getTetris());
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
      <h3>{piecesWaiting.length}</h3>
      <div className="tetris" style={tetrisStyle}>{tetrisElem}</div>
    </div>
  )
}