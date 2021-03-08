import React from 'react'
import { Tetris } from "../src/client/components/Tetris"
import expect from "expect"

import { fireEvent } from '@testing-library/react'

import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../src/client/reducers/index'
import { Provider } from 'react-redux'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { MemoryRouter } from 'react-router-dom';

describe('<Tetris />', () => {

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
    const initialState = { games: [], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='loading']").textContent
    ).toEqual("Loading...");
  })

  it("render properly with game", () => {
    const initialState = { games: [], game: {
      launched: true
    }, error: 'Test' }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='error']").textContent
    ).toEqual("Test");

    expect(
      container.querySelector("[data-testid='waiting_message']").textContent
    ).toEqual("Waiting for the end of the game");

    expect(
      container.querySelector("[data-testid='return']").textContent
    ).toEqual("Return");
  })

  it("render properly with not game", () => {
    const initialState = { games: [], game: null, error: 'Test' }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='error']").textContent
    ).toEqual("Test");

    expect(
      container.querySelector("[data-testid='return']").textContent
    ).toEqual("Return");
  })

  it("render properly with game", () => {
    const initialState = { games: [], game: {
      launched: false,
      users: []
    }, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='board']").textContent
    ).toEqual("Board");
  })

  it("render properly with game over", () => {
    const initialState = { games: [], game: {
      launched: true,
      users: [
        {
          name: 'player_name',
          playing: false
        }
      ]
    }, error: null }
    window.alert = () => {};

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='game_over']").textContent
    ).toEqual("Game Over");

    expect(
      container.querySelector("[data-testid='waiting_message']").textContent
    ).toEqual("Waiting for the end of the game...");

    expect(
      container.querySelector("[data-testid='return']").textContent
    ).toEqual("Return");
  })

  it("render properly with game win", () => {
    const initialState = { games: [], game: {
      launched: false,
      users: [
        {
          name: 'player_name',
          playing: true
        },
        {
          name: 'player_name_2',
          playing: false
        }
      ]
    }, error: null }
    window.alert = () => {};

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='board']").textContent
    ).toEqual("Board");
  })

  it("render properly with game win", () => {
    const initialState = { games: [], game: {
      launched: true,
      users: [
        {
          name: 'player_name',
          playing: true
        }
      ]
    }, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/room_0[player_name]']}>
            <Tetris/>
          </MemoryRouter>
        </Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='game']").textContent
    ).toEqual("Game");
  })
});
