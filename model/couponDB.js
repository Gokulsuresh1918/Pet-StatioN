const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');


var DiscountCodesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserCollection',
            required: true
        },
        code: {
            type: String,
            require: true,
        },
        isPercent: {
            type: Boolean,
            require: true,
        },
        amount: {
            type: Number,
            required: true
        }, // if is percent, then number must be ≤ 100, else it’s amount of discount
        expireDate: {
            type: String,
            require: true,
            default: ''
        },
        isActive: {
            type: Boolean,
            require: true,
        }
    });


const CouponCollection = new mongoose.model('CouponCollection', DiscountCodesSchema);
module.exports = { CouponCollection };



