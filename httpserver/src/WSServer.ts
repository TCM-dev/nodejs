import { Server as SocketIOServer, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  IMsg,
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

      this.handleRooms(socket);
      this.handleChat(socket);
      this.handleDisconnection(socket);
    });
  }

  handleDisconnection(socket: Socket) {
    socket.on("disconnect", () => {
      this.log("User disconnected");

      this.onlineUsers.del(socket.id);

      const user = this.onlineUsers.get(socket.id);

      if (!user) {
        return;
      }
    });
  }

  handleChat(socket: Socket) {
    socket.on("message", (msg: string, roomId: string) => {
      this.log("New message: " + msg);

      const message: IMsg = {
        msg,
        timestamp: Date.now(),
        userId: socket.id,
        roomId,
      };

      this.server.emit("message", message);
    });
  }

  handleRooms(socket: Socket) {
    const user = this.onlineUsers.get(socket.id);

    if (!user) {
      return;
    }

    const room = new Room({
      id: uuidv4(),
      title: user.pseudo ? user.pseudo + "'s room" : "My room",
      usersCollection: this.onlineUsers,
      prejoinedUsers: [socket.id],
      adminId: socket.id,
    });

    this.rooms.add(room);
    this.log("Created room");

    socket.on("rooms", () => {
      const rooms = this.rooms.all
        .map((roomId) => this.rooms.get(roomId))
        .filter((room) => {
          if (!room) {
            return;
          }

          if (!room.public) {
            return room.joinedUsers.includes(socket.id);
          }

          return room.public;
        });

      const message: IMsg = {
        msg: JSON.stringify({
          type: "lstroom",
          payload: rooms,
        }),
        timestamp: Date.now(),
      };

      socket.emit("rooms", message);
    });
  }
}
