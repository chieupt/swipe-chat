const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        lowercase:true,
        match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    },
    name:{
        type: String,
        default: function(){
            return this.username
        }
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
   },
    {
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const User = mongoose.model('user', UserSchema)
module.exports = User