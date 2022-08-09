const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');



/*
* @desc: Get all users in the database
* @route: GET api/v1/users
* @access: public
*/
exports.getUsers = asyncHandler( async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        data: users
    });
});



/*
* @desc: Get individual user
* @route: api/v1/users/:userid
* @access: Public
*/
exports.getUser = asyncHandler( async (req,res,next)=> {


    const fetchedUser = await User.findById(req.params.userid);
    if(!fetchedUser){
        return next(
            new ErrorResponse(`User does not exist`,404)
        );
    }
    res.status(200).json({
        success: true,
        data: fetchedUser
    });
});


/*
* @desc: Add a user to the database
* @route: POST api/v1/users
* @access: private
*/
exports.createUser = asyncHandler( async (req,res,next)=> {
    console.log(req.body)
    let user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});


/*
* @desc: Update a user in the database
* @route: PUT api/v1/users/:userid
* @access: private, most be logged in to do this.
*/
exports.updateUser = asyncHandler( async (req,res,next)=> {
    console.log(req.body)
    let message = "";

    if(!req.params.userid){
        return next(
            new ErrorResponse(
                "No user id specified",
                400
            )
        );
    }

    let user = await User.findByIdAndUpdate(req.params.userid,req.body, {
        runValidators:true,
        returnDocument: "after"
    });

    if(!user){
        return next(
            new ErrorResponse(
                `User ${req.params.userid} does not exist.`,
                400
            )
        );
    }

    res.status(201).json({
        success: true,
        data: user
    });
});



/**
 * @desc: Delete a user from the databse
 * @route: DELETE /api/v1/users/:userid
 * @access: Private, must be admin or a user to perform this action.
 */
exports.deleteUser = asyncHandler( async (req,res,next)=> {

    if(!req.params.userid){
        return next(
            new ErrorResponse(
                `Please specify user ID`,
                400
            )
        );
    }

    const user = await User.findById(req.params.userid);

    if(!user){
        return next(
            new ErrorResponse(
                `User ${req.params.userid} does not exist`,
                404
            )
        );
    }

    await user.remove();

    res.status(200).json({
        success: true,
        data: []
    });
});






