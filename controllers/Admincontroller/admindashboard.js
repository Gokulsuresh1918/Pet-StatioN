const { adminCollection } = require("../../model/adminDB");
const path = require('path');
const { log } = require("console");







//Admin login get
exports.LoginGet = (req, res) => {
    try {
        if (req.session.adminID) {
            res.render('Admin/adminLogin')
        } else {
            let admin = true
            res.render('admin/adminlogin', { admin })
        }
    } catch (error) {
        console.log(error.message);
    }
};



//Admin login post
exports.loginPost = async (req, res) => {
    try {
        const { username, password } = req.body
        const admindata = await adminCollection.findOne()
  
        if (admindata.name == username && admindata.password == password) {

            let admin = false
            req.session.adminID = admindata.name;
            res.redirect('/admin/dashboard');
        }
        else {
            let admin = true
            res.render("Admin/adminLogin", { msg: 'Invalid credentials', admin })
        }
    }
    catch (error) {
        console.log(error);
    }
};



//LogoutGet------------
exports.logoutGet = (req, res) => {
 
    if (req.session.adminID) {

        req.session.destroy((err) => {
            if (err) {
                console.error('Error', err);
            }
            console.log("session destriyod sucessfully");
            res.redirect('/admin/admin');
        });

    } else {
        res.redirect('/admin/admin');
    }
};


//DashboardGet---------------------------------------------------------------------------------
exports.dashboard = async (req, res) => {
    const admin = true
    res.render('Admin/Dashboard', { admin, errmsg: "please login" })
};














