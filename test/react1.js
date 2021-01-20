import chai from "chai"
import React from 'react'
import {Tetris, Board} from "../src/client/components/test"
import {NavBar} from "../src/client/components/NavBar"

import { expect } from "chai"
import { shallow, configure } from "enzyme"
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
