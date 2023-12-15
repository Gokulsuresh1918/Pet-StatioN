
const { UserCollection } = require("../../model/userDB");
const { contactCollection } = require("../../model/contactDB");
const path = require('path');
const { log } = require("console");




exports.reviewget = async (req, res) => {
    const reviewdata = await contactCollection.find()
    reviewdata.reverse()
    res.render('Admin/Reviews', { reviewdata})
};



exports.couponGet = async (req, res) => {
    res.render('Admin/coupon')
};





//userGet--------------==========================================================================
exports.UserGet = async (req, res) => {
    const admin = await UserCollection.find()
    admin.reverse()
    res.render("Admin/Users", { admin })
};



//Blocking User----------------------------------------------------------------------
exports.blockUser = async (req, res) => {
    try {
        console.log('Blocked user');

        const userId = req.query.id;

        // Find user by ID
        const user = await UserCollection.findOne(userId);
        if (!user) {
            console.log('User not found');
            // Handle the case where the user is not found
            return res.status(404).send('User not found');
        }

        // Toggle blockStatus
        user.blockStatus = !user.blockStatus;

        // Update user blockStatus
        await user.save();


        res.redirect("/admin/userdetails");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
};