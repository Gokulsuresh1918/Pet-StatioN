const { adminCollection } = require("../model/adminDB");
const { UserCollection } = require("../model/userDB");
const { categoryCollection } = require("../model/Admincategory");





//Admin login get
exports.LoginGet = (req, res) => {
    res.render('Admin/adminLogin')
};



//Admin login post
exports.loginPost = (req, res) => {
    try {
        const { username, password } = req.body

        const admindata = {
            profName: "Gokul",
            passcode: 1571
        };
        if (!username || username.trim() === "") {
            res.render("Admin/adminLogin", { message: "Username must be filled" })
        }
        else if (!password || password.trim() === "") {
            res.render("Admin/adminLogin", { message: "passwordf must be filled" })
        }
        else if (admindata.profName == username && admindata.passcode == password) {
            req.session.adminID = admindata.profName;
            console.log(req.session.adminID);
            res.redirect('/admin/dashboard');
        }
        else {
            
            res.render("Admin/adminLogin", { message :'wrong credentials'})
        }
    }
    catch (error) {
        console.log(error);
    }
}



//userGet--------------
exports.UserGet = async (req, res) => {
    const admin = await UserCollection.find()
    res.render("Admin/Users", { admin })
};



//OrderGet------------
exports.orderGet = async (req, res) => {
    res.render("Admin/order")
};




//CategoryGet---------
exports.categoryGet = async (req, res) => {
    const categorydata = await categoryCollection.find()
    res.render("Admin/category",{categorydata})
    
};
exports.categorypost = async (req, res) => {
   categorydata={
    categoryname: req.body.categoryname,
        description: req.body.description,
        stock: req.body.stock,
        price:req.body.price
   };
   console.log( categorydata.stock);
await categoryCollection.insertMany([categorydata])
    res.redirect("/admin/Categorydetails")
   
};







//ProductGet---------------
exports.productGet = async (req, res) => {

    res.render("Admin/product")
};





//DashboardGet---------------
exports.dashboard = async (req, res) => {

    res.render('Admin/Dashboard')
}





//Blocking User---------------
exports.blockUser = async (req, res) => {
try {
    const userid = req.params.id
    const user = await UserCollection.findById(userid)
    user.blockStatus = !user.blockStatus
    await user.save()
    res.redirect("/admin/userdetails") 
} catch (error) {
    console.error("error",error);
}
};



//blockcategory-------------
exports.blockcategory = async (req, res) => {
try {
    const categoryid = req.params._id
    // console.log(categoryid);
    const category = await categoryCollection.findById({_id:categoryid})
    // console.log('category.blockStatus', category.blockStatus);
    category.blockStatus = !category.blockStatus
 
    await category.save()
    res.redirect("/admin/Categorydetails") 
} catch (error) {
    console.error("error",error);
}
}





//LogoutGet------------
exports.logoutGet = (req, res) => {
    console.log('logout', req.session.adminID);
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





//adding category----------------
exports.addcategoryGet = async (req, res) => {
    
    res.render('Admin/categoryadd');
};
exports.addcategoryPost = async (req, res) => {
 
   
    let categorydetails = {
        categoryname: req.body.categoryname,
        description: req.body.Description,
        stock: req.body.stock,
        price: req.body.price
    };
    await categoryCollection.updateOne({ _id: categoryId }, { $set: categorydetails })
    res.redirect('/Categorydetails');
};

//editing category------------------
exports.editcategoryGet = async (req, res) => {
    const categoryid=req.params._id
 
    const categorydata = await categoryCollection.findOne({_id:categoryid})
    res.render('Admin/categoryedit',{categorydata});
};
exports.editcategoryPost = async (req, res) => {
    const categoryid=req.params._id
   
    let categorydetails = {
        categoryname: req.body.categoryname,
        description: req.body.Description,
        stock: req.body.stock,
        price: req.body.price
    };
    await categoryCollection.updateOne({ _id: categoryid }, { $set: categorydetails },{upsert:true})
    res.redirect('/admin/Categorydetails');
};




