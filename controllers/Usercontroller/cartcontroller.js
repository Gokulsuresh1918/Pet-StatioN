const { productCollection } = require('../../model/productDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB');
const { Wishlistcollection } = require('../../model/wishlistDb');
const { ObjectId } = require('mongoose').Types;


exports.cartGet = async (req, res) => {
    try {
        let err=req.query.err??''
        if (req.session.userId) {
            const user = true
            const cartdetails = await cartCollection.findOne({ userId: req.session.userId });
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const productdetails = await productCollection.find();
            // console.log(cartdetails);

            res.render('User/cart', { cartdetails: cartdetails, cartcount, productdetails: productdetails, user,err:err });
        } else {
            const user = false
            res.render('User/cart', { user, cartcount: 0 ,err:err})
        }
    } catch (error) {
        console.error("cartget  error" + "= " + error);
    }
}




exports.addcartpost = async (req, res) => {
    const user = req.session.userId;
    try {
        if (user) {
            const productId = req.body.productId;

            const qty = req.body.quantity;
            const price = req.body.price;
            let productPrice = await productCollection.findOne({ _id: productId }, { _id: 0, price: 1 });
            const cart = await cartCollection.findOne({ userId: user });
            
            if (!cart) {
                productPrice = productPrice.price;
                let subtotal = productPrice * parseInt(qty);
                let cart = {
                    userId: user,
                    products: [{
                        quantity: qty,
                        productId: productId,
                        price: productPrice
                    }],
                    subtotal: subtotal
                }
                await cartCollection.insertMany(cart);
            } else {

                const existingProduct = cart.products.findIndex((item) => item.productId.equals(productId))
                    ;
                if (existingProduct == -1) {
                    const productPriceData = await productCollection.findOne({ _id: productId }, { _id: 0, price: 1 });
                    const productPrice = productPriceData.price; // Extract the price property
                    cart.products.push(
                        {
                            quantity: qty,
                            productId: productId,
                            price: productPrice,
                        }
                    )
                    await cart.save()
                } else {
                    // parseInt is used here because here in my schema i use quantity as string

                    cart.products[existingProduct].quantity += parseInt(qty)
                    await cart.save()

                    // console.log("THeis is cart" + cart);
                }
            }

        } else {
            res.json({ message: "noUser" });
        }
    } catch (error) {
        console.log("addcartpost error" + "= " + error);
    }
}



exports.clearcartget = async (req, res) => {
    await cartCollection.deleteMany({});
    res.redirect('/cart');
};




exports.clearwishlistget = async (req, res) => {
    await Wishlistcollection.deleteMany({});
    res.redirect('/wishlist');
};







//new
exports.removeItem = async (req, res) => {
    const productId = req.params.productId;
    try {
        const cart = await cartCollection.findOne({ 'products.productId': new ObjectId(productId) });
        if (cart) {
            const result = await cartCollection.updateOne(
                { _id: cart._id },
                { $pull: { products: { productId: new ObjectId(productId) } } }
            );
            if (result.modifiedCount === 1) {
                const updatedCart = await cartCollection.findOne({ _id: cart._id });
                res.json({ success: true, cart: updatedCart });
            } else {
                res.status(404).json({ success: false, error: 'Item not found' });
            }
        } else {
            res.status(404).json({ success: false, error: 'Item not found' });
        }

    } catch (error) {
        console.error('removeItem error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};