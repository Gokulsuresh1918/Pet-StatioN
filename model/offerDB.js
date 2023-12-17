const mongoose = require('mongoose')

const OfferSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    code: {
        type: String,
    },
    discount: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableProducts: [{
        type: String,
    }],
    applicableCategories: [{
        type: String,
    }],
});


const offerCollection = new mongoose.model('offerCollection', OfferSchema)
module.exports = { offerCollection }