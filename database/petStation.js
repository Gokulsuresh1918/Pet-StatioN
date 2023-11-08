const mongoose =require('mongoose')


//database
mongoose.connect("mongodb://127.0.0.1:27017/User-PetStation")
.then(()=>{
    console.log("Mongodb Connected");
})
.catch(()=>{
    console.log("Failed to Connected");
})
module.exports = mongoose