const express = require("express")
const app = express()
const mongoose = require("mongoose")

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
var server = require("http").Server(app)
const bcrypt = require("bcrypt")
//use socket.io
var io = require("socket.io")(server)
const PORT = process.env.PORT || 8080
server.listen(PORT,console.log(`Server started at port ${PORT}`))

io.on("connection", (socket)=>{
    socket.on("disconnect",()=>{
    })
    socket.on('message-content', (data)=>{
        var repMessage = "Hmm, I dont know!";
        switch(data){
            case "":
                repMessage = "Nothing!";
                break
            case "hello":
                repMessage = "Hello, I am server!"
                break;
            case "what do you do?":
                repMessage = "Yes, I am playing football!"
                break;
            case "what time is it?":
                var time = new Date().getUTCHours();
                repMessage = `Uhm..., It is ${time}`;
                break;
            case "bye bye":
                repMessage = "See you again!"
                break;
        }
        io.sockets.emit('data-from-server', repMessage);
    })
})

//use ejs engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//route
app.use('/', require(__dirname + '/routes/index'))
app.use('/users', require(__dirname + '/routes/users'))
app.use(require(__dirname + '/routes/error'))


//db config
const db = require(__dirname + '/config/keys').MongoURI
//connect to Mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('connected');
})
.catch(err => console.log(err))