import React from 'react'
import { Game } from "../src/client/components/Game"
import expect from "expect"

import { fireEvent } from '@testing-library/react'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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

  it("render properly with user blocks", () => {
    const game = {
      id: 'room_0',
      launched: false,
      users: [
        {
          name: 'player_name',
          lines: 20,
          blocks: 1,
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

    const getSocketRef = function() {
    }

    const getNewPiece = function() {
    }

    act(() => {
      render(
        <Game game={game}
             piece={null}
             user={game.users[0]}
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
      container.querySelector("[data-testid='block_0']").textContent
    ).toEqual("");
  })

  it("render properly with a piece", () => {
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

    const getSocketRef = function() {
      return null;
    }

    const getNewPiece = function() {
    }

    const sendLines = function() {
    }

    const piece = {
        "form":[
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        "forms": [
          [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
          ],
          [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
          ],
          [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
          ],
          [
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
          ]
        ],
        "rotation": 0,
        "x":0,
        "y":4,
        "color": "cyan"
    }

    act(() => {
      render(
        <Game game={game}
             piece={piece}
             player_name={player_name}
             getSocketRef={getSocketRef}
             getNewPiece={getNewPiece}
             sendLines={sendLines}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='line_19']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='brick_piece_1_4']").textContent
    ).toEqual("");

    act(() => {
      document.dispatchEvent(new window.KeyboardEvent("keydown", {'keyCode': 40}));
    });

    expect(
      container.querySelector("[data-testid='brick_piece_2_4']").textContent
    ).toEqual("");

    act(() => {
      document.dispatchEvent(new window.KeyboardEvent("keydown", {'keyCode': 37}));
    });

    expect(
      container.querySelector("[data-testid='brick_piece_2_3']").textContent
    ).toEqual("");

    act(() => {
      document.dispatchEvent(new window.KeyboardEvent("keydown", {'keyCode': 39}));
    });

    expect(
      container.querySelector("[data-testid='brick_piece_2_7']").textContent
    ).toEqual("");

    act(() => {
      document.dispatchEvent(new window.KeyboardEvent("keydown", {'keyCode': 38}));
    });

    expect(
      container.querySelector("[data-testid='brick_piece_1_5']").textContent
    ).toEqual("");

    act(() => {
      document.dispatchEvent(new window.KeyboardEvent("keydown", {'keyCode': 32}));
    });

    expect(
      container.querySelector("[data-testid='brick_piece_19_5']").textContent
    ).toEqual("");
  })
});
