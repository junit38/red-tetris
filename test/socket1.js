var expect = require('chai').expect;
var io     = require('socket.io-client');

var app = require('../src/server/index');
var params = require('../params.js')

import '../src/client/global.js'

var socketUrl = params.server.url;

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var room = 'lobby';

describe('Sockets', function () {
  var client1;

  it('should send and receive a message', function (done) {
    // Set up client1 connection
    client1 = io.connect(socketUrl);

    // Set up event listener.  This is the actual test we're running
    client1.on(GET_GAME_ID_EVENT, function(res){
      console.log(res)

      // Disconnect both client connections
      client1.disconnect();
      done();
    });

    client1.on('connect', function() {
      console.log('connect');
      client1.emit(GET_GAME_ID_EVENT);

      // Set up client2 connection
      // client2 = io.connect(socketUrl, options);

      // client2.on('connect', function(){

      //   // Emit event when all clients are connected.
      //   client2.emit('join room', room);
      //   client2.emit('message', 'test');
      // });

    });
  });
});
