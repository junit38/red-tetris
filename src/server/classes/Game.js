const User = require('./User')

class Game {
  constructor(id) {
    this.id = id;
    this.launched = false;
    this.admin = null;
    this.users = [];
    this.piecesWaiting = [];
  }

  addUser(user) {
    if (this.admin == null)
      this.admin = user;
    const newUser = new User(user)
    this.users.push(newUser);
  }

  getUserIndex(user) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].name == user)
        return (i);
    }
  return (-1);
  }

  removeUser(user) {
    const userIndex = this.getUserIndex(user);
    this.users.splice(userIndex, 1);
    if (this.admin == user)
      this.admin = null;
    if (this.admin == null && this.users[0])
      this.admin = this.users[0].name;
  }

  launch() {
    this.launched = true;
  }

  stop() {
    this.launched = false;
  }

  resetUsers() {
    this.users.forEach(function(user){
      user.reset();
    });
  }

  startPlaying () {
    this.users.forEach(function(user){
      user.startPlaying();
    });
  }

  addUsersBlocks(sender, blocks) {
    this.users.forEach(function(user) {
      if (user.name != sender)
        user.addBlocks(blocks);
    });
  }

  setUserLines(userName, lines) {
    this.users.forEach(function(user) {
      if (user.name == userName)
        user.setLines(lines);
    });
  }

  stopUserPlaying(userName) {
    this.users.forEach(function(user) {
      if (user.name == userName)
        user.stopPlaying()
    });
  }
}

module.exports = Game;
