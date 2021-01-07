exports.findGame = function(games, room) {
  for (let i = 0; i < games.length; i++) {
    if (games[i].id == room)
      return (games[i]);
  }
  return (null);
}

exports.getGameIndex = function(games, room) {
  if (games && room)
  {
    for (let i = 0; i < games.length; i++) {
      if (games[i].id == room)
        return (i);
    }
  }
  return (-1);
}

exports.getUserIndex = function(users, player_name) {
  if (users && player_name)
  {
    for (let i = 0; i < users.length; i++) {
      if (users[i].name == player_name)
        return (i);
    }
  }
  return (-1);
}

exports.getUsersPlaying = function(games, room) {
  const index = this.getGameIndex(games, room);
  if (index != -1)
  {
    const room = games[index];
    let usersPlaying = 0;
    for (let i = 0; i < room.users.length; i++)
    {
      if (room.users[i].playing == true)
        usersPlaying++;
    }
    return usersPlaying;
  }
  return (-1);
}

exports.findUser = function(room, player_name) {
  let findUser = -1;
  for (let i = 0; i < room.users.length; i++)
  {
    if (room.users[i].name == player_name)
      findUser = i;
  }
  return findUser;
}
