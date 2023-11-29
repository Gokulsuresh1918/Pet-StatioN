const mongoose = require('mongoose')


const cartschema = new mongoose.Schema({
  userId: {
      type: String,
      required: true
   },
   products:[{
      quantity:{
         type: String,
         required: true
      },
      productId:{
         type:mongoose.Schema.Types.ObjectId,
         required:true
      }
   }],
 
   subtotal:{
      type: String,
      required: true
   }
});

const cartCollection = new mongoose.model('cartCollection', cartschema)
module.exports = { cartCollection }