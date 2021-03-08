import React from 'react'
import { Games } from "../src/client/components/Games"

import expect from "expect"

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

describe('<Games />', () => {

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
    const games = [{
      id: 'room_0',
      launched: false,
      users: []
    }]
    act(() => {
      render(
        <Games games={games}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='games']").textContent
    ).toEqual("1 games:");

    expect(
      container.querySelector("[data-testid='header']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='title']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='players']").textContent
    ).toEqual("0 players");

    expect(
      container.querySelector("[data-testid='join']").textContent
    ).toEqual("Join");
  })

  it("not render properly", () => {
    const games = []
    act(() => {
      render(
        <Games games={games}/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='games']")
    ).toBe(null);
  })
});
