import chai from "chai"
import {startServer, configureStore} from './helpers/server'
import rootReducer from '../src/client/reducers'
import {ping} from '../src/client/actions/server'
import io from 'socket.io-client'
import params from '../params'

const Piece = require('../src/server/classes/Piece')
const User = require('../src/server/classes/User')
const Game = require('../src/server/classes/Game')

chai.should()

describe('Classes Test', function(){
  it('should create a piece', function(done){
    const piece = new Piece();
    if (piece.form !== undefined && piece.forms !== undefined && piece.rotation !== undefined &&
      piece.x !== undefined && piece.y !== undefined && piece.color !== undefined)
      done();
  });

  it('should create a user', function(done){
    const name = 'name';
    const user = new User(name);
    if (user.name === name && user.lines === 20 && user.blocks === 0 &&
      user.playing === false && user.waiting === false)
      done();
  });

  it('should reset a user', function(done){
    const name = 'name';
    const user = new User(name);
    user.lines = 10;
    user.blocks = 10;
    user.playing = true;
    user.waiting = true;
    user.reset();
    if (user.lines === 20 && user.blocks === 0 &&
      user.playing === false && user.waiting === false)
      done();
  });

  it('should create a game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    if (game.id === id && game.launched === false &&
    game.admin === null && typeof game.users === 'object' &&
    game.users.length === 0 && typeof game.piecesWaiting === 'object' &&
    game.piecesWaiting.length === 0)
      done();
  });

  it('should add an user to game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user = 'user';
    game.addUser(user);
    if (game.users.length === 1 && typeof game.users[0] === 'object' &&
      game.users[0].name === user && game.admin === user)
      done();
  });

  it('should add an other user to game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    if (game.users.length === 2 && typeof game.users[1] === 'object' &&
      game.users[1].name === user1 && game.admin === user0)
      done();
  });

  it('should not get user index', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user = 'user';
    game.addUser(user);
    const index = game.getUserIndex('user1');
    if (index === -1)
      done();
  });

  it('should get user index', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user = 'user'
    game.addUser(user);
    const index = game.getUserIndex(user);
    if (index === 0)
      done();
  });

  it('should remove an user to game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user = 'user';
    game.addUser(user);
    game.removeUser(user);
    if (game.users.length === 0 && game.users[0] === undefined &&
      game.admin === null)
      done();
  });

  it('should remove an user to game and change admin', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    game.removeUser(user0)
    if (game.users.length === 1 && typeof game.users[0] === 'object' &&
      game.users[0].name === user1 && game.admin === user1)
      done();
  });

  it('should launch game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    game.launch();
    if (game.launched === true)
      done();
  });

  it('should stop game', function(done){
    const id = 'room_0';
    const game = new Game(id);
    game.launch();
    game.stop();
    if (game.launched === false)
      done();
  });

  it('should reset all the user', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    game.users[0].lines = 10;
    game.users[0].blocks = 10;
    game.users[0].playing = true;
    game.users[0].waiting = true;
    game.users[1].lines = 10;
    game.users[1].blocks = 10;
    game.users[1].playing = true;
    game.users[1].waiting = true;
    game.resetUsers();
    if (game.users[0].lines === 20 && game.users[0].blocks === 0 &&
      game.users[0].playing === false && game.users[0].waiting === false &&
      game.users[1].lines === 20 && game.users[1].blocks === 0 &&
      game.users[1].playing === false && game.users[1].waiting === false)
      done();
  });

  it('should start playing', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    game.startPlaying();
    if (game.users[0].playing === true && game.users[1].playing === true)
      done();
  });

  it('should send blocks', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    const user2 = 'user2';
    game.addUser(user0);
    game.addUser(user1);
    game.addUser(user2);
    game.addUsersBlocks(user0, 2);
    if (game.users[0].blocks === 0 && game.users[1].blocks === 2
      && game.users[2].blocks === 2)
      done();
  });

  it('should send blocks', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    game.setUserLines(user0, 18);
    if (game.users[0].lines === 18 && game.users[1].lines === 20)
      done();
  });

  it('should stop user playing', function(done){
    const id = 'room_0';
    const game = new Game(id);
    const user0 = 'user0';
    const user1 = 'user1';
    game.addUser(user0);
    game.addUser(user1);
    game.startPlaying();
    game.stopUserPlaying(user0);
    if (game.users[0].playing === false && game.users[1].playing === true)
      done();
  });

});
