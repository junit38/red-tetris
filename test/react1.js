import chai from "chai"
import React from 'react'
import {Tetris, Board} from "../src/client/components/test"
import {NavBar} from "../src/client/components/NavBar"
import {OnBoarding} from "../src/client/components/OnBoarding"

import { expect } from "chai"
import { shallow, configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() })

describe('<App />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Tetris/>)
    expect(wrapper.contains(<Board/>)).to.equal(true)
  })
})

describe('<Navbar />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<NavBar/>)
    expect(wrapper.contains(<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="#">Tetris</a>
    </nav>)).to.equal(true)
  })
})

import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from '../src/client/reducers/index'
import {render, fireEvent, cleanup} from '@testing-library/react';

describe('<OnBoarding />', () => {
  it('renders without crashing', () => {
    const initialState = { games: [], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )

    const wrapper = shallow(<Provider store={store}><OnBoarding/></Provider>)
    expect(wrapper.contains(<div className="jumbotron">
      <fieldset>
        <div className="form-group">
          <label htmlFor="login">Login</label>
          <input type="text" className="form-control" name="login" id="login" placeholder="Enter login"/>
          <button type="submit" className="btn btn-primary">
            Join Game
          </button>
        </div>
      </fieldset>
    </div>))
  })

  it('renders ', () => {
    const initialState = { games: [], game: null, error: null }

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunk, createLogger())
    )

    const {wrapper, getByText} = render(<OnBoarding/>)
      // expect(wrapper.instance().state.game).toBe(null);
      // expect(wrapper.instance().state.login).toBe('');
      expect(getByText(/Join/i).textContent).toBe("Join Game")

      // wrapper.find('button.counter-button').simulate('click')
      // wrapper.setState({count: 1})
      // wrapper.instance().increment()
      // expect(wrapper.instance().state.count).toBe(1)
  });
})
