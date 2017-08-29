'use strict';
(function(){
	angular.module('snsct')
	.factory('tokenServ', ['$window', tokenServ]);
	function tokenServ($window) {
		var key = 'snscttoken';
		var storage = $window.localStorage;

		function setToken(token) {
			return storage.setItem(key, token);
		}

		function getToken(token) {
			return storage.getItem(key, token);
		}

		function removeToken() {
			storage.removeItem(key);
		}


		return {
			setToken: setToken,
			getToken: getToken,
			removeToken: removeToken
		}

	}
})();