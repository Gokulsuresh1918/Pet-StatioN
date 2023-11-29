
const { categoryCollection } = require("../../model/categoryDB");
const { productCollection } = require("../../model/productDB");

const mongoose = require("mongoose")
const path = require('path');
const { log } = require("console");




//ProductGet----------------------------------------
exports.productGet = async (req, res) => {
    const productdata = await productCollection.find()
    res.render("Admin/product", { productdata })
};




exports.imagedelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Convert id to a valid ObjectId
        const validId = new mongoose.Types.ObjectId(id);
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

    res.render('Admin/productadd', { categoryoption })

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


        res.render('Admin/productedit', { productdata, categoryoption })
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








