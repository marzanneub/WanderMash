const {getUser} = require("../services/auth");

function checkForAuthentication(req, res, next) {
    const userCookie = req.cookies.user;
    req.userData = null;

    if(!userCookie) return next();

    const user = userCookie;
    const userData = getUser(user);

    req.userData = userData;
    return next();
}

function restrictTo(roles) {
    return function(req, res, next) {
        if(!req.userData) return res.status(401);
        if(!roles.includes(req.userData.role)) return res.status(401);
        return next();

    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};