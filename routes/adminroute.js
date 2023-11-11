const express = require('express');
const router = express.Router();

const { LoginGet, loginPost,
    UserGet,
    dashboard,orderGet,  productGet,
    categoryGet,categorypost,
    editcategoryGet,editcategoryPost,
    addcategoryGet, addcategoryPost ,
    blockcategory,blockUser,
    logoutGet,} = require('../controllers/AdminController');

const {adminSession}= require('../middleware/adminAuth')
router.get('/admin', LoginGet);
router.post('/admin', loginPost);


router.get('/logoutadmin',adminSession, logoutGet);
//admin dashboard----------------------
router.get('/dashboard',adminSession,dashboard) 

//user details and block------------------------
router.get('/userdetails',adminSession, UserGet);
router.get('/blockStatus/:id',blockUser)
//admin pages---------------------
router.get('/orderdetails', adminSession,orderGet);
router.get('/productdetails', adminSession,productGet);

router.get('/Categorydetails',adminSession, categoryGet);
router.post('/Categorydetails',adminSession, categorypost);
//edit/add/delete category------------------
router.get('/addcategory',adminSession,addcategoryGet);
router.post('/addcategory',adminSession, addcategoryPost );

router.get('/editcategory/:_id',adminSession,editcategoryGet);
router.post('/editcategory/:_id',adminSession, editcategoryPost );

router.get('/blockcategory/:_id',blockcategory)



module.exports = router;    