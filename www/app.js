var express = require("express")
var app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
var server = require("http").Server(app)
const bcrypt = require("bcrypt")
//use socket.io
var io = require("socket.io")(server)
server.listen(8080)

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

const users = [];

//use ejs engine
app.set("view engine", "ejs");
app.set("views", "views");

//add router
app.get('/',(req, res)=>{
    res.redirect("/sign-in");
})
app.get('/index',(req, res)=>{
    res.render("index");
})
app.get('/sign-in',(req, res)=>{
    res.render("sign-in", {isError: false});
})
app.get('/sign-up',(req, res)=>{
    res.render("sign-up",{
        isTaken: false
    });
})

app.post('/user-login',(req, res)=>{
    console.log(req.body.username);
    let user = {username: req.body.username, password: req.body.password};
    if(!users.includes(user)){
        res.render("sign-in.ejs",{isError: true})
    }else{
        res.redirect("/index")
    }
})

app.post('/register',(req, res)=>{
    console.log(req.body);
    // if(users.includes(req.body.username)){
    //     res.redirect("sign-up", {
    //         isTaken: true
    //     })
    // }else{
        // try {
            // const hashedPassword = await bcrypt.hash(req.body.password, 10)
            // users.push({username: req.body.username, password: 1, email: req.body.email})
            // console.log(users)
            // res.redirect("index",{userName: req.body.username})
        // } catch (error) {
        //     res.render("error");
        // }
    // }
})