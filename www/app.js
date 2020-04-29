var express = require("express");
var app = express();
app.use(express.static("public"));
var server = require("http").Server(app);

//use socket.io
var io = require("socket.io")(server)
server.listen(8080);

io.on("connection", (socket)=>{
    console.log(`User with id ${socket.id} has been connected!`);
    socket.on("disconnect",()=>{
        console.log(`User with id ${socket.id} has been disconnected!`);
    })
    socket.on('Client-send-data', (data)=>{
        console.log(data);
    })
})

//use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

//add router
app.get('/sign-in',(req, res)=>{
    res.render("sign-in");
})
app.get('/sign-up',(req, res)=>{
    res.render("sign-up");
})
app.get('/index',(req, res)=>{
    res.render("index");
})