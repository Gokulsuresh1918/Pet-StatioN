
const mongoose = require('mongoose')


const tempLoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    blockStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    wallet:{
        type:Number,
        default:0
    },
    otp:{
        type:Number
    },
    referal:{
        type:String
    }
});

const tempCollection = new mongoose.model('tempCollection', tempLoginSchema)
module.exports = { tempCollection }