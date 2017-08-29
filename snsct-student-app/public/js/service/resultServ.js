'use strict';
(function(){
	angular.module('snsct')
	.factory('resultServ', ['$http', 'localStorageServ', 'SERVER', resultServ]);
	function resultServ($http, localStorageServ, SERVER) {
		function getResult(sem) {
			var Id = JSON.parse(localStorageServ.getUserData()).id;
			console.log(Id);
			return $http.get('/user/result/' + Id +'/' + sem, {params: {id: Id}})
			.then(function(res) {
				var data = res.data;
				console.log(data);
				return data;
			})
		}
		return {
			getResult: getResult
		}
	}
})();