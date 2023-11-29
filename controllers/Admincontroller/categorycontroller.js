const { categoryCollection } = require("../../model/categoryDB");
const path = require('path');
const { log } = require("console");





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
        const a = categorydata.categoryname;
        const existingCategory = await categoryCollection.findOne({ a: { $regex: new RegExp('^' + categorydata.categoryname + '$', 'i') } });


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
    await categoryCollection.updateOne({ _id: categoryid }, { $set: categorydetails }, { upsert: true })
    res.redirect('/admin/Categorydetails');
};





//blockcategory------------------------------------------------------
exports.blockcategory = async (req, res) => {
    try {
        const categoryid = req.params._id
        const category = await categoryCollection.findById({ _id: categoryid })
        category.blockStatus = !category.blockStatus

        await category.save()
        res.redirect("/admin/Categorydetails")
    } catch (error) {
        console.error("error", error);
    }
};
