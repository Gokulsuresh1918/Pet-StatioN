const { UserCollection } = require('../model/userDB')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');


//controller for login get
exports.loginGet = (req, res) => {
    if ( req.session.userId) {
        res.render('User/home')
        console.log("vannu",req.session.userId);
    } else {
        res.render('User/login')
    }
};
//controller for login post
exports.loginPost = async (req, res) => {
    try {
        const check = await UserCollection.findOne({ email: req.body.Email });
        if (check) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
            if (isPasswordMatch) {
                console.log(isPasswordMatch);
                req.session.userId = true;
                console.log(req.session.userId);
                res.redirect('/home')
            } else {
                console.log("logged out");
                res.redirect('/')
            }
        }
    } catch (err) {
        console.error(err);
    }
};


//controller for signup get
exports.signupGet = (req, res) => {
    if (req.session.userId) {
        res.redirect('user/otppage')
    } else {
        res.render('user/signup')
    }
};
//controller for signup post
exports.signupPost = async (req, res) => {
    data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }
    console.log(data);
    console.log(req.body.confirmpass);
    const existinguser = await UserCollection.findOne({ email: data.email })
    if (existinguser) {
        res.redirect('/signup')
    }
    if (data.password === req.body.confirmpass) {
        otp = generateotp()
        console.log(otp);
        const emailText = `Your OTP is: ${otp}`;
        const mailOptions = {
            from: 'gokulanandhu@gmail.com',
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
        const saltRound = 10;
        const hashedpassword = await bcrypt.hash(data.password, saltRound)
        data.password = hashedpassword
        await UserCollection.insertMany([data])
        res.redirect('/otppage')

    } else {
        res.redirect('/signup')
    }

}


//controller for home get
exports.homeGet = (req, res) => {

    if (  req.session.userId) {
        console.log("session");
        res.render('User/home')

    } else {
        res.redirect('/')
    }
};



// OTP verification
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'SMTP'
    auth: {
        user: 'gokulanandhu1571@gmail.com',
        pass: 'xvciwplsvlmjgczn',
    },
});
let otp;
let data;
const generateotp = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString().slice(0, 6);
}
exports.otpGet = (req, res) => {
    res.render('user/otppage')
};
// Otp Post Router
exports.otppost = async (req, res) => {
    const { digit1, digit2, digit3, digit4, digit5, digit6 } = req.body;
    const userEnteredOTP = digit1 + digit2 + digit3 + digit4 + digit5 + digit6;
    console.log(otp);
    if (userEnteredOTP === otp) {
        console.log(data);
        await UserCollection.insertMany(data);
        console.log("User registered successfully!!");
        res.render('User/login')
    } else {
        res.redirect("/otppage")
    }
};




