const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,signupGet ,signupPost,homeGet,otpGet, addressGet,editaddressGet,addaddressGet,profileGet,otppost,shopget,productView} = require('../controllers/UserController')
const {usersession,isblock}=require('../middleware/userAuth')


router.get('/', loginGet);
router.post('/login',loginPost)

router.get('/signup', signupGet);
router.post('/signup',signupPost);

router.get('/otppage',otpGet)
router.post("/otppage",otppost)

router.get('/home', homeGet);

router.get('/shop',shopget)
router.get('/productview' ,productView)//add usersession  then user cant access before login


router.get('/profile',profileGet);
router.get('/address',addressGet);
router.get('/add-address',addaddressGet);
router.get('/edit-address',editaddressGet);
module.exports = router;