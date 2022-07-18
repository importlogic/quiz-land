function isAuthenticated(req, res, next){
    if(req.user){
        next();
    }
    else{
        res.render("./admin/login.ejs");
    }
}

module.exports = {
    isAuthenticated
}