const jsonPieces = require('../json/pieces.json')

class Piece {
  constructor() {
    let rand = Math.floor(Math.random() * jsonPieces.length);
    const data = jsonPieces[rand];
    this.form = data.form;
    this.forms = data.forms;
    this.rotation = data.rotation;
    this.x = data.x;
    this.y = data.y;
    this.color = data.color;
  }
}

module.exports = Piece;
