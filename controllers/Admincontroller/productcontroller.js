
const { categoryCollection } = require("../../model/categoryDB");
const { productCollection } = require("../../model/productDB");

const mongoose = require("mongoose")
const path = require('path');
const { log } = require("console");




//ProductGet----------------------------------------
exports.productGet = async (req, res) => {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 2; // Set the number of products per page
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const data = await productCollection.find()
        .skip(skip)
        .limit(limit);
    data.reverse()
    const totalProducts = await productCollection.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    // Adjust current page if it exceeds total pages
    const currentPage = Math.min(page, totalPages);

    res.render("Admin/product", { productdata:data, page: 8, totalPages, currentPage })
};




exports.imagedelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Convert id to a valid ObjectId
        // const validId = new mongoose.Types.ObjectId(id);
        const productData = await productCollection.findByIdAndUpdate(
            { _id: id },
            { $pull: { image: req.params.image } },
            { new: true }
        );

        res.redirect(`/admin/productedit/${productData._id}`);
    } catch (error) {
        console.error('Error in imagedelete:', error.message);
        res.status(500).send('Internal error');
    }
};




//product add------------------
exports.productaddGet = async (req, res) => {
    const categoryoption = await categoryCollection.find()

    res.render('Admin/productadd', { categoryoption, page: 1 })

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
        const productdata = await productCollection.findById(id)
        const categoryoption = await categoryCollection.find()


        res.render('Admin/productedit', { productdata, categoryoption, page: 1 })
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
            category: req.body.categoryname,
            price: req.body.price,
            qty: req.body.qty,
        };



        await productCollection.findByIdAndUpdate(id, updatedData);
        res.redirect('/admin/productdetails');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error");
    }
}








