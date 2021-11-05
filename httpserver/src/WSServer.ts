import { Server as SocketIOServer, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  IMsg,
  IRoom,
  IRoomCollection,
  IUserCollection,
  IWSServer,
  IWSServerConfig,
} from "./interfaces";
import { Room, RoomCollection } from "./Room";
import { User, UserCollection } from "./User";
import { v4 as uuidv4 } from "uuid";

export class WSServer implements IWSServer {
  server: SocketIOServer;
  onlineUsers: IUserCollection;
  rooms: IRoomCollection;
  log: (...args: any[]) => void;

  constructor(config: IWSServerConfig) {
    this.server = new SocketIOServer(config.httpSrv, {
      cors: {
        origin: "*",
      },
    });

    this.onlineUsers = new UserCollection([]);
    this.rooms = new RoomCollection([]);

    this.log = config.log || console.log;

    this.handleConnection();
  }

  handleConnection() {
    this.server.on("connection", (socket: Socket) => {
      this.log("User connected");

      const user = new User({
        id: socket.id,
        collection: this.onlineUsers,
      });

      this.onlineUsers.add(user);

      this.handleRoomCreation(socket);
      this.handleChat(socket);
      // this.handleRooms(socket);
      this.handleDisconnection(socket);
    });
  }

  handleDisconnection(socket: Socket) {
    socket.on("disconnect", () => {
      this.log("User disconnected");

      const user = this.onlineUsers.get(socket.id);

      if (!user) {
        return;
      }

      this.onlineUsers.del(socket.id);

      const room = this.rooms.all
        .map((roomId) => this.rooms.get(roomId))
        .find((room) => {
          if (!room) {
            return false;
          }

          return room.adminId === user.id;
        });

      if (!room) {
        return;
      }

      this.rooms.del(room.id);
      this.emitRooms();
    });
  }

  handleChat(socket: Socket) {
    socket.on("message", (msg: string, roomId: string) => {
      const room = this.rooms.get(roomId);

      if (!room) {
        return;
      }

      // Join channel for proof of concept
      if (msg === "/join") {
        room.joinUser(socket.id);

        this.log(`User ${socket.id} joined room ${room.id}`);

        const message: IMsg = {
          msg: JSON.stringify({
            content: `Welcome ${socket.id} to the room !`,
            type: "success",
          }),
          timestamp: Date.now(),
          roomId,
        };

        this.emitToJoinedUsers(room, message);

        return;
      }

      if (!room.public && !room.joinedUsers.includes(socket.id)) {
        this.log(
          `Room ${room.id} is private and user ${socket.id} is not allowed to talk on this route`
        );

        const message: IMsg = {
          msg: JSON.stringify({
            content:
              "You are not allowed to talk in this chat, type /join to ask permission",
            type: "error",
          }),
          timestamp: Date.now(),
          roomId,
        };

        socket.emit("message", message);

        return;
      }

      this.log("New message: " + msg);

      const message: IMsg = {
        msg: JSON.stringify({
          content: msg,
          type: "message",
        }),
        timestamp: Date.now(),
        userId: socket.id,
        roomId,
      };

      if (!room.public) {
        // Emit only to joined users (probably better to use socket.io rooms)
        this.emitToJoinedUsers(room, message);
        return;
      }

      this.server.emit("message", message);
    });
  }

  handleRoomCreation(socket: Socket) {
    const user = this.onlineUsers.get(socket.id);

    if (!user) {
      return;
    }

    const room = new Room({
      id: uuidv4(),
      title: user.pseudo ? user.pseudo + "'s room" : "Private room",
      usersCollection: this.onlineUsers,
      adminId: socket.id,
    });

    this.rooms.add(room);
    this.emitRooms();
    this.log("Created room");
  }

  // handleRooms(socket: Socket) {
  //   socket.on("rooms", () => {
  //     this.emitRooms(socket);
  //   });
  // }

  emitRooms() {
    this.log("Emit rooms");
    const rooms = this.rooms.all.map((roomId) => this.rooms.get(roomId));

    const message: IMsg = {
      msg: JSON.stringify({
        type: "lstroom",
        payload: rooms,
      }),
      timestamp: Date.now(),
    };

    this.server.sockets.emit("rooms", message);
  }

  emitToJoinedUsers(room: IRoom, message: IMsg) {
    room.joinedUsers.forEach((userId) => {
      const socket = this.server.sockets.sockets.get(userId);
      if (!socket) {
        return;
      }

      socket.emit("message", message);
    });
  }
}
