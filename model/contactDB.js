
const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');


const contactschema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
   },
   name: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
   },
   email: {
      type: String,
      required: true
   },
   message: {
      type: String,
      required: true
   },
});

const contactCollection = mongoose.model('contactCollection', contactschema);

module.exports = { contactCollection };
