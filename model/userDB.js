const mongoose = require('mongoose')


const UserLoginSchema = new mongoose.Schema({
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
    referal:{
        type:String
    },
    otp:{
        type: Number,
    },
    wallet:{
        type:Number,
        default:0
    }
});

const UserCollection = new mongoose.model('UserCollection', UserLoginSchema)
module.exports = { UserCollection }