const express = require('express');
const app = express();
const colors = require("colors");

const errorHandler = require('./middleware/error');
const dbConnect = require('./config/db');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

/*Pagination should be an important thing to do */

/* Import router configuration */
const users = require("./routes/users");
const blogs = require('./routes/blogs');
const comments = require("./routes/comments");
const auth = require("./routes/auth");

app.use(morgan('dev'));
dotenv.config({path: "./config/config.env"});



dbConnect();
/* Load middleware */
app.use(express.json());
app.use(cookieParser());

/* Mount routers to server */
app.use("/api/v1/users",users);
app.use("/api/v1/blogs",blogs);
app.use("/api/v1/comments",comments);
app.use('/api/v1/auth',auth);
app.use(errorHandler);


const PORT = 5000;
app.listen(PORT,()=> {
    console.log(`Blog app running on port ${PORT}`.green.bold);
});