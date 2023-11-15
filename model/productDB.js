const mongoose = require('mongoose')


const productschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    image:[{
        type:String,
        // required:true
    }]

});

const productCollection = new mongoose.model('productCollection',productschema)
module.exports={productCollection}