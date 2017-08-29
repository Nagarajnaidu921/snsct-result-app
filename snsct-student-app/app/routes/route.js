'use strict';
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../model/schema.js');
const bcrypt = require('bcrypt');
const router = express.Router();


function deCrypt(enPwd, rawPwd) {

	return bcrypt.compare(rawPwd, enPwd)
	.then( isSame => {
		console.log(isSame);
		return isSame;
	})
	.catch( err=> {
		console.log(err);
	})

}

function tokenDataGen(data) {
	return {
		id: data.id,
		name: data.fullName,
		regNum: data.registerNumber,
		email: data.email
	};
}

function tokenGen(data) {
	var token = jwt.sign(data,'myapp', { algorithm: 'HS512'});
	return token;
}

router.route('/login')
.post((req, res) => {
	var body = req.body;
	var resData = {};
	var tokenData = {};
	User.findOne({registerNumber: body.regNum}, { _id: false })
	.then(data => {

		if(!data) {
			return false;
		}
		else if(data){
			tokenData = tokenDataGen(data);
			return deCrypt(data.password, body.pwd);
		}
		
	})
	.then(isSame => {
		if(isSame) {
			return tokenGen(tokenData);
		}else {
			if(!isSame) {
				return false;
			}
		}
	})
	.then(token => {
		if (token) {
			resData = tokenData;
			resData.token = token;
			resData.isSuccess = true;
			console.log('resdata' + resData)
			res.json(resData);
		}

		if (!token) {
			resData.isSuccess = false;
			resData.message = 'invalid regNum or pwd';
			// res.json(resData);
			res.json(resData);
		}
	})
	.catch(err => {
		console.log(err);
	})
})

module.exports = router;