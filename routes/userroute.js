const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,signupGet ,signupPost,homeGet,otpGet, otppost,shopget,productView} = require('../controllers/UserController')
const {usersession}=require('../middleware/userAuth')


router.get('/', loginGet);
router.post('/login',loginPost)

router.get('/signup', signupGet);
router.post('/signup',signupPost);

router.get('/otppage',usersession,otpGet)
router.post("/otppage",usersession,otppost)

router.get('/home', homeGet);

router.get('/shop',shopget)
router.get('/productview',usersession ,productView)



module.exports = router;