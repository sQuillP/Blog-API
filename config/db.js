const mongoose = require("mongoose");

const connectDB = async ()=> {
    const connection = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true
    });

    console.log('connected to the database'.cyan.underline.bold);

}


module.exports = connectDB;