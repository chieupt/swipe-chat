const express = require("express")
const err_router = express.Router()

err_router.use((req, res, next)=>{
    console.log('nothing!');
    next();
})

err_router.use((req, res, next)=>{
    console.log('abc!');
})

module.exports = err_router