
const User = require('./models/User');
const Comment = require("./models/Comment");
const Blog = require('./models/Blog');
const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: "./config/config.env"});



mongoose.connect(process.env.DB_URI,{
    useNewUrlParser:true
});


/* Read files to seed the db */
const Users = JSON.parse(fs.readFileSync("./_data/users.json", "utf-8"));
const Blogs = JSON.parse(fs.readFileSync("./_data/blogs.json","utf-8"));
const Comments = [];


const clearDB = async ()=> {
    try{
        await User.deleteMany();
        await Comment.deleteMany();
        await Blog.deleteMany();
        console.log("Database has been cleaned".red.inverse);
        process.exit();
    } catch(error){
        console.log(error);
    }
}

const seedDB = async ()=> {
    try {
        const num_comments = 10;

        console.log('Seeding users'.yellow.bold);
        for(let i = 0; i<Users.length; i++)
            Users[i]._id = new mongoose.Types.ObjectId();

        console.log('seeding blogs'.yellow.bold);
        for(let i = 0; i<Blogs.length; i++){
            let rand1 = Math.floor(Math.random()*Users.length);
            Blogs[i].author = Users[rand1]._id;
            Blogs[i]._id = new mongoose.Types.ObjectId();
        }

        console.log('seeding comments'.yellow.bold)
        for(let i = 0; i<num_comments; i++){
            let rand1 = Math.floor(Math.random()*Users.length);
            let rand2 = Math.floor(Math.random()*Blogs.length);
            Comments.push({
                author: Users[rand1]._id,
                blog: Blogs[rand2]._id,
                _id: new mongoose.Types.ObjectId(),
            });
        }

        console.log('Saving data...'.green.bold);

        await User.insertMany(Users);
        await Blog.insertMany(Blogs);
        await Comment.insertMany(Comments);

        console.log('Database seeded!'.green.inverse);
        process.exit();
        
    } catch(error){
        console.log('something went wrong'.red.bold);
        console.log(error)
        process.exit();
    }
}


if(process.argv[2] === '-d'){
    clearDB();
} else if(process.argv[2] ==='-i'){
    seedDB();
}


