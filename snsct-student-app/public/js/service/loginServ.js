'use strict';
(function() {
	angular.module('snsct')
	.factory('loginServ', ['$http', '$rootScope', '$location','localStorageServ', 'tokenServ', 'resultServ', 'SERVER', loginServ]);
	function loginServ($http, $rootScope, $location, localStorageServ, tokenServ, resultServ, SERVER) {

		function saveTokenIfExist(res) {
			var data = res.data;
			if(data.token) {
				tokenServ.setToken(data.token);
			}
			return data;
		}
		function login(userData) {
			console.log(userData);
			return $http.post(SERVER.host + '/user/login/', userData)
			.then(saveTokenIfExist, function (err) {
				return err;
			})
			.then(function(data){
				if(data && data.token) {
					console.log('got token and saved');
					console.log(data)
					localStorageServ.storeUserData(JSON.stringify(data));
					// resultServ.getResult('2');
					console.log(JSON.parse(localStorageServ.getUserData()));
					$rootScope.id = data.id;
					$location.path('/'+ data.id + '/result');
				}
				return data;
			})


		}

		function isLoggedIn() {
			return tokenServ.getToken();
		}

		function logout() {
			tokenServ.removeToken();
			localStorageServ.removeUserData();
			$location.path('/login');
		}
		return {
			login: login,
			isLoggedIn: isLoggedIn,
			logout: logout
		}
	}
})();