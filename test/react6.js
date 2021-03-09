import React from 'react'
import { Board } from "../src/client/components/Board"
import expect from "expect"

import { fireEvent } from '@testing-library/react'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

describe('<Board />', () => {

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
          name: 'player_name'
        }
      ],
      admin: 'player_name'
    }
    const room = 'room_0';
    const player_name = 'player_name';

    act(() => {
      render(
        <Board game={game}
             room={room}
             player_name={player_name}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='board']").textContent
    ).toEqual("Board");

    expect(
      container.querySelector("[data-testid='game_id']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_title']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_users']").textContent
    ).toEqual("1 players");

    expect(
      container.querySelector("[data-testid='game_launch']").textContent
    ).toEqual("Launch");
  })

  it("render properly with no admin", () => {
    const game = {
      id: 'room_0',
      launched: false,
      users: [
        {
          name: 'player_name'
        }
      ],
      admin: 'player_name_2'
    }
    const room = 'room_0';
    const player_name = 'player_name';

    act(() => {
      render(
        <Board game={game}
             room={room}
             player_name={player_name}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='game_id']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_title']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_users']").textContent
    ).toEqual("1 players");

    expect(
      container.querySelector("[data-testid='game_launch']")
    ).toEqual(null);
  })
});
