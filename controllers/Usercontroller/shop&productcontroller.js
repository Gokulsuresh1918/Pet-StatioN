const { productCollection } = require('../../model/productDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')
const { Wishlistcollection } = require('../../model/wishlistDb')
const { UserCollection } = require('../../model/userDB')
const { offerCollection } = require('../../model/offerDB')





exports.shopget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const productdata = await productCollection.find()
            productdata.reverse()
            res.render('User/shop', { productdata, user, cartcount })
        } else {
            const user = false
            const productdata = await productCollection.find()
            res.render('User/shop', { productdata, user, cartcount: 0 })
        }
    } catch (error) {
        console.error("shopget error" + "= " + error);
    }
};




exports.wishlistget = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.id;
        const productData = await productCollection.findOne({ _id: productId });

        const wishlistEntry = await Wishlistcollection.findOneAndUpdate(
            { userId: userId },
            {
                $addToSet: {
                    items: { productId: productId }
                }
            },
            { upsert: true, new: true }
        );

        const wishlistdata = await Wishlistcollection.find({ userId: userId });

        res.status(200).json({ productData, wishlistdata });
    } catch (error) {
        console.error("wishlist error" + "= " + error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.productView = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const productdata = await productCollection.findOne({ _id: req.params.id });
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const currentdate = new Date()
            const offers = await offerCollection.find({ startDate: { $lte: currentdate }, endDate: { $gte: currentdate } })
            res.render('User/productview', { productdata, user, cartcount, offers })
        } else {
            const user = false
            res.render('User/productview', { productdata, user, cartcount: 0 })
        }
    } catch (error) {
        console.error("productView  error" + "= " + error);
    }
}


exports.cartGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdetails = await cartCollection.findOne({ userId: req.session.userId });
            const productdetails = await productCollection.find();
            res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails, user });
        } else {
            const user = false
            res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails, user });
        }
    } catch (error) {
        console.error("aboutget  error" + "= " + error);
    }
};




exports.wishlistdataget = async (req, res) => {
    try {
        const wishlistdata = await Wishlistcollection.findOne({ userId: req.session.userId })
        const cartdata = await cartCollection.find({ userId: req.session.userId });
        cartcount = cartdata[0]?.products.length;
        const productData = await productCollection.find();
        res.render('User/wishlist', { wishlistdata, cartcount, productData });
    } catch (error) {
        console.error("wishlistdataget error: ", error);
        res.status(500).send("Internal Server Error");
    }
};

