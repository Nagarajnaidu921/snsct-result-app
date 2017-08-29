'use strict';
(function(){
	angular.module('snsct')
	.controller('mainCtrl', ['$scope', 'loginServ', mainCtrl]);
	function mainCtrl($scope, loginServ) {

		// var isLoggedIn = loginServ.isLoggedIn();
		// console.log(isLoggedIn, 'isLoggedIn')
		// if(isLoggedIn) {
		// 	$scope.isLoggedIn = true;
		// } else {
		// 	$scope.isLoggedIn = false;
		// }
		$scope.isLoggedIn = false;
		console.log($scope.isLoggedIn);
		function logout() {
			loginServ.logout();
		}
		function onRouteChangeStart(event, next, current) {
            if(loginServ.isLoggedIn()) {
            	$scope.isLoggedIn = true;
            } else {
            	if(!loginServ.isLoggedIn()) {
            		$scope.isLoggedIn = false;
            	}
            }
        }
        $scope.logout = logout;
        $scope.$on('$routeChangeStart', onRouteChangeStart)
	}
})();