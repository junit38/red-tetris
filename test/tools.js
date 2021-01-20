import chai from "chai"
import {startServer, configureStore} from './helpers/server'
import rootReducer from '../src/client/reducers'
import {ping} from '../src/client/actions/server'
import io from 'socket.io-client'
import params from '../params'

const tools = require('../src/server/tools');
const Game = require('../src/server/classes/Game');

chai.should()

describe('Tools Test', function(){
  it('should not find game', function(done){
    const newGame = new Game('room_0');
    const games = [];
    games.push(newGame);
    const findedGame = tools.findGame(games, 'room_1');
    if (findedGame === null)
      done();
  });

  it('should find game', function(done){
    const newGame = new Game('room_0');
    const games = [];
    games.push(newGame);
    const findedGame = tools.findGame(games, 'room_0');
    if (findedGame.id === newGame.id)
      done();
  });

  it('should not find game index', function(done){
    const newGame = new Game('room_0');
    const games = [];
    games.push(newGame);
    const findedGameIndex = tools.getGameIndex(games, 'room_1');
    if (findedGameIndex === -1)
      done();
  });

  it('should find game index', function(done){
    const newGame = new Game('room_0');
    const games = [];
    games.push(newGame);
    const findedGameIndex = tools.getGameIndex(games, 'room_0');
    if (findedGameIndex === 0)
      done();
  });

  it('should not find user index', function(done){
    const newGame = new Game('room_0');
    const user = 'user';
    newGame.addUser(user);
    const findedUserIndex = tools.getUserIndex(newGame.users, 'user1');
    if (findedUserIndex === -1)
      done();
  });

  it('should find user index', function(done){
    const newGame = new Game('room_0');
    const user = 'user';
    newGame.addUser(user);
    const findedUserIndex = tools.getUserIndex(newGame.users, user);
    if (findedUserIndex === 0)
      done();
  });

  it('should get no user playing', function(done){
    const id = 'room_0'
    const newGame = new Game(id);
    const games = [];
    const user = 'user';
    games.push(newGame);
    games[0].addUser(user);
    const usersPlaying = tools.getUsersPlaying(games, id);
    if (usersPlaying === 0)
      done();
  });

  it('should get user playing', function(done){
    const id = 'room_0'
    const newGame = new Game(id);
    const games = [];
    const user0 = 'user0';
    const user1 = 'user1';
    games.push(newGame);
    games[0].addUser(user0);
    games[0].addUser(user1);
    games[0].users[0].playing = true;
    const usersPlaying = tools.getUsersPlaying(games, id);
    if (usersPlaying === 1)
      done();
  });

  it('should not find user', function(done){
    const newGame = new Game('room_0');
    const user = 'user';
    newGame.addUser(user);
    const findedUserIndex = tools.findUser(newGame, 'user1');
    if (findedUserIndex === -1)
      done();
  });

  it('should find user', function(done){
    const newGame = new Game('room_0');
    const user = 'user';
    newGame.addUser(user);
    const findedUserIndex = tools.findUser(newGame, user);
    if (findedUserIndex === 0)
      done();
  });


});
