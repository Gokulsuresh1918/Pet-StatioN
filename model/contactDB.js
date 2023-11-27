const mongoose = require('mongoose')


const contactschema = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"UserCollection",
   }, 
   name: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
 

});

const contactCollection = new mongoose.model('contactCollection', contactschema)
module.exports = { contactCollection }