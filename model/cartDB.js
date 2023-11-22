const mongoose = require('mongoose')


const cartschema = new mongoose.Schema({
  userId: {
      type: String,
      required: true
   },
   productId:[{
      type: String,
      required: true
   }],
   quantity:[{
      type: String,
      required: true
   }],
   subtotal:{
      type: String,
      required: true
   }
});

const cartCollection = new mongoose.model('cartCollection', cartschema)
module.exports = { cartCollection }