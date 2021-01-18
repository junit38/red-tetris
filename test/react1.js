import chai from "chai"
import React from 'react'
// import equalJSX from 'chai-equal-jsx'
// import {createRenderer} from 'react-addons-test-utils'
import {Tetris, Board} from "../src/client/components/test"

// chai.use(equalJSX)

// describe('Fake react test', function(){
//   it('works', function(){
//     const renderer = createRenderer()
//     renderer.render(React.createElement(Tetris))
//     const output = renderer.getRenderOutput()
//     output.should.equalJSX(<Board/>)
//   })

// })

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
