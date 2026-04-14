const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async()=>{
    try{
        // console.log("inside the connectdb");
        await mongoose.connect(process.env.MONGO_URL);
        // inside the function the code pauses at await and waits for DB.
        //it will wait for connecting to DataBase and lines below will 
        //not run untill connection made to DB
        console.log("mongodb connected");
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;
