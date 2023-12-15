const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');


var CouponSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserCollection',
            required: true
        },
        code: {
            type: String,
            require: true,
            unique: true,
        },
        discountType: {
            type: String,
            enum: ['Percentage', 'Fixed Amount'], // Assuming two types of discounts
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        minimumPurchase: {
            type: Number,
            default: 0, // Assuming a default value of 0 if not provided
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    });


const CouponCollection = new mongoose.model('CouponCollection', CouponSchema);
module.exports = { CouponCollection };



