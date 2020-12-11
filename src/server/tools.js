exports.getRoomIndex = function(rooms, room) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id == room)
      return (i);
  }
  return (-1);
}
