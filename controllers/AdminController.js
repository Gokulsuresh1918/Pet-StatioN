const { adminCollection } = require("../model/adminDB");
const { UserCollection } = require("../model/userDB");


//Admin login get
exports.LoginGet = (req, res) => {
    if (req.session.adminID) {
        res.redirect('/dashboard');
    } else {
        res.render('Admin/adminLogin')
    }
};

//Admin login post
exports.loginPost = (req, res) => {
try{
    const { username, password } = req.body
   
    const admindata = {
        profName: "Gokul",
        passcode: 1571
    };
  if(!username || username.trim()===""){
    res.render("admin/adminLogin",{message:"Username must be filled"})
  }
  else if(!password||password.trim()===""){
    res.render("admin/adminLogin",{message:"passwordf must be filled"})
  }
   else if (admindata.profName == username && admindata.passcode == password) {
        req.session.adminID = true;
        res.redirect('/admin/dashboard');
    }
    else {
        res.render("admin/adminLogin", { message: "wrong credentials" })
    }
}
catch(err){
    console.log(err);
}
}

exports.UserGet = async (req, res) => {
    const admin = await UserCollection.find()
    res.render("Admin/Users", { admin })
};

exports.orderGet = async (req, res) => {
    res.render("Admin/order")
};
exports.categoryGet = async (req, res) => {
    res.render("Admin/category")
};
exports.productGet = async (req, res) => {
    res.render("Admin/product") 
};
exports.dashboard = async (req, res) => {
    res.render('Admin/Dashboard')
}
exports.blockUser = async (req, res) => {
    const userid = req.params.id
    console.log("cfgbhjmk");
    console.log(userid);
    const user = await UserCollection.findById(userid)
    user.blockStatus = !user.blockStatus
    await user.save()
    const userlist = await UserCollection.find()
    res.redirect("/admin/userdetails")
}

exports.logoutGet = (req, res) => {
    if (req.session.adminID) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error', err);
                console.log(err);
            }
            console.log("session destriyod sucessfully");
            res.redirect('/admin/admin');
        });
    } else {
        res.redirect('/admin/admin');
    }

};




