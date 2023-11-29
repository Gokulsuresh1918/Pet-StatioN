const { productCollection } = require('../../model/productDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')







exports.shopget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const productdata = await productCollection.find()
            res.render('User/shop', { productdata, user })
        } else {
            const user = false
            const productdata = await productCollection.find()
            res.render('User/shop', { productdata, user })
        }
    } catch (error) {
        console.error("shopget error"+"= "+error); 
    }
};


exports.productView = async (req, res) => {
try {
    if (req.session.userId) {
        const user = true
        const productdata = await productCollection.findOne({ _id: req.params.id });

        res.render('User/productview', { productdata,user })
    } else {
        const user = false
        res.render('User/productview', { productdata,user })
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
        res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails,user });
    } else {
        const user = false
        res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails,user });
    }
} catch (error) {
    console.error("aboutget  error" + "= " + error);
}
};
