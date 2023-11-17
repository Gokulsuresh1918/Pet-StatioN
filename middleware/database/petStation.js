const mongoose =require('mongoose')


//database
mongoose.connect(process.env.DB_URL) 
.then(()=>{
    console.log("Mongodb Connected");
})
.catch(()=>{
    console.log("Failed to Connected");
})
module.exports = mongoose