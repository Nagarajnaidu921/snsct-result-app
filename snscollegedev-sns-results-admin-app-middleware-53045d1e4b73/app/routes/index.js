'use strict';
const AuthRoutes = require('./auth');
const AdminRoutes = require('./admins');
const StudentRoutes = require('./students');
const ResultRoutes = require('./results');

module.exports = app => {
	app.use('/auth/api', AuthRoutes);
	app.use('/api/admins', AdminRoutes);
	app.use('/api/students', StudentRoutes);
	app.use('/api/results', ResultRoutes);
};
