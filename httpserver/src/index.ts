import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { Room } from "./Room";
import { User, UserCollection } from "./User";
import { WSServer } from "./WSServer";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const wsServer = new WSServer({ httpSrv: httpServer });
const home = new Room({
  id: uuidv4(),
  title: "Accueil",
  usersCollection: wsServer.onlineUsers,
});

wsServer.rooms.add(home);

const port = 8000;

app.use("/", express.static("public"));

// app.get("/rooms", (req, res) => {
//   const rooms = wsServer.rooms.all
//     .map((roomId) => wsServer.rooms.get(roomId))
//     .filter((room) => room && room.public);
//   res.json(rooms);
// });

// app.get("/bonjour/:prenom", (req, res) => {
//   res.send(`Bonjour ${req.params.prenom}`);
// });

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// WEBSOCKET
