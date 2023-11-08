const { adminCollection } = require("../model/adminDB");
const { UserCollection } = require("../model/userDB");



exports.LoginGet = (req, res) => {
    if (req.session.adminID) {
        res.redirect('/dashboard');
    } else {
        res.render('Admin/adminLogin')
    }
};
exports.loginPost = (req, res) => {
    const admindata = {
        profName: "Gokul",
        passcode: 1571
    };
    const { username, password } = req.body
    if (admindata.profName == username && admindata.passcode == password) {
        req.session.adminID =true;
      res.redirect('/admin/dashboard');
    }
    else {
        res.redirect("admin/adminLogin", { wrg: "wrong credentials" })
    }
};

exports.UserGet=async(req,res)=>{
const admin =await UserCollection.find()
res.render("Admin/Users",{admin})
};
exports.orderGet=async(req,res)=>{
res.render("Admin/order")
};
exports.categoryGet=async(req,res)=>{
res.render("Admin/category")
};
exports.dashboard= async (req,res) =>{
    res.render('Admin/Dashboard')
}


exports.logoutGet = (req, res) => {
if(req.session.adminID){
        req.session.destroy((err) => {
            if (err) {
                console.error('Error', err);
                console.log(err);
            }
            console.log("session destriyod sucessfully");
            res.redirect('/admin/admin');
        });
     } else{
        res.redirect('/admin/admin');
        }
    
};

 


