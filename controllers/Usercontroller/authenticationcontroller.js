
const { contactCollection } = require('../../model/contactDB')
const { cartCollection } = require('../../model/cartDB')
const { Wishlistcollection } = require('../../model/wishlistDb')



//controller for home get
exports.homeGet = async (req, res) => {

    try {
        if (req.session.userId) {

            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const user = true
            res.render('User/home', { user, cartcount })
        } else {
            const user = false
            res.render('User/home', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("homege get redendering error" + "= " + error);
    }

}

exports.contactGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const user = true
            res.render('User/contact', { user, cartcount })
        } else {
            const user = false
            res.render('User/contact', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("contactget get redendering error" + "= " + error);
    }
}
exports.aboutget = async (req, res) => {

    try {
        if (req.session.userId) {
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const user = true
            res.render('User/about', { user, cartcount })
        } else {
            const user = false
            res.render('User/about', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("aboutget  error" + "= " + error);
    }
}
exports.contactpost = async (req, res, next) => {
    try {
        let { name, lastname, email, message } = req.body;

        // Assuming you have a middleware that adds userId to the request
        const userId = req.session.userId;

        const data = new contactCollection({
            userId: userId,
            name: name,
            lastname: lastname,
            email: email,
            message: message
        });

        await data.save();
        res.render('User/reviewsubmit')
    } catch (error) {
        console.error("contactpost get  error" + "= " + error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


