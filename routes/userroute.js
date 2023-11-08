const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,signupGet ,signupPost,homeGet,otpGet, otppost} = require('../controllers/UserController')

router.get('/', loginGet);
router.get('/signup', signupGet);
router.get('/home', homeGet);
router.get('/otppage',otpGet)



router.post("/otppage",otppost)
router.post('/login',loginPost)
router.post('/signup',signupPost);
module.exports = router;