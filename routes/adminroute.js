const express = require('express');
const router = express.Router();

const adminController = require('../controllers/Admincontroller/admindashboard');
const adminCollection = require('../model/adminDB');
const { adminSession } = require('../middleware/adminAuth');
const {upload} = require('../middleware/multer')

const { LoginGet, loginPost, logoutGet, dashboard, } = require('../controllers/Admincontroller/admindashboard')
const { reviewget, UserGet, blockUser, } = require('../controllers/Admincontroller/usercontroller')
const { orderGet,viewProductOrder,viewAddressOrder,pendingOrder,deliveredorder,cancelorder,shippedorder } = require('../controllers/Admincontroller/ordercontroller')
const { categoryGet, categorypost, addcategoryGet, addcategoryPost, editcategoryGet, editcategoryPost, blockcategory, } = require('../controllers/Admincontroller/categorycontroller')
const { productGet, productpost, productaddGet, productaddpost, editproductGet, editproductpost, imagedelete, } = require('../controllers/Admincontroller/productcontroller')






// Admindashboard routes-----------------------------------------------

// Admin login and logout
router.get('/admin', LoginGet);
router.post('/admin', loginPost);
router.get('/logoutadmin', adminSession, logoutGet);
router.get('/dashboard', adminSession, dashboard);
router.get('/reviewdetails', adminSession, reviewget);
router.get('/userdetails', adminSession, UserGet);
router.get('/blockStatus', adminSession, blockUser);



// Ordercontroller-------------------------------------------------------
router.get('/orderdetails', adminSession, orderGet);
router.post('/viewproduct', viewProductOrder)
router.post('/viewaddress', viewAddressOrder)
router.post('/pendingOrder', pendingOrder)
router.post('/cancelOrder', cancelorder)
router.post('/deliveryOrder', deliveredorder)
router.post('/shippedOrder', shippedorder)





// Category routes
router.get('/Categorydetails', adminSession, categoryGet);
router.post('/Categorydetails', adminSession, categorypost);
router.get('/addcategory', adminSession, addcategoryGet);
router.post('/addcategory', adminSession, addcategoryPost);
router.get('/editcategory/:_id', adminSession, editcategoryGet);
router.post('/editcategory/:_id', adminSession, editcategoryPost);
router.get('/blockcategory/:_id', adminSession, blockcategory);






//=============== Product routes

// Product details
router.get('/productdetails', adminSession, productGet);
router.get('/productadd', adminSession, productaddGet);
router.post('/productadd', upload.array('image', 4), adminSession, productaddpost);
router.get('/productedit/:id', adminSession, editproductGet);
router.post('/productedit/:id', upload.array('image', 4), adminSession, editproductpost);
router.get('/:image/:id', adminSession, imagedelete);

module.exports = router;
