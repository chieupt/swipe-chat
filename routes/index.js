const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator")
const validate = require("../validate/validator")
const bcrypt = require("bcrypt")
const User = require("../model/User")
const passport = require("passport")
const {ensureAuthenticated, forwardAuthenticated} = require("../config/auth")

//dashboard GET
router
    .get('/home',ensureAuthenticated,(req, res) => {
        res.render("index")
    })
    //sign-in GET
    .get('/users/sign-in',forwardAuthenticated,(req, res) => {
        res.render("sign-in");
    })
    //sign-in POST
    .post('/users/sign-in',forwardAuthenticated,passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/sign-in',
        failureFlash: true
      }),(req, res, next) => {
        const { userName, password } = req.body
    })
    
    //sign-up GET
    .get('/users/sign-up', (req, res) => {
        res.render("sign-up");
    })
    
    //sign-in POST
    .post('/users/sign-up', (req, res, next) => {
        const { username, email, password } = req.body
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.render('sign-up', {
                errors: result.errors,
                form: {
                    username: username,
                    password: password,
                    email: email
                }
            })
        } else {
            const newUser = new User({
                username: username,
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
                            res.redirect("sign-in")
                        })
                        .catch()
                })
            })
        }
    })

    //logout GET
    .get('/users/logout', (req, res)=>{
        req.logOut()
        res.redirect('/users/sign-in')
    })

module.exports = router


