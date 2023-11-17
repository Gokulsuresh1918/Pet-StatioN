const userCollection = require('../model/userDB')


const usersession = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/')
  }
  next()
}

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    }
    else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};


const isblock = async (req, res, next) => {
  try {

    if (req.session.userId) {

      // const email = req.body.email
      const email = req.session.userId
      const check = await userCollection.findOne({ email: email });
      if (check.blockStatus === false) {
        next();
      } else {
        req.session.userId = null
        res.render('user/login', { message: "Please contact Your Admin You are no longer to access this account" })
      }
    }
  } catch (err) {
    console.log(err.message);
  }

}
module.exports = { usersession, isLogout ,isblock}