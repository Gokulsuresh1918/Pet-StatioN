const { productCollection } = require('../../model/productDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')
const { Wishlistcollection } = require('../../model/wishlistDb')
const { UserCollection } = require('../../model/userDB')
const { offerCollection } = require('../../model/offerDB')
const { categoryCollection } = require('../../model/categoryDB')
const { orderCollection } = require('../../model/orderDB')
const ejs = require('ejs')
const path = require('path')



exports.shopget = async (req, res) => {
    try {
        let categoryNames = '';
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length

            const categories = await categoryCollection.find({ blockStatus: true }, 'categoryname');
            categoryNames = categories.map(category => category.categoryname);



            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = 4; // Set the number of products per page
            const skip = (page - 1) * limit;


            // Fetch products with pagination
            const data = await productCollection.find({ blockStatus: true })
                .skip(skip)
                .limit(limit);
            data.reverse()
            const totalProducts = await productCollection.countDocuments();

            // Calculate total number of pages
            const totalPages = Math.ceil(totalProducts / limit);

            // Adjust current page if it exceeds total pages
            const currentPage = Math.min(page, totalPages);


            res.render('User/shop', { productdata: data, user, cartcount, totalPages, currentPage, categoryNames })
        } else {
            const user = false



            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = 4; // Set the number of products per page
            const skip = (page - 1) * limit;
            // Fetch products with pagination
            const data = await productCollection.find({ blockStatus: true })
                .skip(skip)
                .limit(limit);
            data.reverse()

            const totalProducts = await productCollection.countDocuments();

            // Calculate total number of pages
            const totalPages = Math.ceil(totalProducts / limit);

            // Adjust current page if it exceeds total pages
            const currentPage = Math.min(page, totalPages);



            res.render('User/shop', { productdata: data, user, cartcount: 0, totalPages, currentPage, categoryNames })
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
        if (req.session?.userId) {
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

exports.RemoveFromWish = async (req, res) => {
    try {
        const productId = req.params.id;
        const userid = req.session.userId

        const result = await Wishlistcollection.updateOne(
            { userId: userid },
            { $pull: { items: { productId: productId } } }
        );

        console.log(result);

        if (result.modifiedCount > 0) {
            res.json({ message: 'Product removed successfully.' });
        } else {
            res.status(404).json({ message: 'Product not found in the wishlist.' });
        }
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).send({ message: 'An error occurred while trying to remove the product.' });
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

exports.shopsearch = async (req, res) => {

    try {
        const searchQuery = req.query.q;

        const results = await productCollection.find({
            name: { $regex: new RegExp(`^${searchQuery}`, "i") },
        });


        let html = await ejs.renderFile("views/User/search/shopsearch.ejs", {
            productdata: results,
        });
        res.send(html);

    } catch (error) {
        console.error(error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error" });
    }

};
exports.quantityUpdation = async (req, res) => {
    try {
        const { cartId, productId, count } = req.body;
        const userid = req.session.userId
        // Find the cart by ID
        const cart = await cartCollection.findOne({ userId: userid });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product by ID
        const product = await productCollection.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the quantity in the cart's products array
        const productIndex = cart.products.findIndex(item => item.productId.equals(productId));

        if (productIndex !== -1) {
            // Update quantity and calculate subtotal
            if (count == 1) {
                cart.products[productIndex].quantity += 1;
                cart.products[productIndex].subtotal = cart.products[productIndex].quantity * product.price;

            } else {
                cart.products[productIndex].quantity -= 1;
                cart.products[productIndex].subtotal = cart.products[productIndex].quantity * product.price;

            }


            // Save the updated cart
            await cart.save();

            return res.status(200).json({ message: 'Quantity updated successfully', cart });
        } else {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }
    } catch (error) {
        console.error('quantity updation post', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
