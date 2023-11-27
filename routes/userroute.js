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
  ordersget,
  contactGet,
  aboutGet,
 contactpost

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
router.get('/home', homeGet);
router.get('/contact', contactGet);
router.post('/contact', contactpost);
// router.get('/about', aboutGet);

// Shop and Product routes
router.get('/shop', shopget);
router.get('/cart', usersession, cartGet);
router.get('/productview/:id', usersession,productView);

// Cart routes
router.get('/cart', usersession, cartGet);
router.post('/addcart', usersession, addcartpost);
router.get('/clearcart', usersession, clearcartget);
router.delete('/removeItem/:productId', usersession, removeItem);

// Checkout routes
router.get('/checkout', usersession, checkoutget);
router.post('/checkoutaddress', usersession, checkoutaddress);
router.delete('/remove-address/:addressId', usersession, addressremove);
router.get('/confirmation', usersession, confirmationget);
router.post('/confirmation', usersession, confirmationpost);

// Profile and Address routes
router.get('/profile', usersession, profileGet);
router.get('/address', usersession, addressGet);
router.post('/address', usersession, addresspost);
router.get('/add-address', usersession, addaddressGet);
router.post('/add-address', usersession, addaddresspost);
router.get('/edit-address/:id', usersession, editaddressGet);
router.post('/edit-address', usersession, editaddresspost);

router.get('/orders',usersession,ordersget)

// Password-related routes
router.get('/forgetpass',usersession, forgetpass);
router.post('/forgetpass', usersession,forgetpasspost);
router.post('/resendotp',usersession,resendpost)

module.exports = router;
