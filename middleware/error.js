

const errorHandler = (error, req,res,next) => {
    // Catch any db errors in errorHandler, send them to user.

    console.log('caught in errorhandler')

    if(error.name === "CastError"){
        error.message = "Invalid ID";
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `Request failed, server response of ${error.statusCode || 500}`
    });
}


module.exports = errorHandler;