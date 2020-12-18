exports.getRoomIndex = function(rooms, room) {
  if (rooms && room)
  {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id == room)
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

exports.getUsersPlaying = function(rooms, room) {
  const index = this.getRoomIndex(rooms, room);
  if (index != -1)
  {
    const room = rooms[index];
    let usersPlaying = 0;
    console.log('here');
    console.log(room.users);
    for (let i = 0; i < room.users.length; i++)
    {
      console.log(room.users);
      if (room.users[i].playing == true)
        usersPlaying++;
    }
    return usersPlaying;
  }
  return (-1);
}
