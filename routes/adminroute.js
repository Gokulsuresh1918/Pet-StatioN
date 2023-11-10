const express = require('express');
const router = express.Router();

const { LoginGet,loginPost,  logoutGet,UserGet,dashboard,orderGet,categoryGet,productGet,blockUser} = require('../controllers/AdminController');


router.get('/admin', LoginGet);
router.post('/admin', loginPost);


router.get('/logoutadmin', logoutGet);
//admin dashboard
router.get('/dashboard',dashboard) 
router.get('/userdetails', UserGet);
router.get('/orderdetails', orderGet);
// router.get('/productdetails', productGet);
router.get('/Categorydetails', categoryGet);
router.get('/blockStatus/:id',blockUser)



module.exports = router;    