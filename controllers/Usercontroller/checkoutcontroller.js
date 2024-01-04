const { productCollection } = require('../../model/productDB')
const { addressCollection } = require('../../model/addressDB')
const { orderCollection } = require('../../model/orderDB')
const { cartCollection } = require('../../model/cartDB')
const { contactCollection } = require('../../model/contactDB')
const { CouponCollection } = require('../../model/couponDB')
const Razorpay = require('razorpay');
const { UserCollection } = require('../../model/userDB')
const { loginGet } = require('./publiccontroller')

exports.checkoutget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const products = await productCollection.find()
            let qtyError = false
            const cartdetails = await cartCollection.findOne({ userId: req.session.userId })
            // const a = cartdetails[0].products
            // const result = cartdetails.products.filter(item => item.quantity === 1);
            // console.log("dfasjkgh", result);
            cartdetails.products.forEach(prod => {
                let productQty
                products.forEach((ele) => {
                    if (ele._id.equals(prod.productId)) {
                        productQty = ele.qty
                    }
                })

                // console.log(product.qty+" producty "+prod.quantity);
                if (productQty < prod.quantity) {
                    qtyError = true
                }
            });
            if (qtyError) {
                return res.redirect('/cart?err="OOF')

            }
            const userdata = await UserCollection.findOne({ _id: req.session.userId });
            const wallet = userdata.wallet

            const cartcount = cartdetails[0]?.products.length
            const productdetails = await productCollection.find();
            req.session.productData = productdetails
            const addressdetails = await addressCollection.find({ userId: req.session.userId });
            res.render('User/checkout', { cartdetails: cartdetails, productdetails: productdetails, addressdetails: addressdetails, user, cartcount, wallet });
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




exports.confirmationget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            res.render('User/confirmation', { user, cartcount })
        } else {
            const user = false
            res.render('User/confirmation', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("confirmationget  error" + "= " + error);
    }
};



exports.confirmationpost = async (req, res) => {
    try {
        if (!req.body.razorpay_payment_id) {
            const userId = req.session.userId;
            const productDetails = req.body.orderDetails;
            //stock management
            const productid = productDetails.map(ele=>ele.productId)
            const stockmanage = await productCollection.findOne({ _id: productid })
            stockmanage.qty-=Number(productDetails[0].quantity)
            stockmanage.save()

            const paymentMode = req.body.paymentMode
            const orderNumber = generateOrderNumber();
            const total = calculateTotal(productDetails);
            const address = await addressCollection.findById(req.body.addressid)
            const currentstatus = "pending"
            const newOrder = new orderCollection({
                userId,
                productdetails: productDetails,
                Ordernumber: orderNumber,
                total,
                address,
                payment: paymentMode,
                status: currentstatus
            });
            await newOrder.save();
            await cartCollection.deleteMany({});
            res.status(200).json({ success: true, message: 'Order placed successfully!' });
        } else {
            var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
            let data = await instance.payments.fetch(req.body.razorpay_payment_id)
            const userId = req.session.userId;
            const orderNumber = generateOrderNumber();
            const cartDetails = await cartCollection.findOne({ userId: userId })
                 
            const address = await addressCollection.findById(data.notes.address)
            const productDetails = cartDetails.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                uniquePriceTotal: Number(product.price) * Number(product.quantity)
            }));
            const currentstatus = "pending"
//here i done stock managewment
              //stock management
              const productid = productDetails.map(ele=>ele.productId)
              const stockmanage = await productCollection.findOne({ _id: productid })
              stockmanage.qty-=Number(productDetails[0].quantity)
              stockmanage.save()
            const paymentMode = data.notes.payment
            const total = productDetails.reduce((acc, product) => acc + product.uniquePriceTotal, 0);
            const newOrder = new orderCollection({
                userId: userId,
                productdetails: productDetails,
                Ordernumber: orderNumber,
                total: total,
                address: address,
                payment: paymentMode,
                status: currentstatus

            });


            await newOrder.save();
            await cartCollection.deleteMany({})
            return res.redirect('/confirmation')
        }
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error ' });
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



exports.razorpaypost = (req, res) => {
    try {
        let amount = req.body.amount
        let instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
        let options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        }
        // Creating the order
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.error(err);
                res.status(500).send("Error creating order");
                return;
            }
            // Add orderprice to the response object
            res.send({ orderId: order.id });
        });
    } catch (error) {
        console.error("Razorpay post error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




exports.walletorder = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productDetails = req.body.orderDetails;
        const paymentMode = req.body.paymentMode
        const orderNumber = generateOrderNumber();
        const total = parseInt(calculateTotal(productDetails));
        const address = await addressCollection.findById(req.body.addressid)
        const currentstatus = "pending"
        const walletAmount = productDetails[0].walletAmount;
        if (walletAmount < total) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        } else {
            const newOrder = new orderCollection({
                userId,
                productdetails: productDetails,
                Ordernumber: orderNumber,
                total,
                address,
                payment: paymentMode,
                status: currentstatus

            });
            const walletDeduction = Math.min(walletAmount, total);
            await newOrder.save();
            await UserCollection.findByIdAndUpdate(userId, { $inc: { wallet: -walletDeduction } });
            await cartCollection.deleteMany({});
            res.status(200).json({ success: true, message: 'Order placed successfully!' });
        }
    } catch (error) {
        console.error('Error walletorder :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



exports.couponapply = async (req, res) => {
    const code = req.params.code
    const subtotal = req.body.subtotal
    const coupon = await CouponCollection.find({ code: code })
    if (subtotal > coupon[0].minimumPurchase) {
        if (coupon.length > 0) {
            res.json({ type: coupon[0].discountType, value: coupon[0].discountValue });
        } else {
            res.json({ message: "Coupon not found or invalid" });
        }
    } else {
        res.json({ message: `Minimum amount required ${coupon[0].minimumPurchase}` });
    }
}


















function generateOrderNumber() {
    return 'ORD' + Date.now();
}
function calculateTotal(productDetails) {
    return productDetails.reduce((total, product) => total + parseFloat(product.uniquePriceTotal), 0).toString();
}

