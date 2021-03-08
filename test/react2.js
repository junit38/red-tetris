import React from 'react'
import { NavBar } from "../src/client/components/NavBar"

import expect from "expect"

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

describe('<NavBar />', () => {

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
    act(() => {
      render(
        <NavBar/>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='brand']").textContent
    ).toEqual("Tetris");
  })
});
