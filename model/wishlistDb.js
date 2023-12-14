const mongoose = require('mongoose');
const { UserCollection } = require('./userDB');


const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserCollection',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    }],
}, { timestamps: true });

const Wishlistcollection =new mongoose.model('Wishlistcollection', wishlistSchema);

module.exports = {Wishlistcollection};
