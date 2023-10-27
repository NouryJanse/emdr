import { Room } from "./Room";

export const removeUserFromRoomsArray = (rooms: Room[], id: string) => {
  return rooms.filter((room: Room) => {
    const users = room.users.filter((user: string) => user !== id);
    if (users.length > 0) {
      return { ...room, users };
    }
    return false;
  });
};

export const addUserToExistingRoom = (rooms: Room[], existingRoom: Room, id: string): any => {
  return rooms.map((room: Room) => {
    if (room.key === existingRoom.key) {
      const updatedRoom: Room = { ...room, key: existingRoom.key, users: [...existingRoom.users, id] };
      return updatedRoom;
    }
    return room;
  });
};
