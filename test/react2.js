import React from 'react'
import {OnBoarding} from "../src/client/components/OnBoarding"
import {Games} from "../src/client/components/Games"
import {NavBar} from "../src/client/components/NavBar"
import {Tetris} from "../src/client/components/Tetris"
import {Board} from "../src/client/components/Board"

import expect from "expect"

import {fireEvent} from '@testing-library/react'

import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../src/client/reducers/index'
import { Provider } from 'react-redux'

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { MemoryRouter } from 'react-router-dom';

describe('<OnBoarding />', () => {

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
        <Provider store={store}><OnBoarding/></Provider>,
        container
      );
    });

    expect(
      container.querySelector("[data-testid='login']").textContent
    ).toEqual("Login");

    const button = document.querySelector("[data-testid='submit']");
    expect(button.innerHTML).toBe("Create Game");

    act(() => {
      button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });

    expect(
      container.querySelector("[data-testid='message']").textContent
    ).toEqual("Login required");

    const input = document.querySelector("[data-testid='input']");
    expect(input.value).toBe("");

    fireEvent.change(input, {target: { value: 'login' }})

    expect(input.value).toBe("login");

    act(() => {
      button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });
  })

  it("select game", () => {
    const initialState = { games: [{
      id: 'room_0',
      launched: false,
      users: []
    }], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )
    act(() => {
      render(
        <Provider store={store}><OnBoarding/></Provider>,
        container
      );
    });

    const button = document.querySelector("[data-testid='join']");
    expect(button.innerHTML).toBe("Join");

    act(() => {
      button.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });

    expect(
      container.querySelector("[data-testid='game_selected']").textContent
    ).toEqual("Room selected:");

    expect(
      container.querySelector("[data-testid='game_header']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_title']").textContent
    ).toEqual("room_0");

    expect(
      container.querySelector("[data-testid='game_players']").textContent
    ).toEqual("0 players");

    const button2 = document.querySelector("[data-testid='game_button']");
    expect(button2.innerHTML).toBe("Leave");

    act(() => {
      button2.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });

    expect(
      container.querySelector("[data-testid='game_header']")
    ).toBe(null);
  })
});

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
    const initialState = { games: [], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )

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
        <Provider store={store}>
          <Board game={game}
               room={room}
               player_name={player_name}/>
        </Provider>,
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
      container.querySelector("[data-testid='game_launch']").textContent
    ).toEqual("Launch");
  })

  it("render properly with no admin", () => {
    const initialState = { games: [], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )

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
        <Provider store={store}>
          <Board game={game}
               room={room}
               player_name={player_name}/>
        </Provider>,
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
