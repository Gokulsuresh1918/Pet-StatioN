const express = require('express');
const router = express.Router();


const { homeGet, contactGet, contactpost, aboutget ,categoryfilter} = require('../controllers/Usercontroller/authenticationcontroller')
const { loginGet, loginPost, signupGet, signupPost, logoutuser } = require('../controllers/Usercontroller/publiccontroller')
const { shopget, productView,wishlistget,wishlistdataget, shopsearch } = require('../controllers/Usercontroller/shop&productcontroller')
const { cartGet, addcartpost, clearcartget, removeItem,clearwishlistget } = require('../controllers/Usercontroller/cartcontroller')
const { checkoutget, checkoutaddress, addressremove, confirmationget, confirmationpost, razorpaypost, walletorder,couponapply } = require('../controllers/Usercontroller/checkoutcontroller')
const { profileGet, addressGet,addimagepost, addresspost, addaddressGet, addaddresspost, editaddressGet, editaddresspost, ordersget, Returnget } = require('../controllers/Usercontroller/profilecontroller')
const { forgetpass, forgetpasspost, resendpost, otpGet, otppost, resendotpget } = require('../controllers/Usercontroller/otp&passcontroller')
// Importing middleware functions
const { usersession } = require('../middleware/userAuth');

// Public routes
router.get('/', loginGet);
router.post('/login', loginPost);
router.get('/signup', signupGet);
router.post('/signup', signupPost);
router.get('/logoutuser', logoutuser);



// Authenticated routes
router.get('/home', homeGet);
router.get('/contact', contactGet);
router.post('/contact', usersession, contactpost);
router.get('/about',usersession, aboutget);
router.get('/categoryfilter',usersession, categoryfilter);

// Shop and Product routes
router.get('/shop', shopget);
router.get('/wishlist/:id', wishlistget);
router.get('/wishlist', wishlistdataget);
router.get('/productview/:id',usersession, productView);



// Cart routes
router.get('/cart', usersession, cartGet);
router.post('/addcart', usersession, addcartpost);
router.get('/clearcart', usersession, clearcartget);
router.delete('/removeItem/:productId', usersession, removeItem);
router.get('/clearwishlist', usersession, clearwishlistget);
router.get('/search', shopsearch );



// Checkout routes
router.get('/checkout', usersession, checkoutget);
router.post('/checkoutaddress', usersession, checkoutaddress);
router.delete('/remove-address/:addressId', usersession, addressremove);
router.get('/confirmation', usersession, confirmationget);
router.post('/confirmation', usersession, confirmationpost);
router.post('/razorpay', razorpaypost);
router.post('/walletorder', walletorder);


// Profile and Address routes
router.get('/profile', usersession, profileGet);
router.get('/address', usersession, addressGet);
router.post('/address', usersession, addresspost);
router.get('/add-address', usersession, addaddressGet);
router.post('/add-address', usersession, addaddresspost);
router.get('/edit-address/:id', usersession, editaddressGet);
router.post('/edit-address', usersession, editaddresspost);
router.post('/addimage', usersession, addimagepost);

//order routes
router.get('/orders', usersession, ordersget);
router.post('/returnOrder', usersession, Returnget);
router.post('/couponapply/:code', couponapply);


// Password-related routes
router.get('/forgetpass', usersession, forgetpass);
router.post('/forgetpass', usersession, forgetpasspost);
router.post('/resendotp', usersession, resendpost);
router.get('/otppage', otpGet);
router.post('/otppage', otppost);
router.get('/resendotp', resendotpget);

module.exports = router;
