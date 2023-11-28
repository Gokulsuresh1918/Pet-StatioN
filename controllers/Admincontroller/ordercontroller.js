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












//OrderGet------------------------------------------------------------------------
exports.orderGet = async (req, res) => {
   
    const orderdata = await orderCollection.find()
    
       res.render("Admin/order",{orderdata})
   };

   
