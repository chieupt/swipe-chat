const { check } = require("express-validator")
const User = require("../model/User")
module.exports = {
    loginValidate() {
        return [
            check('username', 'Username is required').notEmpty(),
            check('password', 'Password is required').notEmpty()
        ]
    },
    registerValidate() {
        return [
            check('username', 'Username is required').notEmpty(),
            check('password', 'Password is required').notEmpty(),
            check('email', 'Email is required').notEmpty(),
            check('email', 'Email is invalid').isEmail(),
            check('email').custom((value) => {
                return User.findOne({email:value})
                    .then(user => {
                        if (user) {
                            throw new Error('Email is already registered')
                        }
                    })
            })
        ]
    }
}