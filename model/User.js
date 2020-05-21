const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }},
    {
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const User = mongoose.model('user', UserSchema)
module.exports = User