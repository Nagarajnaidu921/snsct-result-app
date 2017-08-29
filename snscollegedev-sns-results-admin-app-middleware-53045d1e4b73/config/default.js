const config = {
	db: {
		uri: 'mongodb://localhost/testdb'
	},

	// JWT Secret
	jwt: {
		secret: (process.env.JWT_SECRET || 'test-jwt-secret'),
		tokenExpirePeriod: (60 * 60 * 1)  // 1 day
	},

	// NODE ENV VARIABLES

	PORT: process.env.PORT || 3000

};

module.exports = config;
