
const { orderCollection } = require("../../model/orderDB");
const { contactCollection } = require("../../model/contactDB");

const path = require('path');
const { log } = require("console");












//OrderGet------------------------------------------------------------------------
exports.orderGet = async (req, res) => {
   
    const orderdata = await orderCollection.find()
    
       res.render("Admin/order",{orderdata})
   };

   
