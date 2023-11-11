const usersession = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.redirect("/")
    }
}
module.exports = { usersession }