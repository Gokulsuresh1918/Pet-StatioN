const mongoose = require('mongoose')


const addressschema = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"UserCollection",
      
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

const addressCollection = new mongoose.model('addressCollection', addressschema)
module.exports = { addressCollection }