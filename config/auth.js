module.exports = {
    ensureAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/users/sign-in')
    },

    forwardAuthenticated(req, res, next){
        if(req.isUnauthenticated()){
            return next()
        }
        res.redirect("/home")
    }
}