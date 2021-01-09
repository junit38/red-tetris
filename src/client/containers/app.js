import React from "react";
import { connect } from 'react-redux'
import { BrowserRouter as HashRouter, Switch, Route } from "react-router-dom";
import { NavBar } from '../components/NavBar'
import { Tetris } from '../components/Tetris'
import { OnBoarding } from '../components/OnBoarding'
import { Test } from '../components/Test'

const App = ({message}) => {
  return (
    <HashRouter basename="/#">
      <NavBar/>
      <Switch>
        <Route exact path="/" component={OnBoarding} />
        <Route exact path="/:roomId" component={Tetris} />
      </Switch>
      <span>{message}</span>
    </HashRouter>
  )
}

const mapStateToProps = (state) => {
  return {...state};
}
export default connect(mapStateToProps, null)(App)


