import React from "react";
import { connect } from 'react-redux'
import { BrowserRouter as HashRouter, Switch, Route } from "react-router-dom";
import { Tetris } from '../components/Tetris'
import { OnBoarding } from '../components/OnBoarding'

const App = ({message}) => {
  return (
    <HashRouter basename="/#">
      <Switch>
        <Route exact path="/" component={OnBoarding} />
        <Route exact path="/:roomId" component={Tetris} />
      </Switch>
      <span>{message}</span>
    </HashRouter>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
}
export default connect(mapStateToProps, null)(App)


