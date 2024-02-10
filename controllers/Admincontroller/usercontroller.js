
const { UserCollection } = require("../../model/userDB");
const { CouponCollection } = require("../../model/couponDB");
const { contactCollection } = require("../../model/contactDB");
const path = require('path');
const { log } = require("console");




exports.reviewget = async (req, res) => {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 7; // Set the number of products per page
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const data = await contactCollection.find()
        .skip(skip)
        .limit(limit);
    data.reverse()
    const totalcontact = await contactCollection.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalcontact / limit);

    // Adjust current page if it exceeds total pages
    const currentPage = Math.min(page, totalPages);




    res.render('Admin/Reviews', { reviewdata: data, page: 5, totalPages, currentPage })
};






//userGet--------------==========================================================================
exports.UserGet = async (req, res) => {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Set the number of products per page
    const skip = (page - 1) * limit;
    const demo = await UserCollection.find()
    // console.log(demo);
    // Fetch products with pagination
    const data = await UserCollection.find()
        .skip(skip)
        .limit(limit);
    data.reverse()
    const totaluser = await UserCollection.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totaluser / limit);

    // Adjust current page if it exceeds total pages
    const currentPage = Math.min(page, totalPages);



    res.render("Admin/Users", { admin: data, page: 2, totalPages, currentPage })
};



//Blocking User----------------------------------------------------------------------
exports.blockUser = async (req, res) => {
    try {
        console.log('Blocked user');

        const userId = req.query.userid;
        // console.log(userId);
        // Find user by ID      
        const user = await UserCollection.findOne({ _id: userId });
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