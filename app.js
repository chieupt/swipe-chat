const express = require("express")
const app = express()
const mongoose = require("mongoose")
const flash = require("connect-flash")
const session = require("express-session")
const bodyParser = require("body-parser")
const passport = require("passport")
const MongoStore = require("connect-mongo")(session)
require("./config/passport")(passport)

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))
var server = require("http").Server(app)

//use socket.io
var io = require("socket.io")(server)

//use ejs engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash())

//global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.errors = []
    res.locals.form = {}
    res.locals.user = req.user || null
    next()
})

//route
app.use(require(__dirname + '/routes/index'))
app.use(require(__dirname + '/routes/error'))

//db config
const db = require(__dirname + '/config/keys').MongoURI

//connect to Mongo
mongoose.connect("mongodb://127.0.0.1:27017", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('connected');
})
.catch(err => console.log(err))
const PORT = process.env.PORT || 8080
server.listen(PORT,console.log(`Server started at port ${PORT}`))
