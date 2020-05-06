const express = require("express")
const user_router = express.Router()
const {check, validationResult} = require("express-validator")

const User = require("../model/User")

user_router.get('/sign-in',(req, res)=>{
    res.render("sign-in", { errors: [] });
})

user_router.get('/sign-up',(req, res)=>{
    res.render("sign-up",{
        isTaken: false
    });
})

user_router.post('/sign-in',[
    check('userName','Username is required').notEmpty(),
    check('password','Password is required').notEmpty()
],(req, res, next)=>{
    const {userName, password} = req.body
    //validate
    const result = validationResult(req)
    var errors = result.errors
    if(!result.isEmpty()){
        res.render('sign-in',{
            errors: errors
        })
    }else{
        // User.findOne({name:userName, password: password})
        //     .then(()=>{
        //         res.redirec("index")
        //     })
        //     .catch(()=>{
        //         res.render('sign-in',{errors:[{msg: 'Username incorect'}]})
        //     })
        const newUser = new User({name: userName,password: password})
        newUser.save()
            .then(()=>{
                console.log(newUser);
                res.send('OK')})
    }
})

user_router.post('/sign-up',(req, res)=>{
    console.log(req.body);
})

module.exports = user_router