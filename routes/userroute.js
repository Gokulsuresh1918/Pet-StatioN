const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,logoutuser,
    forgetpass,forgetpasspost,
    signupGet ,signupPost,addcartpost,
    homeGet,otpGet, addressGet,addresspost,
    editaddressGet,addaddressGet,
    addaddresspost,editaddresspost,
    profileGet,otppost,shopget,cartGet,productView} = require('../controllers/UserController')
const {usersession,isblock}=require('../middleware/userAuth')


router.get('/', loginGet);
router.post('/login',loginPost)
router.get('/signup', signupGet);
router.post('/signup',signupPost);
router.get('/logoutuser',logoutuser)

router.get('/otppage',otpGet)
router.post("/otppage",otppost)



router.get('/home', homeGet);

router.get('/shop',shopget)
router.get('/productview/:id' ,productView)//add usersession  then user cant access before login

router.get('/cart',cartGet)
router.post('/addcart',addcartpost);









router.get('/profile',profileGet);

router.get('/address',addressGet);
router.post('/address',addresspost);

router.get('/add-address',addaddressGet);
router.post('/add-address',addaddresspost);

router.get('/edit-address/:id',editaddressGet);
router.post('/edit-address',editaddresspost);

router.get('/forgetpass',forgetpass)
router.post('/forgetpass',forgetpasspost)



module.exports = router;