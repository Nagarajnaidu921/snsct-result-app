'use strict';
const mongoose = require('mongoose');
const uri 	   = 'mongodb://localhost/testdb';

mongoose.Promise = global.Promise;

mongoose.connect(uri, err => {
	if (err) return console.error(err);
});

const db = mongoose.connection;

db.on('error', () => console.log('connection error'));
db.once('open', () => {
	console.log('Connected To Database');
});
module.exports = db;
