const express = require("express")
const user_router = express.Router()

user_router.get('/sign-in',(req, res)=>{
    res.render("sign-in", {isError: false});
})

user_router.get('/sign-up',(req, res)=>{
    res.render("sign-up",{
        isTaken: false
    });
})

user_router.post('/sign-in',(req, res)=>{
    console.log(req.body.username);
    let user = {username: req.body.username, password: req.body.password};
    if(!users.includes(user)){
        res.render("sign-in.ejs",{isError: true})
    }else{
        res.redirect("/index")
    }
})

user_router.post('/sign-up',(req, res)=>{
    console.log(req.body);
})

module.exports = user_router