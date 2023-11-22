const { adminCollection } = require("../model/adminDB");
const { UserCollection } = require("../model/userDB");
const { categoryCollection } = require("../model/categoryDB");
const { productCollection } = require("../model/productDB");
const multer = require('multer')
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
        console.log(admindata);
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
}



//userGet--------------==========================================================================
exports.UserGet = async (req, res) => {
    const admin = await UserCollection.find()
    res.render("Admin/Users", { admin })
};

//Blocking User----------------------------------------------------------------------
exports.blockUser = async (req, res) => {
    try {
        console.log('blocked user');
        console.log(req.query);
        console.log(req.params);
        const userid = req.query.id
        const user = await UserCollection.findById(userid)
        console.log(blockStatus);
        user.blockStatus = !user.blockStatus
        await user.save()
        res.redirect("/admin/userdetails")
    } catch (error) {
        console.error("error", error);
    }
};



//OrderGet------------------------------------------------------------------------
exports.orderGet = async (req, res) => {
    res.render("Admin/order")
};






//CategoryGet---------============================================================
exports.categoryGet = async (req, res) => {
    try {
        if (req.session.adminID) {
            let admin = false
            const categorydata = await categoryCollection.find()

            res.render("Admin/category", { categorydata, admin })
        } else {
            let admin = true
            res.render('/Admin/adminLogin', { admin, errmsg: "Please login" })
        }
    } catch (error) {
        console.log(error.message);
    }
};
//category post0-----------------------------------------------------------------------------
exports.categorypost = async (req, res) => {
    try {
      
        const categorydata = {
            categoryname: req.body.categoryname, 
            description: req.body.description,
        };
     
        const existingCategory = await categoryCollection.findOne({ categoryname: { $regex: new RegExp('^' + categorydata.categoryname + '$', 'i') } });

        console.log("hello" + "  " + existingCategory.categoryname);
        if (existingCategory === req.body.categoryname) {
         
            res.redirect("/admin/Categorydetails");
        } else {
            await categoryCollection.insertMany([categorydata]);
            res.redirect("/admin/Categorydetails");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

//blockcategory------------------------------------------------------
exports.blockcategory = async (req, res) => {
    try {
        const categoryid = req.params._id
        // console.log(categoryid);
        const category = await categoryCollection.findById({ _id: categoryid })
        // console.log('category.blockStatus', category.blockStatus);
        category.blockStatus = !category.blockStatus

        await category.save()
        res.redirect("/admin/Categorydetails")
    } catch (error) {
        console.error("error", error);
    }
};

//adding category-------------------------------------------
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
    const check = await categoryCollection.find({ categoryname })
    if (check.categoryname === req.body.categoryname) {
        res.redirect('/addcategory', { message: "category Exicts" })
    }
    await categoryCollection.updateOne({ _id: categoryId }, { $set: categorydetails })
    res.redirect('/Categorydetails');
};

//editing category-----------------------------------------------------------------
exports.editcategoryGet = async (req, res) => {
    const categoryid = req.params._id

    const categorydata = await categoryCollection.findOne({ _id: categoryid })
    res.render('Admin/categoryedit', { categorydata });
};
exports.editcategoryPost = async (req, res) => {
    const categoryid = req.params._id

    let categorydetails = {
        categoryname: req.body.categoryname,
        description: req.body.description,
       
    };
    console.log(categorydetails);
    await categoryCollection.updateOne({ _id: categoryid }, { $set: categorydetails }, { upsert: true })
    res.redirect('/admin/Categorydetails');
};




//DashboardGet---------------------------------------------------------------------------------
exports.dashboard = async (req, res) => {
    const admin = true
    res.render('Admin/Dashboard', { admin, errmsg: "please login" })
}







//ProductGet----------------------------------------
exports.productGet = async (req, res) => {
    const productdata = await productCollection.find()

    res.render("Admin/product", { productdata })
};
exports.productpost = async (req, res) => {
    const id = req.params.id

    let productdetails = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        discount: req.body.discount,
        qty: req.body.qty,
    };
    await productCollection.updateOne({ _id: id }, { $set: productdetails })

    res.redirect('/admin/productdetails')

};



//product add------------------
exports.productaddGet = async (req, res) => {
    try {
        res.render('Admin/productadd')
    } catch (error) {
        console.log(error);
    }
};

exports.productaddpost = async (req, res, next) => {
    try {

        const files = req.files

        const product = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            qty: req.body.qty,
            image: files.map(file => file.filename)
            ,
        }

        await productCollection.insertMany([product])
        res.redirect("/admin/productdetails")
    } catch (error) {
        console.log(error);

    }

}




exports.editproductGet = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const productdata = await productCollection.findById(id)
        console.log(productdata);

        res.render('Admin/productedit', { productdata, admin: false })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal error")
    }
}

exports.editproductpost = async (req, res) => {

    try {

        const id = req.params.id
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            discount: req.body.discount,
            qty: req.body.qty,
        };



        await productCollection.findByIdAndUpdate(id, updatedData);
        res.redirect('/admin/productdetails');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error");
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



