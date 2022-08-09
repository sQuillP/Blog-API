const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
const Comment = require('../models/Comment');


/**
 * @desc: Get all comments in the database
 * @route: GET api/v1/comments
 * @route: GET api/v1/blogs/:blogid/comments
 * @access: Public
 */
exports.getComments = asyncHandler( async (req,res,next)=> {

    // add a query string
    if(req.params.blogid){
        console.log(req.query.limit);
        data = await Comment
        .find({blog: req.params.blogid})
        .limit(req.query.limit || 10);
    } else{
        data = await Comment.find();
    }

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});



/**
 * @desc: Get individual comment from database
 * @route: GET api/v1/comments/:commentid
 * @access: Public
 */
 exports.getComment = asyncHandler( async (req,res,next)=> {
    if(!req.params.commentid){
        return next(
            new ErrorResponse(
                `No Comment id specified`,
                400
            )
        );
    }


    let data = await Comment.findById(req.params.commentid);

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});


/**
 * @desc: Create a new comment
 * @route: POST /api/v1/comments
 * @access: private
 */
 exports.createComment = asyncHandler( async (req,res,next)=> {

    req.body.author = req.user._id;
    console.log(req.body)
    let data = await Comment.create(req.body);

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});




/**
 * @desc: Update individual comment from database
 * @route: PUT api/v1/comments/:commentid
 * @access: Private, must be author of comment
 */
 exports.updateComment = asyncHandler( async (req,res,next)=> {
    if(!req.params.commentid){
        return next(
            new ErrorResponse(
                `No Comment id specified`,
                400
            )
        );
    }

    let comment = await Comment.findById(req.params.commentid);

    if(!comment){
        return next(
            new ErrorResponse(
                `Comment ${req.params.commentid} does not exist`,
                404
            )
        );
    }
    if(req.user._id.toString() !== comment.author.toString()){
        return next(
            new ErrorResponse(
                `Not authorized`,
                401
            )
        );
    }
    comment = await Comment.findByIdAndUpdate(req.params.commentid,req.body,{
        runValidators: true,
        returnDocument: "after"
    })

    res.status(200).json({
        success: true,
        data: comment
    });
});


/**
 * @desc: Update individual comment from database
 * @route: PUT api/v1/comments/:commentid
 * @access: Private, must be author of comment
 */
 exports.deleteComment = asyncHandler( async (req,res,next)=> {
    if(!req.params.commentid){
        return next(
            new ErrorResponse(
                `No Comment id specified`,
                400
            )
        );
    }
    let comment = await Comment.findById(req.params.commentid);
    if(comment.author.toString() !== req.user._id.toString()){
        return next(
            new ErrorResponse(
                `Not authorized to delete comment`,
                401
            )
        );
    }
    if(!comment){
        return next(
            new ErrorResponse(
                `Coment ${req.params.commentid} does not exist`,
                404
            )
        );
    }

    await comment.remove();

    res.status(200).json({
        success: true,
        data: []
    });
});