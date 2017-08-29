'use strict';

function errorHandlingMidleware(error, req, res, next) {
    // console.log(error)
    const message = 'Bad Request: ' + error.message;
    const isSuccess = false;
    const resData = { message, isSuccess };
    res.status(200).json(resData);
}

module.exports = errorHandlingMidleware;


