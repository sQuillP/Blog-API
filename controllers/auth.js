const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/ErrorResponse");
const User = require('../models/User');

/**
 * @desc: Log a user into the server
 * @route: /api/v1/auth/login
 * @access: public
 */
exports.loginUser = asyncHandler( async (req,res,next)=> {
    const {email, password } = req.body;
    if(!email || !password){
        return next(
            new ErrorResponse(
                `Please Enter a username and password`,
                400
            )
        );
    }

    let user = await User.findOne({email}).select("+password");

    if(!user){
        return next(
            new ErrorResponse(
                `Email: ${email} doesnot exist`,
                404
            )
        );
    }

    if(!user.matchPassword(password)){
        return next(
            new ErrorResponse(
                `Invalid Email or password`,
                400
            )
        );
    }


    responseToken(user,200,res);
    
});


/**
 * @desc: Log a user out of the system.
 * @route: /api/v1/auth/logout
 * @access: private
 */
exports.logoutUser = asyncHandler( async (req,res,next)=> {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: []
    });
});


/**
 * @desc: Register a new user to the database
 * @route: POST /api/v1/auth/register
 * @access: public
 */
exports.registerUser = asyncHandler( async (req,res,next)=> {
    let user = await User.create(req.body);

    responseToken(user,201,res);
});



/**
 * @desc: Send a signed JWT to the client to store 
 * their logged in credentials.
 */
const responseToken = (user, status, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    }

    res.status(status)
    .cookie('token',token,options)
    .json({
        success: true,
        token
    });
}