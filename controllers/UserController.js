const { UserCollection } = require('../model/userDB')
const { productCollection } = require('../model/productDB')
const { addressCollection } = require('../model/addressDB')
const { orderCollection } = require('../model/orderDB')
const { cartCollection } = require('../model/cartDB')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const { name } = require('ejs')


//controller for login get
exports.loginGet = (req, res) => {

    if (!req.session.userId) {
        const user = true
        res.render('User/login', { user })
    } else {
        const user = false
        res.redirect('admin/home')
    }
};
//controller for login post
exports.loginPost = async (req, res) => {
    try {
        const check = await UserCollection.findOne({ email: req.body.Email });
        if (check) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)

            if (check && check.blockStatus) {
                console.log("acc blocked");
                res.render("User/login", { message: "account Blocked" })
            }
            else if (isPasswordMatch) {
                // session created
                req.session.userId = check._id
                res.redirect('/home')
            } else {
                res.render('User/login', { message: 'wrong Credentials' })
            }
        }
    } catch (err) {
        console.error(err);
    }
};



//controller for signup get
exports.signupGet = (req, res) => {
    const user = true
    res.render('User/signup', { user })

};




//controller for signup post
exports.signupPost = async (req, res) => {
    try {
        data = {
            name: req.body.username,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
        };
        console.log(data);
        const existinguser = await UserCollection.findOne({ email: data.email })
        const existingusermobile = await UserCollection.findOne({ mobile: data.mobile })
        if (existinguser) {
            res.render('User/signup', { message: "E mail already exists" })
        }
        if (existingusermobile) {
            res.render('User/signup', { message: "mobile already exists" })
        }
        if (data.password === req.body.confirmpass) {
            //otp generation through e mail
            otp = generateotp()
            console.log(otp);
            const emailText = `  Hi this is from PetStation you just signup 
             Your OTP is: ${otp}`;
            const mailOptions = {
                from: 'petstation2002@gmail.com',
                to: data.email,
                subject: 'OTP Verification',
                text: emailText,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending OTP:', error);
                } else {
                    console.log('OTP sent:', info.response);
                    res.redirect('/otppage')
                }
            });
    
            //hashing of pasword and adding to database
            const saltRound = 10;
            const hashedpassword = await bcrypt.hash(data.password, saltRound)
            data.password = hashedpassword
            await UserCollection.insertMany([data])
            res.render('User/otppage')
    
        } else {
            res.redirect('/admin/signup')
        };
    } catch (error) {
        console.error('Error in signupPost:', error);
        res.status(500).send('Internal Server Error');
    }
    
  
};



// OTP verification
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'SMTP'
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
    },
});
let otp;
let data;
const generateotp = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString().slice(0, 6);
}





//otp get controller
exports.otpGet = (req, res) => {

    res.render('User/otppage')
};




// Otp Post Router
exports.otppost = async (req, res) => {
    const { digit1 } = req.body;
    const userEnteredOTP = digit1;
    console.log(otp);
    if (userEnteredOTP === otp) {
        // await UserCollection.insertMany(data);
        console.log("User registered successfully!!");
        res.render('User/otpsucces')
    } else {
        res.redirect("/otppage")
    }
};

exports.resendotppost=async(req,res)=>{
     //otp generation through e mail
     otp = generateotp()
     console.log(otp);
     const emailText = `  Hi this is from PetStation you just signup 
      Your  Resend OTP is: ${otp}`;
     const mailOptions = {
         from: 'petstation2002@gmail.com',
         to: data.email,
         subject: 'OTP Verification',
         text: emailText,
     };
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log('Error sending OTP:', error);
         } else {
             console.log('OTP sent:', info.response);
             res.redirect('/otppage')
         }
     });
}



//controller for home get
exports.homeGet = (req, res) => {

    try {
        if (req.session.userId) {
            const user = true
            res.render('User/home', { user })
        } else {
            const user = false
            res.render('User/home', { user })
        }
    } catch (error) {
        console.error(error);
    }

}
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
        console.error(error);
    }


}
exports.productView = async (req, res) => {

    const productdata = await productCollection.findOne({ _id: req.params.id });

    res.render('User/productview', { productdata })
}

exports.cartGet = async (req, res) => {

    const cartdetails = await cartCollection.findOne({ userId: req.session.userId });
    

    // Find the product in the productCollection
    const productdetails = await productCollection.find();

    // Send the cartdetails and productdetails to the view
    res.render('User/cart', { cartdetails: cartdetails, productdetails: productdetails });
}



//profile get 
exports.profileGet = (req, res) => {
    res.render('User/userProfile/profile')
}
exports.addressGet = async (req, res) => {
    const address = await addressCollection.find()
  
    res.render('User/userProfile/address', { address, message: "" })
}
exports.addresspost = async (req, res) => {
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

exports.addaddressGet = (req, res) => {
    res.render('User/userProfile/addaddress')
}
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
        console.error(error);
    }
}
exports.editaddressGet = async (req, res) => {
    res.render('User/userProfile/editaddress')
}
exports.editaddresspost = async (req, res) => {
    const addressid = req.body.id

    const addressedit = await addressCollection.find({ _id: addressid })

    res.render('User/userProfile/editaddress', { addressedit })
}

exports.logoutuser = (req, res) => {
    if (req.session.userId) {

        req.session.destroy((err) => {
            if (err) {
                console.error('Error', err);
            }
            console.log("session destriyod sucessfully");
            res.redirect('/');
        });

    } else {
        res.redirect('/');
    }


};

exports.forgetpass = (req, res) => {
    res.render('User/userProfile/forgetpass')
}
exports.forgetpasspost = async (req, res) => {
    data = {
        email: req.body.email,
    };
    console.log(data);
    const existinguser = await UserCollection.findOne({ email: data.email })
    if (existinguser) {
        //otp generation through e mail
        otp = generateotp()
        console.log(otp);
        const emailText = `  Hi this is from PetStation 
        this is your OTP for account recovery
         Your OTP is: ${otp}`;
        const mailOptions = {
            from: 'petstation2002@gmail.com',
            to: data.email,
            subject: 'OTP forget password',
            text: emailText,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending OTP:', error);
            } else {
                console.log('OTP sent:', info.response);
                res.redirect('/otppage')
            }
        });

        res.render('User/otppage')

    } else {
        res.redirect('/signup')
    };
};
exports.addcartpost = async (req, res) => {
    const user = req.session.userId;
    try {
        if (user) {
            const productId = req.body.productId;
            const qty = req.body.quantity;
            let productPrice = await productCollection.findOne({ _id: productId }, { _id: 0, price: 1 });
            const existingproduct = await cartCollection.findById({ _id: productId })
            console.log(existingproduct);
            if (!existingproduct) {
                productPrice = productPrice.price;
                let subtotal = productPrice * qty;
                await cartCollection.insertMany([{ userId: user, subtotal: subtotal }]);
                await cartCollection.updateOne({ userId: user }, { $push: { productId: productId, quantity: qty } })
            }

        } else {
            res.json({ message: "noUser" });
        }
    } catch (error) {
        console.log(error.message);
    }
}


exports.checkoutget = async (req, res) => {
    const cartdetails = await cartCollection.find()
    const productdetails = await productCollection.find();
    const addressdetails = await addressCollection.find({ userId: req.session.userId });

    res.render('User/checkout', { cartdetails: cartdetails, productdetails: productdetails, addressdetails: addressdetails });

};

exports.checkoutaddress = async (req, res) => {

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

    // const result = await addressCollection.insertMany([Address]);
    res.redirect('/checkout')
}

exports.addressremove=async (req,res)=>{
    try {
    const addressId = req.params.addressId;
   
     await addressCollection.deleteOne({ id: addressId });
     res.status(200).json({ message: 'Address removed successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error removing address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}




exports.confirmationget = ((req, res) => {
    res.render('User/confirmation')
});



exports.confirmationpost = async (req, res) => {
    try {
        // Access orderDetails from the request body
        const { orderDetails } = req.body;

        // Save the order details to the database or perform necessary actions
        console.log('Received order details:', orderDetails);
     
        await newOrder.save();

        // Send a response to the client (you can customize the response as needed)
        res.json({ success: true, message: 'Order confirmed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

};

exports.clearcartget = async (req, res) => {
    await cartCollection.deleteMany({});
    res.redirect('/cart');
};

exports.removeItem = async (req, res) => {
    const index = req.params.productId; // Assuming productId is used as an index

    try {
        await cartCollection.deleteOne({ id: index }); // Assuming your cartCollection has an 'id' field
        res.json({ success: true, cart });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid index' });
    }
};
