'use strict';
(function () {
	angular.module('myApp')
	
	.factory('TokenServ', ['localStorageServ', TokenServ]);

	function TokenServ(localStorageServ) {
		var key = 'ACCESS_TOKEN';

		function save(token) {
			localStorageServ.save(key, token)
		}

		function remove() {
			localStorageServ.remove(key);
		}

		function getToken() {
			return localStorageServ.read(key)
		}

		return {
			save: save,
			remove: remove,
			getToken: getToken
		};
		
	}

})();