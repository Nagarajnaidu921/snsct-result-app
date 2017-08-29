const jwt = require('jsonwebtoken');


function verifyToken(token) {
    if (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSecret, (error, decodedToken) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(decodedToken);
                }
            });
        })

    } else {
        const error = new Error('Token Should Not Be Empty');
        return Promise.reject(error);
    }
}

module.exports = {
    verify: verifyToken
};