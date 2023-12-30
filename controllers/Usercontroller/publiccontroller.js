const { UserCollection } = require('../../model/userDB')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const { tempCollection } = require('../../model/temporyDB')
const { contactCollection } = require('../../model/contactDB')






//controller for login get
exports.loginGet = (req, res) => {
    try {
        if (!req.session.userId) {
            const user = true
            res.render('User/login', { user })
        } else {
            const user = false
            res.redirect('admin/home')
        }
    } catch (error) {
        console.error("loginget error" + "=" + error);
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
        console.error("loginpost error" + "=" + err);
    }
};



//controller for signup get
exports.signupGet = (req, res) => {
    try {
        if (req.session.userId) {
            const user = true
            res.render('User/signup', { user })
        } else {
            const user = false
            res.render('User/signup', { user })
        }
    } catch (error) {
        console.error("signupGet  error" + "= " + error);
    }
};



//controller for signup post
exports.signupPost = async (req, res) => {
    try {
        // OTP generation through e-mail
        const otp = generateotp();
        console.log("OTP IS ", otp);
        const referal = referalgenerator()
        console.log("Referal is", referal);

        const referalexicst = req.body.Referal
        const data = {
            name: req.body.username,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            otp: otp,
            referal: referal
        };
        req.session.userEmail = data.email

        const existingUser = await UserCollection.findOne({ email: data.email });
        const existingreferal = await UserCollection.find({ referal: referalexicst });
        const existingUserMobile = await UserCollection.findOne({ mobile: data.mobile });
  
        if (existingreferal && existingreferal.length > 0) {
            existingreferal.forEach(async (referral) => {
                referral.wallet += 1000;
                await referral.save();
                console.log('Wallet updated successfully');
            });

            data.wallet = 500;

        } else {
            console.log('Referral not found');
        }


        if (existingUser) {
            return res.render('User/signup', { message: 'E-mail already exists' });
        }
        if (existingUserMobile) {
            return res.render('User/signup', { message: 'Mobile already exists' });
        }
        if (data.password !== req.body.confirmpass) {
            return res.redirect('/admin/signup');
        }
        const emailText = `Hi, this is from PetStation. You just signed up. Your OTP is: ${otp}`;
        const mailOptions = {
            from: 'petstation2002@gmail.com',
            to: data.email,
            subject: 'OTP Verification',
            text: emailText,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending OTP:', error);
            }
            console.log('OTP sent:', info.response);
            res.redirect('/otppage');
        });
        // Hashing of password and adding to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        await tempCollection.insertMany([data]);

    } catch (error) {
        console.error('Error in signupPost:', error);

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








exports.logoutuser = (req, res) => {
    try {
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
    } catch (error) {
        console.error("logoutuser error" + "=" + error);
    }
}



function referalgenerator() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 6;
    let randomCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters.charAt(randomIndex);
    }

    return randomCode;
}

