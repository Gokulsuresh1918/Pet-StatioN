const express = require('express');
const router = express.Router();
const multer = require('multer')
const adminController = require('../controllers/AdminController')
const adminCollection = require('../model/adminDB')
const {adminSession}= require('../middleware/adminAuth')





const { LoginGet, loginPost,
    UserGet,
    dashboard,orderGet, 

     productGet,productpost,productaddGet,productaddpost,editproductGet,editproductpost,
    categoryGet,categorypost,
    editcategoryGet,editcategoryPost,
    addcategoryGet, addcategoryPost ,
    blockcategory,blockUser,
    logoutGet,} = require('../controllers/AdminController');










//multer for the products images upload
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/MulterUploads/'); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename for each uploaded image
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error(' Only JPG and PNG images are allowed.'), false);
  }
};
//setting up middleware-------------------------
const upload = multer({ storage, fileFilter });
  





//admin login and logout
router.get('/admin', LoginGet);
router.post('/admin', loginPost);
router.get('/logoutadmin',adminSession, logoutGet);


//admin dashboard----------------------
router.get('/dashboard',adminSession,dashboard) 

//user ------------------------
router.get('/userdetails',adminSession, UserGet);
router.get('/blockStatus/:id',blockUser)


//category----------
router.get('/Categorydetails',adminSession, categoryGet);
router.post('/Categorydetails',adminSession, categorypost);
router.get('/addcategory',adminSession,addcategoryGet);
router.post('/addcategory',adminSession, addcategoryPost );
router.get('/editcategory/:_id',adminSession,editcategoryGet);
router.post('/editcategory/:_id',adminSession, editcategoryPost );
router.get('/blockcategory/:_id',blockcategory)



//order route-------------
router.get('/orderdetails', adminSession,orderGet);



//product route=============================
router.get('/productdetails', adminSession,productGet);
router.post('/productdetails/:id', adminSession,productpost);
//product adding------------------
router.get('/productadd', adminSession,productaddGet);
 router.post('/productadd',upload.array('image',4), adminSession,productaddpost);
//edit product----------
router.get('/productedit/:id', adminSession,editproductGet);
 router.post('/productedit',upload.array('image',4), adminSession,editproductpost);








module.exports = router;    