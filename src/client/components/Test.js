import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {loadInitialDataSocket} from '../actions/alert'
import io from "socket.io-client"
import SOCKET_SERVER_URL from '../containers/app'

let socket

const mapStateToProps = (state = {}) => {
  // console.dir(state)
    return {...state};
};

export class Test extends React.Component{
  constructor(props)
  {
     super(props)
     const {dispatch} = this.props
     socket = io.connect("http://localhost:3004")
     dispatch(loadInitialDataSocket(socket))
  }

  componentWillUnmount() {
    socket.disconnect()
  }

  render(){
    const {dispatch, items, selectGame} = this.props

    return (
      <div>{items.map((game, key)=>{
        return <div className="card text-white bg-primary mb-3"
             style={{maxWidth: "20rem", minWidth: "20rem", display: "inline-block", marginRight: "20px"}}
             key={key}>
          <div className="card-header">{game.id}</div>
          <div className="card-body">
            <h4 className="card-title">{game.id}</h4>
            <p className="card-text">{game.users.length} players</p>
            <button type="button" className="btn btn-secondary" onClick={() => selectGame(game)}>Join</button>
          </div>
        </div>})
      }</div>
    );
  }
}

export default connect(mapStateToProps)(Test)
