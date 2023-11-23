const express = require('express');
const router = express.Router();

const { loginGet,loginPost ,logoutuser,resendotppost,
    forgetpass,forgetpasspost,addressremove,
    signupGet ,signupPost,addcartpost,clearcartget,checkoutaddress,
    homeGet,otpGet, addressGet,addresspost,confirmationget,confirmationpost,
    editaddressGet,addaddressGet,checkoutget,
    addaddresspost,editaddresspost,removeItem,
    profileGet,otppost,shopget,cartGet,productView} = require('../controllers/UserController')
const {usersession,isblock}=require('../middleware/userAuth')


router.get('/', loginGet);
router.post('/login',loginPost)
router.get('/signup', signupGet);
router.post('/signup',signupPost);
router.get('/logoutuser',logoutuser)

router.get('/otppage',otpGet)
router.post("/otppage",otppost)
router.post("/resendotp",resendotppost)



router.get('/home', homeGet);

router.get('/shop',shopget)
router.get('/productview/:id' ,productView)//add usersession  then user cant access before login

router.get('/cart',usersession,cartGet)
router.post('/addcart',usersession,addcartpost);
router.get('/clearcart',usersession,clearcartget);
router.delete('/removeItem/:productId',usersession,removeItem);

router.get('/checkout',usersession,checkoutget);
router.post('/checkoutaddress',usersession,checkoutaddress);
router.delete('/remove-address/:addressId',usersession,addressremove)
router.get('/confirmation',usersession,confirmationget);
router.post('/confirmation',usersession,confirmationpost);








router.get('/profile',usersession,profileGet);

router.get('/address',usersession,addressGet);
router.post('/address',usersession,addresspost);

router.get('/add-address',usersession,addaddressGet);
router.post('/add-address',usersession,addaddresspost);

router.get('/edit-address/:id',usersession,editaddressGet);
router.post('/edit-address',usersession,editaddresspost);

router.get('/forgetpass',usersession,forgetpass)
router.post('/forgetpass',usersession,forgetpasspost)



module.exports = router;