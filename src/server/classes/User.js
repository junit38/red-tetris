class User {
  constructor(name) {
    this.name = name;
    this.lines = 20;
    this.blocks = 0;
    this.playing = false;
    this.waiting = false;
  }

  reset() {
    this.lines = 20;
    this.blocks = 0;
    this.playing = false;
    this.waiting = false;
  }

  startPlaying() {
    this.playing = true;
    this.waiting = false;
  }

  stopPlaying() {
    this.playing = false;
  }

  setLines(lines) {
    this.lines = lines;
  }

  addBlocks(blocks) {
    this.blocks += blocks;
  }
}

module.exports = User;
