const express = require('express');
const router = express.Router();

// Importing controller functions
const {
  loginGet,
  loginPost,
  logoutuser,
  resendotpget,
  forgetpass,
  forgetpasspost,
  addressremove,
  signupGet,
  signupPost,
  addcartpost,
  clearcartget,
  checkoutaddress,
  homeGet,
  otpGet,
  addressGet,
  addresspost,
  confirmationget,
  confirmationpost,
  editaddressGet,
  addaddressGet,
  checkoutget,
  addaddresspost,
  editaddresspost,
  removeItem,
  profileGet,
  otppost,
  shopget,
  cartGet,
  resendpost,
  productView,
  ordersget
} = require('../controllers/UserController');

// Importing middleware functions
const { usersession, isblock } = require('../middleware/userAuth');



// Public routes
router.get('/', loginGet);
router.post('/login', loginPost);
router.get('/signup', signupGet);
router.post('/signup', signupPost);
router.get('/logoutuser', logoutuser);

// OTP-related routes
router.get('/otppage', otpGet);
router.post('/otppage', otppost);
router.get('/resendotp', resendotpget);

// Authenticated routes
router.get('/home',isblock, homeGet);

// Shop and Product routes
router.get('/shop',isblock, shopget);
router.get('/productview/:id',isblock, usersession, productView);

// Cart routes
router.get('/cart',isblock, usersession, cartGet);
router.post('/addcart',isblock, usersession, addcartpost);
router.get('/clearcart',isblock, usersession, clearcartget);
router.delete('/removeItem/:productId',isblock, usersession, removeItem);

// Checkout routes
router.get('/checkout',isblock, usersession, checkoutget);
router.post('/checkoutaddress',isblock, usersession, checkoutaddress);
router.delete('/remove-address/:addressId',isblock, usersession, addressremove);
router.get('/confirmation',isblock, usersession, confirmationget);
router.post('/confirmation',isblock, usersession, confirmationpost);

// Profile and Address routes
router.get('/profile',isblock, usersession, profileGet);
router.get('/address',isblock, usersession, addressGet);
router.post('/address',isblock, usersession, addresspost);
router.get('/add-address',isblock, usersession, addaddressGet);
router.post('/add-address',isblock, usersession, addaddresspost);
router.get('/edit-address/:id',isblock, usersession, editaddressGet);
router.post('/edit-address',isblock, usersession, editaddresspost);

router.get('/orders',isblock,usersession,ordersget)

// Password-related routes
router.get('/forgetpass',isblock,usersession, forgetpass);
router.post('/forgetpass',isblock, usersession,forgetpasspost);
router.post('/resendotp',isblock,usersession,resendpost)

module.exports = router;
