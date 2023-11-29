const { UserCollection } = require('../../model/userDB')
const { tempCollection } = require('../../model/temporyDB')
const { contactCollection } = require('../../model/contactDB')
const nodemailer = require('nodemailer');






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














exports.forgetpass = (req, res) => {
try {
    if (req.session.userId) {
        const user = true
        res.render('User/forget-pass', { user })
    } else {
        const user = false
        res.render('User/forget-pass', { user })
    }
} catch (error) {
    console.error("forgetpass  error" + "= " + error);
}
}


exports.forgetpasspost = async (req, res) => {
    try {
        data = {
            email: req.body.email,
        };
        const existinguser = await UserCollection.findOne({ email: data.email })
        if (existinguser) {
            //otp generation through e mail
            otp = generateotp()
            console.log(otp);
            const otpresend = await tempCollection.findOneAndUpdate({ email: data.email }, { $set: { otp: otp } })
            const emailText = ` Hi there,
    
            This is a message from PetStation regarding your account recovery.
            Your One-Time Password (OTP) for account recovery is: ${otp}
            
            If you did not initiate this request, please ignore this message.
            
            Best regards,
            PetStation Team`;
    
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
                    res.render('User/forget-otp')
                }
            });
        } else {
            res.redirect('/signup')
        };
    } catch (error) {
        console.error("forgetpasspost  error"+"= "+error);  
    }
    
};

exports.resendpost = async (req, res) => {
    try {
        const { digit } = req.body;
        const userEnteredOTP = digit;
        const temporary = await tempCollection.findOne({ otp: userEnteredOTP })
    
        const otpdata = temporary.otp
        if (userEnteredOTP == otpdata) {
            const user = true
            res.render('User/otpsucces', { user })
        } else {
            res.redirect("/otppage")
        }
    } catch (error) {
        console.error("resendpost error"+"= "+error);  
    }
};

//otp get controller
exports.otpGet = (req, res) => {
try {
    if (req.session.userId) {
        const user = true
        res.render('User/otppage', { user })
    } else {
        const user = false
        res.render('User/otppage', { user })
    }
} catch (error) {
    console.error("otpGet  error" + "= " + error);
}
}


// Otp Post Router
exports.otppost = async (req, res) => {
    try {
        
        const { digit1 } = req.body;
        const userEnteredOTP = digit1;
        const temporary = await tempCollection.findOne({ otp: userEnteredOTP })
    
        const otpdata = temporary.otp
        if (userEnteredOTP == otpdata) {
            await UserCollection.insertMany([temporary]);
            // req.session.destroy((err) => {
            //     res.render("User/errorpage")
            // })
            console.log("User registered successfully!!");
            res.render('User/otpsucces')
        } else {
            res.redirect("/otppage")
        }
    } catch (error) {
        console.error("otppost error"+"= "+error);  
    }
}; 

exports.resendotpget = async (req, res) => {
    try {
        
        //otp generation through e mail
        otp = generateotp()
        console.log(otp);
        const userEmail = req.session.userEmail;
        const temporary = await tempCollection.findOne({ email: userEmail })
    
        const existingUser = await UserCollection.findOne({ email: temporary.email });
        const existingUserMobile = await UserCollection.findOne({ mobile: temporary.mobile });
    
        if (existingUser) {
            return res.render('User/signup', { message: 'E-mail already exists' });
        }
    
        if (existingUserMobile) {
            return res.render('User/signup', { message: 'Mobile already exists' });
        }
        const userdetails = await tempCollection.findOneAndUpdate({ email: temporary.email }, { $set: { otp: otp } })
        const emailText = `  Hi this is from PetStation you just signup 
          Your  Resend OTP is: ${otp}`;
        const mailOptions = {
            from: 'petstation2002@gmail.com',
            to: userdetails.email,
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
    } catch (error) {
        console.error("resendotpget error"+"= "+error); 
    }

}


