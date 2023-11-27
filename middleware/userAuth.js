const { UserCollection } = require('../model/userDB')


const usersession =async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/')
  }else{
    const userId = req.session.userId ? req.session.userId.toString() : null;
    if (userId) {
      const check = await UserCollection.findOne({ _id: userId });
      console.log('User Check:', check);
 
      if (check && check.blockStatus === false) {
        next();
      } else {
        req.session.userId = null;
        res.render('user/login', { message: "Please contact Your Admin You are no longer able to access this account" });
      }
    } else {
      // Handle the case where req.session.userId is null or undefined
      res.status(500).send(' 1 Internal Server Error');
    }
  }
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
    console.log(req.session.userId);
    if (req.session.UserId) {
      const userId = req.session.userId ? req.session.userId.toString() : null;
      if (userId) {
        const check = await UserCollection.findOne({ _id: userId });
        console.log('User Check:', check);

        if (check && check.blockStatus === false) {
          next();
        } else {
          req.session.userId = null;
          res.render('user/login', { message: "Please contact Your Admin You are no longer able to access this account" });
        }
      } else {
        // Handle the case where req.session.userId is null or undefined
        res.status(500).send(' 1 Internal Server Error');
      }
    } else {
      // Handle the case where req.session.userId is not set
      res.status(500).send(' 2 Internal Server Error');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(' 3 Internal Server Error');
  }
}

module.exports = { usersession, isLogout, isblock }