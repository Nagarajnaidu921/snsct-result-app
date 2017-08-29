'use strict';
const express = require('express');
const mongoose = require('mongoose');
const Result = require('../model/resultSchema.js');
const bcrypt = require('bcrypt');
const router = express.Router();

router.route('/:id/:sem')
.get((req, res) => {
	if(req.params) {
		console.log(req.params.id + '/' + req.params.sem);
		Result.find({
			studentId: req.params.id,
			sem: req.params.sem
		}, {
			_id: false,
			__v: false
		})
		.then(result => {
			console.log(result)
			if(result.length != 0) {
				var id = req.params.id;
				var sem = req.params.sem;
				var isSuccess = true;
				res.json({isSuccess, id, sem, result});
			} else {
				res.json({
				isSuccess: false,
				message:'result Not found'
			});
			}
			
		})
		.catch(err => {
			console.log(err);
			res.json({
				isSuccess: false,
				message:'some thing went wrong'
			});
		})
	}
})

module.exports = router;