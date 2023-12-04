const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');
const addressschema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",

   },
   name: {
      type: String,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   district: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   pincode: {
      type: String,
      required: true
   },
   state: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   }

});
const orderschema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.ObjectId,
      ref: "UserCollection",

   },
   productdetails: [{
      productId: {
         type: mongoose.Schema.ObjectId,
         required: true
      },
      quantity: {
         type: Number,
         required: true
      },
      uniquePriceTotal: {
         type: Number,
         required: true
      }
   }],

   Ordernumber: {
      type: String,
      required: true
   },
   total: {
      type: Number,
      required: true
   },
   address: addressschema,
   payment: {
      type: String,
      required: true
   },
   status: {type: String },

}, { timestamps: true });

const orderCollection = new mongoose.model('orderCollection', orderschema);
module.exports = { orderCollection };
