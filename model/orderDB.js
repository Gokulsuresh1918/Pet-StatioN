const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderCollection"
    }],
    price: {
        type: String, // Fix the typo here: typw -> type
        required: true
    },
    quantity: [{
        type: String,
        required: true
    }],
    subtotal: {
        type: String,
        required: true
    }
});

const orderCollection = new mongoose.model('orderCollection', orderschema);
module.exports = { orderCollection };
