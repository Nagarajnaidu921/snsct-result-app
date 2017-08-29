'use strict';
(function(){
	angular.module('snsct')
	.controller('loginCtrl', ['$scope', 'loginServ', 'tokenServ', loginCtrl]);
	function loginCtrl($scope, loginServ, tokenServ) {
		$scope.login = function() {
			console.log($scope.user);
			loginServ.login($scope.user)
			.then(function(data){
				if(!data.token) {
					$.notify(data.message, 'error');
					console.log(data);
				}
				
			}, function (err) {
				console.log('errr');
			})

		}

		$scope.logout = function(){
			loginServ.logout();
		}
	}
})();