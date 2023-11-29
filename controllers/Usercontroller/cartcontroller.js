const { productCollection } = require('../../model/productDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')
const { ObjectId } = require('mongoose').Types;


exports.cartGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdetails = await cartCollection.findOne({ userId: req.session.userId });
            const productdetails = await productCollection.find();
            res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails, user });
        } else {
            const user = false
            res.render('User/cart', { user })
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
            let productPrice = await productCollection.findOne({ _id: productId }, { _id: 0, price: 1 });

            const cart = await cartCollection.findOne({ userId: user });
            if(!cart){
                productPrice = productPrice.price;
                let subtotal = productPrice * parseInt(qty);
                console.log("data chrck"+productPrice,subtotal,user);
                let cart= {
                    userId: user,
                 products:[{
                    quantity:qty,
                    productId:productId
                 }],
                 subtotal:subtotal
                }
                await cartCollection.insertMany(cart);
            }else{

            const existingProduct = cart.products.findIndex((item) => item.productId.equals(productId))
            console.log("index fo "+existingProduct);
            if (existingProduct==-1 ) {
               cart.products.push(
                {
                    quantity:qty,
                    productId:productId
                 }
               )
                await cart.save()
            } else {
                // parseInt is used here because here in my schema i use quantity as string

                cart.products[existingProduct].quantity+=parseInt(qty)
               await cart.save()

               console.log("THeis is cart"+cart);
            }
        }

        } else {
            res.json({ message: "noUser" });
        }
    } catch (error) {
        console.error("addcartpost error" + "= " + error);
    }
}



exports.clearcartget = async (req, res) => {
    await cartCollection.deleteMany({});
    res.redirect('/cart');
};






exports.removeItem = async (req, res) => {
    const productId = req.params.productId;

    try {
        const objectIdProductId = new ObjectId(productId);
        console.log(objectIdProductId);
        const a = await cartCollection.findOne({ productId: { $in: [objectIdProductId] } });
        console.log(a);
        if (a) {
            // If the item is found, you can proceed with deleting it
            const result = await cartCollection.deleteOne({ productId: { $in: [objectIdProductId] } });

            if (result.deletedCount === 1) {
                const updatedCart = await cartCollection.find({ userId: req.session.userId });
                res.json({ success: true, cart: updatedCart });
            } else {
                res.status(404).json({ success: false, error: 'Item not found' });
            }
        } else {
            // Handle the case where the item with the given productId is not found
            res.status(404).json({ success: false, error: 'Item not found' });
        }
    } catch (error) {
        console.error("removeitem error" + "= " + error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};