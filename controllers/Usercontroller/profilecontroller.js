const { UserCollection } = require('../../model/userDB')
const { addressCollection } = require('../../model/addressDB')
const { orderCollection } = require('../../model/orderDB')
const { contactCollection } = require('../../model/contactDB')





//profile get 
exports.profileGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const id = req.session.userId
            const userdetails = await UserCollection.findOne({ _id: id })
            res.render('User/userProfile/profile', { user,userdetails })
        } else {
            const user = false
            res.render('User/userProfile/profile', { user })
        }
    } catch (error) {
        console.error("profileGet  error" + "= " + error);
    }
};




exports.addressGet = async (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            const address = await addressCollection.find({ userId: req.session.userId });
            res.render('User/userProfile/address', { user, address, message: "" })
        } else {
            const user = false
            res.render('User/userProfile/address', { user })
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








exports.addaddressGet = (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            res.render('User/userProfile/addaddress', { user })
        } else {
            const user = false
            res.render('User/userProfile/addaddress', { user })
        }
    } catch (error) {
        console.error("addaddressGet  error" + "= " + error);
    }
};



exports.addaddresspost = async (req, res) => {
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
        const address = await addressCollection.find()
        try {
            const check = await addressCollection.find({ phone: req.body.phone })
            if (check[0]) {
                res.render('User/userProfile/address', { address, message: "already exicts" })
            } else {
                await addressCollection.insertMany([Address]);
                res.render('User/userProfile/address', { address, message: "" })
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
            res.render('User/userProfile/editaddress', { user })
        } else {
            const user = false
            res.render('User/userProfile/editaddress', { user })
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

exports.ordersget = async (req, res) => {
    try {
       if (req.session.userId) {
           const user = true
           const userid = req.session.userId

           const orderdata = await orderCollection.find()
       
           res.render('User/userprofile/order', { orderdata,user })
        } else {
           const user = false
           res.render('User/userprofile/order', { orderdata,user })
        }
   } catch (error) {
       console.error("ordersget  error" + "= " + error);
   }
};