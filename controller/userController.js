const User = require('../model/User')
const mongoose = require('mongoose')

module.exports = {
    get(req, res){
        let user = req.body
        if(user){
            let findUser = User.findById(user.id, (err, usr)=>{
                if(err) throw err
                return res.json({userInfo: findUser})
            })
        }
    }
}