const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/ErrorResponse");
const Blog = require('../models/Blog');
const User = require("../models/User");

/**
* NOTE: add advanced querying!!!
*/

/**
 * @desc: Get all blogs in the database
 * @route: GET /api/v1/blogs
 * @route: GET /api/v1/users/:userid/blog
 * @access: Public
 */
exports.getBlogs = asyncHandler( async (req,res,next)=> {

    let data = null;

    if(req.params.userid){
        data = Blog.find({author: req.params.userid});
    } else {
        data = Blog.find();
    }

    data = await data.populate("author");

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});


/**
 * @desc: Get individual blog from the database
 * @route: GET /api/v1/blogs/:blogid
 * @access: Public
 */
 exports.getBlog = asyncHandler( async (req,res,next)=> {

    const data = await Blog
    .findById(req.params.blogid)
    .populate('author');
    
    if(!data){
        return next(
            new ErrorResponse(
                `User ${req.params.blogid} does not exist`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data
    });
});


/**
 * @desc: Update data fields within blog.
 * @route: PUT /api/v1/blogs/:blogid
 * @access: Private
 */
 exports.updateBlog = asyncHandler( async (req,res,next)=> {

    if(!req.params.blogid){
        return next(
            new ErrorResponse(
                `No ID specified`,
                400
            )
        );
    }

    const blog = await Blog.findById(req.params.blogid);

    if(!blog){
        return next(
            new ErrorResponse(
                `Blog ${req.params.blogid} does not exist`,
                404
            )
        );
    }


    if(blog.author.toString() !== req.user._id.toString()){
        return next(
            new ErrorResponse(
                `Not authorized to access route`,
                401
            )
        );
    }

    console.log(req.body);

    let data = await Blog.findByIdAndUpdate(req.params.blogid,req.body, {
        returnDocument: "after",
        runValidators: true
    });


    res.status(200).json({
        success: true,
        data
    });
});



/**
 * @desc: Create a new blog
 * @route: POST /api/v1/blogs/
 * @access: Private
 */
exports.createBlog = asyncHandler( async (req,res,next)=> {
    req.body.author = req.user._id;
    let data = await Blog.create(req.body);


    res.status(201).json({
        success: true,
        data
    });
});



/**
 * @desc: Delete a blog from the database.
 * @route: DELETE /api/v1/blogs/:blogid
 * @access: Private
 */
exports.deleteBlog = asyncHandler( async (req,res,next)=> {
    if(!req.params.blogid){
        return next(
            new ErrorResponse(
                `Please specify a blog ID`,
                400
            )
        );
    }


    let blog = await Blog.findById(req.params.blogid);

    if(!blog){
        return next(
            new ErrorResponse(
                `Blog ${req.params.blogid} does not exist`,
                404
            )
        );
    }

    if(blog.author.toString() !== req.user._id.toString()){
        return next(
            new ErrorResponse(
                `Not authorized to delete blog ${blog._id}`,
                401
            )
        );
    }

    await blog.remove();

    res.status(200).json({
        success: true,
        data: []
    });

});
