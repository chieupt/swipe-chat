const express = require("express")
const user_router = express.Router()
const { validationResult } = require("express-validator")
const validate = require("../validate/validator")
const bcrypt = require("bcrypt")

const User = require("../model/User")

user_router.get('/sign-in', (req, res) => {
    res.render("sign-in", { 
        errors: [],
        form: {}
    });
})

user_router.get('/sign-up', (req, res) => {
    res.render("sign-up", {
        errors: [],
        form: {}
    });
})

user_router.post('/sign-in', validate.loginValidate(), (req, res, next) => {
    const { userName, password } = req.body
    //validate
    const result = validationResult(req)
    if (!result.isEmpty()) {
        res.render('sign-in', {
            errors: result.errors,
            form:{
                name: userName,
                password: password
            }
        })
    } else {

        //check account
        User.findOne({ name: userName })
            .then((user) => {
                if(user){
                    bcrypt.compare(password, user.password).then((result)=>{
                        if(result){
                            res.redirect("/")
                        }else{
                            res.render('sign-in', { 
                                errors: [{ msg: 'Password incorect' }],
                                form:{
                                    name: userName,
                                    password: ''
                                }
                            })
                        }
                    })
                }else{
                    res.render('sign-in', { 
                        errors: [{ msg: 'Username not exist' }],
                        form:{
                            name: userName,
                            password: ''
                        }
                    })
                }
            })
            .catch(() => {
            })
    }
})

user_router.post('/sign-up', validate.registerValidate(), (req, res, next) => {
    const { userName, email, password } = req.body
    const result = validationResult(req)
    if (!result.isEmpty()) {
        res.render('sign-up', {
            errors: result.errors,
            form: {
                name: userName,
                password: password,
                email: email
            }
        })
    } else {
        const newUser = new User({
            name: userName,
            email: email,
            password: password
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw new Error(err)
                //set new password
                newUser.password = hash
                newUser.save()
                    .then(() => {
                        res.redirect("/")
                    })
                    .catch()
            })
        })
    }
})

module.exports = user_router