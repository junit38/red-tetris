import React from "react";
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from "react-router-dom";
import { NavBar } from '../components/NavBar'
import { Tetris } from '../components/Tetris'
import { OnBoarding } from '../components/OnBoarding'

const App = ({message}) => {
  return (
    <HashRouter basename="/#">
      <div>
        <NavBar/>
        <Switch>
          <Route exact path="/" component={OnBoarding} />
          <Route exact path="/:roomId" component={Tetris} />
        </Switch>
      </div>
    </HashRouter>
  )
}

const mapStateToProps = (state) => {
  return {...state};
}
export default connect(mapStateToProps, null)(App)


