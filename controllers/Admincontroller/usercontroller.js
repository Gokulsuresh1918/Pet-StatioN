const { adminCollection } = require("../../model/adminDB");
const { UserCollection } = require("../../model/userDB");
const { categoryCollection } = require("../../model/categoryDB");
const { productCollection } = require("../../model/productDB");
const { orderCollection } = require("../../model/orderDB");
const { contactCollection } = require("../../model/contactDB");
const mongoose = require("mongoose")
const multer = require('multer')
const path = require('path');
const { log } = require("console");




exports.reviewget = async (req, res) => {
    const reviewdata = await contactCollection.find()
    res.render('Admin/Reviews', { reviewdata})
};





//userGet--------------==========================================================================
exports.UserGet = async (req, res) => {
    const admin = await UserCollection.find()
    res.render("Admin/Users", { admin })
};



//Blocking User----------------------------------------------------------------------
exports.blockUser = async (req, res) => {
    try {
        console.log('Blocked user');
        console.log(req.query);
        // console.log(req.params);

        const userId = req.query.id;

        // Find user by ID
        const user = await UserCollection.findOne(userId);
        console.log(user);
        if (!user) {
            console.log('User not found');
            // Handle the case where the user is not found
            return res.status(404).send('User not found');
        }

        // Toggle blockStatus
        user.blockStatus = !user.blockStatus;

        // Update user blockStatus
        await user.save();

        console.log('User updated:', user);

        res.redirect("/admin/userdetails");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
};