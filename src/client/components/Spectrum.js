import React, {useState, useEffect} from 'react'

const GET_USERS_EVENT = "getUsers";

export const Spectrum = (props) => {
  const game = props.game;
  const player_name = props.player_name;

  const spectrumStyle = {
    display: 'inline-flex',
    paddingLeft: '50px'
  }

  let userContainerStyle = {
    display: 'inline-block',
    marginRight: '20px'
  }

  let userSpectrumStyle = {
    width: '100px',
    border: '0.5px solid gray'
  }

  let lineStyle = {
    width: '100px',
    height: '10px'
  }

  let lineOccupedStyle = {
    width: '100px',
    height: '10px',
    backgroundColor: 'gray'
  }

  let spectrum = [];
  for (let i = 0; i < game.users.length; i++)
  {
    if (game.users[i].name != player_name && game.users[i].playing)
    {
      let spectrumLines = [];
      for (let j = 0; j < 20; j++)
      {
        if (game.users[i].lines > j + game.users[i].blocks)
        {
          spectrumLines.push(
            <div className="line" style={lineStyle} key={j}></div>
          )
        }
        else
        {
          spectrumLines.push(
            <div className="line" style={lineOccupedStyle} key={j}></div>
          )
        }
      }
      spectrum.push(
        <div style={userContainerStyle} key={game.users[i].name}>
          <h4>{game.users[i].name}</h4>
          <div className="spectrum" style={userSpectrumStyle}>
            {spectrumLines}
          </div>
        </div>
      )
    }
  }

  return (
    <div style={spectrumStyle}>
      {spectrum}
    </div>
  );
}
