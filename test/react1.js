// import chai from "chai"
// import React from 'react'
// import {NavBar} from "../src/client/components/NavBar"
// import {OnBoarding} from "../src/client/components/OnBoarding"
// import {Games, getGamesLength} from "../src/client/components/Games"
// import {Board} from "../src/client/components/Board"

// import { expect } from "chai"
// import { shallow, configure, mount } from "enzyme"
// import Enzyme from "enzyme";
// import Adapter from "enzyme-adapter-react-16";

// Enzyme.configure({ adapter: new Adapter() })

// // describe('<App />', () => {
// //   it('renders without crashing', () => {
// //     const wrapper = shallow(<Tetris/>)
// //     expect(wrapper.contains(<Board/>)).to.equal(true)
// //   })
// // })

// describe('<Navbar />', () => {
//   it('renders without crashing', () => {
//     const wrapper = shallow(<NavBar/>)
//     expect(wrapper.contains(<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <a className="navbar-brand" href="#">Tetris</a>
//     </nav>)).to.equal(true)
//   })
// })

// import createLogger from 'redux-logger'
// import thunk from 'redux-thunk'
// import { createStore, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'
// import reducer from '../src/client/reducers/index'
// import {render, fireEvent, screen} from '@testing-library/react';
// import { jest } from 'jest';

// import ShallowRenderer from 'react-test-renderer/shallow';

// /**
//  * @jest-environment jsdom
//  */
// describe('<OnBoarding />', () => {

//   it('renders without crashing', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const wrapper = shallow(<Provider store={store}><OnBoarding/></Provider>)
//     expect(wrapper.contains(<div className="jumbotron">
//       <fieldset>
//         <div className="form-group">
//           <label htmlFor="login">Login</label>
//           <input type="text" className="form-control" name="login" id="login" placeholder="Enter login"/>
//           <button type="submit" className="btn btn-primary">
//             Join Game
//           </button>
//         </div>
//       </fieldset>
//     </div>))
//     const games = wrapper.find('Games').first();
//     expect(games.props().getGamesLength()).to.equal(1);
//   })

//   it('renders and throws error on submit', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const wrapper = mount(<Provider store={store}><OnBoarding/></Provider>)
//     wrapper.find("#submit").simulate("click");
//     const button = wrapper.find('.message');
//     expect(button.text()).to.be.eql('Login required');
//   });

//   it('renders and throws error on submit 2', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const wrapper = mount(<Provider store={store}><OnBoarding/></Provider>)
//     const input = wrapper.find('input');
//     input.simulate('change', { target: { value: 'Login' } })
//     wrapper.find("#submit").simulate("click");
//     expect(wrapper.contains(<Board/>))
//    });

//   it('renders and submit', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const wrapper = render(<Provider store={store}><OnBoarding/></Provider>)
//     const input = wrapper.getByLabelText("login-input");
//     fireEvent.change(input, { target: { value: 'login' } })
//     expect(input.value).to.equal('login')
//   });

//   it('renders Games with no games', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const games = []

//     const wrapper = shallow(<Provider store={store}><Games games={games}/></Provider>)
//     expect(wrapper.contains(<div/>))
//   });

//   it('renders Games with one game', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const games = [{
//       id: 'room_0',
//       launched: false,
//       users: []
//     }]

//     const wrapper = shallow(<Provider store={store}><Games games={games}/></Provider>)
//     expect(wrapper.contains(<h3>1 games:</h3>))
//     expect(wrapper.contains(<div className="card text-white bg-primary mb-3"
//              style={{maxWidth: "20rem", minWidth: "20rem", display: "inline-block", marginRight: "20px"}}
//              key="0">
//           <div className="card-header">room_0</div>
//           <div className="card-body">
//             <h4 className="card-title">room_0</h4>
//             <p className="card-text">0 players</p>
//             <button type="button" className="btn btn-secondary">Join</button>
//           </div>
//         </div>));
//   });

//   it('renders Games with one game', () => {
//     const initialState = { games: [], game: null, error: null }

//     const store = createStore(
//       reducer,
//       initialState,
//       applyMiddleware(thunk, createLogger())
//     )

//     const games = []
//     games.push({
//       id: 'room_0',
//       launched: false,
//       users: []
//     })

//     const {getByText} = shallow(<Games games={games}/>)
//     fireEvent.click(getByText("Join"));
//   });
// })
