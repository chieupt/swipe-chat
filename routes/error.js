const express = require("express")
const err_router = express.Router()

err_router.use((req, res, next)=>{
    res.render("error")
})

module.exports = err_router