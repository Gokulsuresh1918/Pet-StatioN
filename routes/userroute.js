const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,signupGet ,signupPost,homeGet,otpGet, otppost,shopget,productView} = require('../controllers/UserController')

router.get('/', loginGet);
router.post('/login',loginPost)

router.get('/signup', signupGet);
router.post('/signup',signupPost);

router.get('/otppage',otpGet)
router.post("/otppage",otppost)

router.get('/home', homeGet);

router.get('/shop',shopget)
router.get('/productview',productView)



module.exports = router;