'use strict';
const routeCtrl = require('./route');
const Token = require('../lib/token');
const resultCtrl = require('./result');
'use strict';

function isAuthorized(req, res, next) {
    const token = req.headers.Authorization || req.headers['x-access-token'];
    if (token) {
        Token.verify(token)
            .then(decodedToken => {
                req.userId = decodedToken.id;
                // console.log('userId: %s', req.userId);
                return next();
            })
            .catch(error => {
                return res.status(403).json({
                    message: 'Unauthorized Access',
                    isSuccess: false
                })
            })
    } else {
        return res.status(403).json({
            message: 'Unauthorized Access',
            isSuccess: false
        })
    }
}




module.exports = app => {
	 app.use('/home/*', isAuthorized); 
     app.use('/user/result/',resultCtrl);
   app.use('/user', routeCtrl);
};
