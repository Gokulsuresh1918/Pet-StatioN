const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productdetails: [{
        productName: {
          type: String,
          required: true
        },
        quantity: {
          type: String,
          required: true
        },
        uniquePriceTotal: {
          type: String,
          required: true
        }
      }],
      
    Ordernumber: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    // payment: {
    //     type: String,
    //     required: true
    // }
});

const orderCollection = new mongoose.model('orderCollection', orderschema);
module.exports = { orderCollection };
