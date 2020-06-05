const express = require("express")
const router = express.Router()
const { validationResult } = require("express-validator")
const validate = require("../validate/validator")
const bcrypt = require("bcrypt")
const User = require("../model/User")
const passport = require("passport")
const {ensureAuthenticated, forwardAuthenticated} = require("../config/auth")
const userController = require('../controller/userController')

//dashboard GET
router
    .get('/home/:username',ensureAuthenticated,(req, res) => {
        res.render("index",{user: req.user})
    })
    //sign-in GET
    .get('/users/sign-in', forwardAuthenticated,(req, res) => {
        res.render("sign-in");
    })
    //sign-in POST
    .post('/users/sign-in',forwardAuthenticated,validate.loginValidate(),(req, res, next) => {
        const { username, password } = req.body
        //validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.render('sign-in',{ 
                errors: result.errors,
                form: {
                    username: username,
                    password: password,
            }})
        }else{
            //passport
            passport.authenticate('local', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) { 
                    req.flash('error_msg', 'Username or password incorrect')
                    res.redirect('/users/sign-in'); 
                }
                req.logIn(user, function(err) {
                  if (err) { return next(err); }
                  return res.redirect('/home/'+user.username);
                });
            })(req, res, next);
        }
    })
    
    //sign-up GET
    .get('/users/sign-up',forwardAuthenticated,(req, res) => {
        res.render("sign-up");
    })
    
    //sign-in POST
    .post('/users/sign-up' ,forwardAuthenticated, validate.registerValidate(),(req, res, next) => {
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
                            req.flash('success_msg','Registered is success! You can login to Swipe')
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
    .route('/api/user/:userId')
        .get(userController.get)

module.exports = router


