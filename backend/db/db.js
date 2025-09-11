const mongoose = require("mongoose");

async function connectDB () {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/garuda", 
        console.log("DB connected successfully"));
    }catch(err){
        console.log(err.message);
    }
}

module.exports = connectDB;