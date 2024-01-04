const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');

const walletschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCollection",
    },
    transactionAmount: {
        type: Number,
    },
    description: {
        type: String,
    },
    orderId:{
        type:String
    }
}, { timestamps: true });

const walletcollection = mongoose.model('walletcollection', walletschema);

module.exports = { walletcollection };
