const { productCollection } = require('../../model/productDB')
const { addressCollection } = require('../../model/addressDB')
const { orderCollection } = require('../../model/orderDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')


exports.checkoutget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdetails = await cartCollection.find()
            const productdetails = await productCollection.find();
            const addressdetails = await addressCollection.find({ userId: req.session.userId });
            res.render('User/checkout', { cartdetails: cartdetails, productdetails: productdetails, addressdetails: addressdetails, user });
        } else {
            const user = false
            res.render('User/checkout', { user })
        }
    } catch (error) {
        console.error("checkoutget  error" + "= " + error);
    }





};

exports.checkoutaddress = async (req, res) => {
    try {
        const addnewaddress = addressCollection({
            userId: req.session.userId,
            name: req.body.name,
            address: req.body.homeaddress,
            district: req.body.district,
            pincode: req.body.pincode,
            phone: req.body.phone,
            email: req.body.email,
            state: req.body.state
        })
        await addnewaddress.save()
        res.redirect('/checkout')
    } catch (error) {
        console.error("checkoutaddress  error" + "= " + error);
    }

}




exports.confirmationget = ((req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            res.render('User/confirmation', { user })
        } else {
            const user = false
            res.render('User/confirmation', { user })
        }
    } catch (error) {
        console.error("confirmationget  error" + "= " + error);
    }
});



exports.confirmationpost = async (req, res) => {
    try {
        const { orderDetails, addressid } = req.body;
        console.log('Received order details:', orderDetails);
        console.log('Received adress details:', addressid);

        let totalsum = 0;
        orderDetails.forEach(detail => {
            totalsum += Number(detail.uniquePriceTotal);
        });

        const userId = req.session.userId;
        const addressdata = await addressCollection.findById({ _id: addressid });
        const Ordernumber = Math.floor(10000000 + Math.random() * 90000000);

        let shippingAddress = "";
        shippingAddress = shippingAddress + addressdata.address + ".";
        const data = {
            productdetails: orderDetails,
            total: totalsum,
            address: shippingAddress,
            Ordernumber: Ordernumber,
            userId: userId
        };
        await orderCollection.insertMany([data]);
        await cartCollection.deleteMany({ userId: userId });
        res.json({ success: true, message: 'Order confirmed successfully' });
    } catch (error) {
        console.error("confirmationpost error" + "= " + error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.addressremove = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const result = await addressCollection.deleteOne({ id: addressId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Address removed successfully' });
        } else {
            res.status(404).json({ error: 'Address not found' });
        }
    } catch (error) {
        console.error('Error removing address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



