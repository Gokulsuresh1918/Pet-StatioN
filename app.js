const express = require("express")
const app = express()
const session = require("express-session")
const path = require("path")
require('dotenv').config();

const bcrypt = require("bcrypt")
// const env = require('dotenv')
const crypto = require('crypto')
const mongoose = require("mongoose")
const database = require('./middleware/database/petStation')
const nocache = require('nocache')
const MongoDBStore = require('connect-mongodb-session')(session)
const port = process.env.PORT
const errorpage = require('./middleware/error/error')







//setting up view engine
app.set("view engine", "ejs")


//setting of public , JSON , urlencodedd
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(nocache())

  
const store = new MongoDBStore({
    uri: "mongodb+srv://gokulofficial18602:nwWx83n1LC3ifNgb@cluster0.8zdurjp.mongodb.net/User-PetStation?retryWrites=true&w=majority",
    collection: "sessions",
    expires: 1000 * 60 * 60 * 24 * 30 // 30 days
  }, err => {err && console.error(`An error occured when connecting MongoDB to Session: ${err}`)});

// session useing 
app.use(session({
    secret: process.env.SECRET_KEY, // Change this to a strong secret in a real application
    resave: false,
    store:store,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000, // Session will expire after 1 hour (in milliseconds)
    }
}));
app.use((req, res, next) => {
    // Set cache-related headers to control caching behavior
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
    res.setHeader('Expires', '0'); // Proxies.
    next();
});

//User router imports
app.use('/', require('./routes/userroute'));
app.use('/admin', require('./routes/adminroute'));



//multer image path
app.use('/MulterUploads', express.static(path.resolve(__dirname, '/MulterUploads')));
//<y!---------This code is By Aswin ------------------------------------>
// console.log(path.resolve(__dirname, '/MulterUploads'))
//<y!---------This code is By Aswin ------------------------------------->

// 404 error page
app.use(errorpage)

//port settimg
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}/home`);
}) 