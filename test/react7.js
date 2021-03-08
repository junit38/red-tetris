import React from 'react'
import { Spectrum } from "../src/client/components/Spectrum"
import expect from "expect"

import { fireEvent } from '@testing-library/react'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

describe('<Spectrum />', () => {

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

    act(() => {
      render(
        <Spectrum game={game}
             player_name={player_name}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='username']").textContent
    ).toEqual("player_name_2");

    expect(
      container.querySelector("[data-testid='line_19']").textContent
    ).toEqual("");
  })

  it("render properly with blocks", () => {
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
          blocks: 2,
          playing: true
        }
      ],
      admin: 'player_name'
    }
    const player_name = 'player_name';

    act(() => {
      render(
        <Spectrum game={game}
             player_name={player_name}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='username']").textContent
    ).toEqual("player_name_2");

    expect(
      container.querySelector("[data-testid='line_17']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='line_occupied_19']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='line_occupied_18']").textContent
    ).toEqual("");
  })

  it("render properly with blocks and lines", () => {
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
          lines: 19,
          blocks: 1,
          playing: true
        }
      ],
      admin: 'player_name'
    }
    const player_name = 'player_name';

    act(() => {
      render(
        <Spectrum game={game}
             player_name={player_name}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='username']").textContent
    ).toEqual("player_name_2");

    expect(
      container.querySelector("[data-testid='line_17']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='line_occupied_19']").textContent
    ).toEqual("");

    expect(
      container.querySelector("[data-testid='line_occupied_18']").textContent
    ).toEqual("");
  })
});
