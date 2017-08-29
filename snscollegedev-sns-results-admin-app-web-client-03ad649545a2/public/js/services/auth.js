'use strict';
(function () {
	angular.module('myApp')
	
	.factory('AuthServ', ['$http', '$location', 'TokenServ', 'AUTH_SERVER', AuthServ]);

	function AuthServ($http, $location, TokenServ, AUTH_SERVER) {

		function logIn(email, password) {
			var user = {
				email: email,
				password: password
			};

			return $http.post(AUTH_SERVER.login, user)
			.then(function (res) {
				var data = res.data || {};
				var token = data.token;
			    TokenServ.save(token);
				return data;
			})
		}

		function logOut() {
			TokenServ.remove();
			$location.path('/login');
		}

		function isLoggedIn() {
			return TokenServ.getToken();
		}
		
		return {
			logIn: logIn,
			logOut: logOut,
			isLoggedIn: isLoggedIn
		};
		
	}
})();