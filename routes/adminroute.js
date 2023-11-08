const express = require('express');
const router = express.Router();

const { LoginGet,loginPost,logoutGet,UserGet,dashboard,orderGet,categoryGet} = require('../controllers/AdminController');


router.get('/admin', LoginGet);
router.get('/logoutadmin', logoutGet);
router.get('/userdetails', UserGet);
router.get('/orderdetails', orderGet);
router.get('/Categorydetails', categoryGet);
router.get('/dashboard',dashboard) 



router.post('/adminLogin', loginPost);
module.exports = router;    