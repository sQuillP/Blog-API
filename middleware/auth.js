const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');




/**
 * @desc: Protect routes with JWT.
 */
exports.protect = async (req,res,next)=> {

  
    let tokenStr = req.headers.authorization
    if(!tokenStr || tokenStr.split(' ')[0].toLowerCase() !== "bearer"){
        return next(
            new ErrorResponse(
                `Invalid headers.`,
                401
            )
        );
    }
    tokenStr = tokenStr.split(' ');
    try {
        let decryptedId = jwt.verify(tokenStr[1],process.env.JWT_SECRET);
        console.log(decryptedId);
        req.user = await User.findById(decryptedId.id);
    } catch(error) {
        return next(
            new ErrorResponse(
                `Invalid token, not authorized to access this route`,
                401
            )
        );
    }
    next();
}


exports.restrict = ()=> (req,res,next)=> {
    if(!req.user.isAdmin)
        return next(new ErrorResponse(
            `Not authorized to access this route`,
            401
        ));

    next();
}