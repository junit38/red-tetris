import React, {useEffect,useState} from 'react'

const NEW_PIECE_EVENT = "newPiece";

export const Game = (props) => {
  const game = props.game;
  const gameOver = props.gameOver;
  const getNewPiece = props.getNewPiece;
  const getSocketRef = props.getSocketRef;
  const [pieces, setPieces] = useState([]);
  const [piecesWaiting, setPiecesWaiting] = useState([]);
  const [tetrisElem, setTetrisElem] = useState([]);
  const socketRef = getSocketRef();
  let tetris = [];
  let piece = null;

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);

    getNewPiece();

    socketRef.current.on(NEW_PIECE_EVENT, (data) => {
      setTetrisElem(getTetris());
      piecesWaiting.push({...data});
      if (!piece)
      {
        piece = piecesWaiting.shift();
        checkGameOver(piece);
        setTetrisElem(getTetris());
      }
    });

    const interval = setInterval(() => {
      checkPiece();
      setTetrisElem(getTetris());
      if (piece && piece.x + getFormHight(piece.form) < 19 && canMoveDown(piece))
        piece.x++;
      setTetrisElem(getTetris());
    }, 1000);

    return () => {
      socketRef.current.off(NEW_PIECE_EVENT);
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

  const checkGameOver = (send) => {
    if (piece && containPieceForm(piece, piece.form))
      gameOver();
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

  const canRotate = () => {
    let rotation = piece.rotation;
    if (piece.rotation < 3)
      rotation++
    else
      rotation = 0;
    let form = piece.forms[rotation];
    if (piece.y + getFormLength(form) < 10
      && piece.x + getFormHight(form) < 19
      && piece.y + getFormLength(form) - getFormWidth(form) + 2 > 0
      && !containPieceForm(piece, form))
      return true;
    return false;
  }

  const canMoveDown = (piece) => {
    let can = true;
    for (let i = 0; i < piece.form.length; i++)
    {
      for (let j = 0; j < piece.form[i].length; j++)
      {
        let containPiece = getContainPiece(piece.x + i + 1, piece.y + j, false);
        if (piece.form[i][j] == 1 && containPiece && containPiece != piece)
          can = false;
      }
    }
    return can;
  }

  const canMoveLeft = (piece) => {
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

  const canMoveRight = (piece) => {
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

  const canBeReduced = (piece) => {
    let can = true;
    let stop = false
    for (let i = 0; i < piece.form.length && stop == false; i++)
    {
      for (let j = 0; j < piece.form[i].length && stop == false; j++)
      {
        if (piece.form[i][j] == -1)
          stop = true;
        else
        {
          let containPiece = getContainPiece(piece.x + i + 1, piece.y + j, false);
          if (piece.form[i][j] == 1 && containPiece && containPiece != piece)
            can = false;
        }
      }
    }
    return can;
  }

  const reducePiece = (piece, i) => {
    for (let k = i; k > 0; k--)
    {
      for (let l = 0; l < piece.form[k].length; l++)
      {
        piece.form[k][l] = piece.form[k - 1][l];
        piece.form[k - 1][l] = 0;
      }
    }
  }

  const toReducePiece = (piece) => {
    for (let i = 0; i < piece.form.length; i++)
    {
      for (let j = 0; j < piece.form[i].length; j++)
      {
        if (piece.form[i][j] == -1 && piece.form[i - 1]
          && piece.form[i - 1][j] == 1)
        {
          if (canBeReduced(piece))
            reducePiece(piece, i);
        }
      }
    }
    piece.toReduce = 0;
  }

  const hideLine = (line) => {
    pieces.forEach(function(piece) {
      for (let i = 0; i < piece.form.length; i++)
      {
        for (let j = 0; j < piece.form[i].length; j++)
        {
          if (piece.form[i][j] == 1 && piece.x + i == line)
          {
            piece.form[i][j] = -1;
            piece.toReduce = 1;
          }
        }
      }
    })
    setTimeout(function() {
      pieces.forEach(function(piece) {
        if (piece.toReduce)
          toReducePiece(piece);
        else if (piece.x + getFormHight(piece.form) < 19 && canMoveDown(piece))
          piece.x++;
      })
    }, 500);
  }

  const checkLines = () => {
    for (let i = 20; i >= 0; i--)
    {
      let line = true;
      for (let j = 0; j < 10; j++)
      {
        if (!getContainPiece(i, j, false))
          line = false;
      }
      if (line == true)
        hideLine(i);
    }
  }

  const checkPiece = () => {
    if (piece.x + getFormHight(piece.form) == 19 || !canMoveDown(piece))
    {
      pieces.push(piece);
      piece = null;
      if (!piecesWaiting.length)
        getNewPiece()
      else
      {
        piece = piecesWaiting.shift();
        checkGameOver(piece);
        setTetrisElem(getTetris());
      }
      checkLines();
    }
  }

  const getFormHight = (form) => {
    let size = 0;
    for (let i = 0; i < form.length; i++)
    {
      let contain = false
      for (let j = 0; j < form[i].length; j++)
      {
        if (form[i][j] == 1)
          contain = true;
      }
      if (contain)
        size = i;
    }
    return (size)
  }

  const getFormLength = (form) => {
    let size = 0;
    for (let i = 0; i < form.length; i++)
    {
      let local_size = 0
      for (let j = 0; j < form[i].length; j++)
      {
        if (form[i][j] == 1)
          local_size = j;
      }
      if (local_size > size)
        size = local_size;
    }
    return (size)
  }

  const getFormWidth = (form) => {
    let size = 0;
    let start = 4;
    let end = -1;
    for (let i = 0; i < form.length; i++)
    {
      for (let j = 0; j < form[i].length; j++)
      {
        if (form[i][j] == 1)
        {
          if ((j < start) == true)
            start = j;
          if ((j > end) == true)
            end = j;
        }
      }
    }
    size = (end + 1) - start;
    return (size)
  }

  const containPieceForm = (piece, form) => {
    let contain = false;
    for (let i = 0; i < form.length; i++)
    {
      for (let j = 0; j < form[i].length; j++)
      {
        let containPiece = getContainPiece(piece.x + i, piece.y + j, false);
        if (form[i][j] == 1 && containPiece)
          contain = true;
      }
    }
    return contain;
  }

  const handleKeyDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const KEY_SPACE_EVENT = 32;
    const KEY_LEFT_EVENT = 37;
    const KEY_UP_EVENT = 38;
    const KEY_RIGHT_EVENT = 39;
    const KEY_DOWN_EVENT = 40;
    if (!piece)
      return ;
    if (event.keyCode == KEY_SPACE_EVENT)
    {
      while (piece.x + getFormHight(piece.form) < 19 && canMoveDown(piece))
        piece.x++;
      checkPiece();
    }
    if (event.keyCode == KEY_UP_EVENT)
    {
      if (canRotate())
      {
        if (piece.rotation < 3)
          piece.rotation++
        else
          piece.rotation = 0;
        piece.form = piece.forms[piece.rotation];
      }
    }
    else if (event.keyCode == KEY_LEFT_EVENT) {
      if (piece.y + getFormLength(piece.form) - getFormWidth(piece.form) + 1 > 0 && canMoveLeft(piece))
        piece.y--;
    }
    else if (event.keyCode == KEY_RIGHT_EVENT) {
      if (piece.y + getFormLength(piece.form) < 9 && canMoveRight(piece))
        piece.y++;
    }
    else if (event.keyCode == KEY_DOWN_EVENT) {
      if (piece.x + getFormHight(piece.form) < 19 && canMoveDown(piece))
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
      <div className="tetris" style={tetrisStyle}>{tetrisElem}</div>
    </div>
  )
}
