'use strict';
const path = require('path');
const jwt  = require('jsonwebtoken');
const config = require('config');
const jwtSecret  = config.jwt.secret;
const tokenExpirePeriod = config.jwt.tokenExpirePeriod;

function generateToken(payLoad) {
    const isObject = (typeof payLoad === 'object');

    if (payLoad) {
        if (isObject) {
            return new Promise((resolve, reject) => {
                jwt.sign(payLoad, jwtSecret, { expiresIn: tokenExpirePeriod }, (error, token) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token);
                    }
                });
            })
        } else {
            const error = new TypeError('Token Payload Must Be An Object');
            return Promise.reject(error);
        }

    } else {
        const error = new Error('Token Payload Should Not Be Empty');
        return Promise.reject(error);
    }
}

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
    generate: generateToken,
    verify: verifyToken
};
