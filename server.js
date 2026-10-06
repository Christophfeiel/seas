import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";


const PORT = 3000;
const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer);



const players = {}




io.on("connection", (socket) => {
    console.log("a user connected" + socket.id);
  
    const id = socket.id
    const n = Object.keys(players).length 

    players[id] = {
        id: id,
        x: 400 + n * 50,
        y: 300 + n * 50,
        angle: 0,
        color: colors[n % colors.length]


    }

socket.on("ready", () => {
    socket.emit("init", {id: id, players:players})
    socket.broadcast.emit("playerjoined", players[id])
});


socket.on("update", (data) => {
    if (players[id]) {
        players[id].x = data.x;
        players[id].y = data.y;
        players[id].angle = data.angle;

      socket.broadcast.emit("update", {id: id, x: data.x, y: data.y, angle: data.angle});  
    }
   
});

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
 });
    
app.use(express.static("public"));

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});