import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { User, Users } from "./User";

const users = new Users([]);

const user = new User({
  id: "1",
  collection: users,
});

const user2 = new User({
  id: "2",
  collection: users,
});

users.add(user);
users.add(user);
users.add(user2);
// users.del("1");

// console.log(users.get("2"));

// console.log('Début itérateur')

// let iteration = users.next();

// while (!iteration.done) {
//   console.log(iteration.value);
//   iteration = users.next();
// }

const app = express();
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 8000;

app.use("/", express.static("public"));

// app.get("/bonjour/:prenom", (req, res) => {
//   res.send(`Bonjour ${req.params.prenom}`);
// });

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// WEBSOCKET

wsServer.on("connection", (socket: Socket) => {
  console.log("User connected");

  socket.on("message", (msg: string) => {
    console.log("message: " + msg);
    wsServer.emit("message", {
      content: msg,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
