const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/AdminController');
const adminCollection = require('../model/adminDB');
const { adminSession } = require('../middleware/adminAuth');

// Importing controller functions
const {
  LoginGet,
  loginPost,
  UserGet,
  dashboard,
  orderGet,
  productGet,
  productpost,
  productaddGet,
  productaddpost,
  editproductGet,
  editproductpost,
  categoryGet,
  categorypost,
  editcategoryGet,
  editcategoryPost,
  addcategoryGet,
  addcategoryPost,
  imagedelete,
  blockcategory,
  blockUser,
  logoutGet,
} = require('../controllers/AdminController');

// Multer for products images upload
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/MulterUploads/'); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename for each uploaded image
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPG and PNG images are allowed.'), false);
  }
};

// Setting up middleware for multer
const upload = multer({ storage, fileFilter });

// Admin routes with comments for better understanding

// Admin login and logout
router.get('/admin', LoginGet);
router.post('/admin', loginPost);
router.get('/logoutadmin', adminSession, logoutGet);

// Admin dashboard
router.get('/dashboard', adminSession, dashboard);

// User details
router.get('/userdetails', adminSession, UserGet);
router.get('/blockStatus',adminSession, blockUser);

// Category routes
router.get('/Categorydetails', adminSession, categoryGet);
router.post('/Categorydetails', adminSession, categorypost);
router.get('/addcategory', adminSession, addcategoryGet);
router.post('/addcategory', adminSession, addcategoryPost);
router.get('/editcategory/:_id', adminSession, editcategoryGet);
router.post('/editcategory/:_id', adminSession, editcategoryPost);
router.get('/blockcategory/:_id',adminSession ,blockcategory);

// Order route
router.get('/orderdetails', adminSession, orderGet);

// Product routes
router.get('/productdetails', adminSession, productGet);

// Product adding
router.get('/productadd', adminSession, productaddGet);
router.post('/productadd', upload.array('image', 4), adminSession, productaddpost);

// Edit product
router.get('/productedit/:id', adminSession, editproductGet);
router.post('/productedit/:id', upload.array('image', 4), adminSession, editproductpost);
router.get('/:image/:id',adminSession,imagedelete)

module.exports = router;
