const { UserCollection } = require('../../model/userDB')
const { addressCollection } = require('../../model/addressDB')
const { orderCollection } = require('../../model/orderDB')
const { contactCollection } = require('../../model/contactDB')
const { cartCollection } = require('../../model/cartDB')





//profile get 
exports.profileGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const id = req.session.userId
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const userdetails = await UserCollection.findOne({ _id: id })
            res.render('User/userProfile/profile', { user, userdetails, cartcount })
        } else {
            const user = false
            res.render('User/userProfile/profile', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("profileGet  error" + "= " + error);
    }
};




exports.addressGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const address = await addressCollection.find({ userId: req.session.userId });
            address.reverse()
            res.render('User/userProfile/address', { user, cartcount, address, message: "" })
        } else {
            const user = false
            res.render('User/userProfile/address', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("addressGet  error" + "= " + error);
    }
};





exports.addresspost = async (req, res) => {
    try {
        const Address = {
            name: req.body.name,
            address: req.body.homeaddress,
            district: req.body.district,
            pincode: req.body.pincode,
            phone: req.body.phone,
            email: req.body.email,
            state: req.body.state
        }
        // Use Address.name instead of just name
        await addressCollection.updateOne({ name: Address.name }, { $set: Address }, { upsert: true });
        res.render('User/userProfile/address', { address: Address, message: "" });
    }
    catch (error) {
        console.error("addresspost error" + "= " + error);
    }
};








exports.addaddressGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            res.render('User/userProfile/addaddress', { user, cartcount })
        } else {
            const user = false
            res.render('User/userProfile/addaddress', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("addaddressGet  error" + "= " + error);
    }
};



exports.addaddresspost = async (req, res) => {
    try {
        const Address = {
            name: req.body.name,
            userId:req.session.userId,
            address: req.body.homeaddress,
            district: req.body.district,
            pincode: req.body.pincode,
            phone: req.body.phone,
            email: req.body.email,
            state: req.body.state
        } 
        // const address = await addressCollection.find({ phone: req.body.phone })
        try {
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            const check = await addressCollection.find({ phone: req.body.phone })
            if (check[0]) {
                res.render('User/userProfile/address', { check,cartcount, message: "already exicts" })
            } else {
             await addressCollection.insertMany([Address]);
             const  address= await addressCollection.find({ userId: req.session.userId })
             console.log(address);
                res.render('User/userProfile/address', { address, message: "",cartcount:0 })
            }
        } catch (error) {
            console.error(error); hh
        }
    } catch (error) { 
        console.error("addaddresspost  error" + "= " + error);
    }
}






exports.editaddressGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            const cartcount = cartdata[0]?.products.length
            res.render('User/userProfile/editaddress', { user, cartcount })
        } else {
            const user = false
            res.render('User/userProfile/editaddress', { user, cartcount: 0 })
        }
    } catch (error) {
        console.error("editaddressGet  error" + "= " + error);
    }
}


exports.editaddresspost = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const addressid = req.body.id

            const addressedit = await addressCollection.find({ _id: addressid })

            res.render('User/userProfile/editaddress', { addressedit, user })
        } else {
            const user = false
            res.render('User/userProfile/editaddress', { addressedit, user })
        }
    } catch (error) {
        console.error("editaddresspost  error" + "= " + error);
    }
}




exports.addimagepost = async (req, res) => {
    try {
        const userId = req.session.userId; 
        const image = req.body.image;

        // Find the user by ID
        const user = await UserCollection.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's profileImage
        user.profileImage = image
        

        // Save the updated user to the database
        await user.save();

        return res.status(200).json({ message: 'Image added successfully' });
    } catch (error) {
        console.error('Error adding image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}







exports.ordersget = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true


            const orderdata = await orderCollection.find()
            orderdata.reverse()
            const cartdata = await cartCollection.find({ userId: req.session.userId })
            cartdata.reverse()
            const cartcount = cartdata[0]?.products.length

            res.render('User/userProfile/order', { orderdata, user, cartcount })
        } else {
            const user = false
            res.render('User/userProfile/order', { orderdata, user, cartcount: 0 })
        }
    } catch (error) {
        console.error("ordersget  error" + "= " + error);
    }
};
exports.Returnget = async (req, res) => {
    const orderId = req.body.id;
    const orderdata = await orderCollection.findOne({ _id: orderId });
    const total = orderdata.total

    try {
        const userId = req.session.userId;
        const orderAmount = total;
        const updatedUser = await UserCollection.findOneAndUpdate(
            { _id: userId },
            { $inc: { wallet: orderAmount } },
            { new: true }
        );
        const updatedOrder = await orderCollection.findOneAndUpdate(
            { _id: orderId },
            { $set: { status: "Returned" } },
            { new: true }
        );
    } catch (error) {
        console.error("ordersget  error" + "= " + error);
    }
};