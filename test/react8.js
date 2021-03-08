import React from 'react'
import { Game } from "../src/client/components/Game"
import expect from "expect"

import { fireEvent } from '@testing-library/react'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import socketIOClient from "socket.io-client";
import '../src/client/global';

import { startServer } from './helpers/server'
import params from '../params'

describe('<Game />', () => {

  let container = null;
  beforeEach(() => {
    // met en place un élément DOM comme cible de rendu
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // nettoie en sortie de test
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  let tetrisServer
  before(cb => startServer( params.server, function(err, server){
    tetrisServer = server
    cb()
  }))

  after(function(done){tetrisServer.stop(done)})


  it("render properly", () => {
    const game = {
      id: 'room_0',
      launched: false,
      users: [
        {
          name: 'player_name',
          lines: 20,
          blocks: 0,
          playing: true
        },
        {
          name: 'player_name_2',
          lines: 20,
          blocks: 0,
          playing: true
        }
      ],
      admin: 'player_name'
    }
    const player_name = 'player_name';

    const getSocketRef = function() {
      return {
        current: null
      };
    }

    const getNewPiece = function() {
      return null
    }

    act(() => {
      render(
        <Game game={game}
             player_name={player_name}
             getSocketRef={getSocketRef}
             getNewPiece={getNewPiece}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='line_19']").textContent
    ).toEqual("");
  })

  it("render properly 2", () => {
    const game = {
      id: 'room_0',
      launched: false,
      users: [
        {
          name: 'player_name',
          lines: 20,
          blocks: 0,
          playing: true
        },
        {
          name: 'player_name_2',
          lines: 20,
          blocks: 0,
          playing: true
        }
      ],
      admin: 'player_name'
    }
    const room = 'room_0';
    const player_name = 'player_name';

    const socketRef = {};
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room, player_name },
    });

    const getSocketRef = function() {
      return socketRef;
    }

    const getNewPiece = function() {
      socketRef.current.emit(NEW_PIECE_EVENT);
    }

    act(() => {
      render(
        <Game game={game}
             player_name={player_name}
             getSocketRef={getSocketRef}
             getNewPiece={getNewPiece}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='line_19']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='brick_piece']").textContent
    ).toEqual("");
  })
});
