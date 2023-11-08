const mongoose = require('mongoose')


const adminLoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const adminCollection = new mongoose.model('adminCollection',adminLoginSchema)
module.exports={adminCollection}