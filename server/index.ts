import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { removeUserFromRoomsArray, addUserToExistingRoom } from "./helpers";
import { Room } from "./Room";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

const port = process.env.PORT || 8888;
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

let rooms: Room[] = [];

io.on("connection", (socket) => {
  console.info(`connected socketId: ${socket.id}`);
  io.to(socket.id).emit("userId", socket.id);

  socket.on("message", async (message) => {
    try {
      console.info(`message from socketId: ${socket.id}`);
      if (message.eventKey) {
        const existingRoom = rooms.find((room) => room.key === message.eventKey);
        socket.join(message.eventKey);
        io.to(socket.id).emit("event", `Joined ${message.eventKey}`);

        if (!existingRoom) {
          // newRoom
          rooms.push({ key: message.eventKey, users: [socket.id], createdAt: Date.now() });
        } else {
          // add to existing room
          const newRooms = addUserToExistingRoom(rooms, existingRoom, socket.id);
          if (newRooms !== undefined) {
            rooms = newRooms;
          }
        }
      }
      //
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("isAnimating", (message) => {
    try {
      const { eventKey, isAnimating } = JSON.parse(message);
      if (rooms.length) {
        const existingRoom = rooms.find((room) => room.key === eventKey);
        if (existingRoom)
          for (let index = 0; index < existingRoom.users.length; index++) {
            const userKey = existingRoom.users[index];
            io.to(userKey).emit("isAnimating", isAnimating);
          }
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("removeRoomByKey", (data) => {
    try {
      const { eventKey } = data;
      rooms = rooms.filter((room) => {
        return room.key !== eventKey;
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", (msg) => {
    try {
      console.info(`disconnect: ${socket.id}`);
      rooms = removeUserFromRoomsArray(rooms, socket.id);
    } catch (error) {
      console.error(error);
    }
  });
});

setInterval(() => {
  if (rooms && rooms.length > 0) {
    for (let index = 0; index < rooms.length; index++) {
      const room = rooms[index];
      if (room && room?.key) {
        io.to(room.key).emit("event", `In room ${room.key} with ${JSON.stringify(room.users)}`);
      }
    }
  }
}, 5000);
