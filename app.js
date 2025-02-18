import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 2200;

//* set up server
const server = http.createServer(app);
const io = new Server(server); // Correct way to initialize socket.io

//* Set up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); 

//* Connection to Socket.io
io.on("connection", function (socket) {
    socket.on("send-loaction", function(data){
        io.emit("receveid-loaction", {id:socket.id , ...data})
    });
    console.log("A user connected");
    socket.on("disconnect", function(){
        io.emit("User-Disconnected",socket.id)
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
