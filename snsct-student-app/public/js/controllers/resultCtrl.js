'use strict';
(function(){
	angular.module('snsct')
	.controller('resultCtrl', ['$scope', '$routeParams', '$location', 'loginServ', 'localStorageServ', 'resultServ', resultCtrl]);
	function resultCtrl($scope, $routeParams, $location, loginServ, localStorageServ, resultServ) {
		// console.log($routeParams)
		
		$scope.sutentId = $routeParams.id;
		$scope.semesters = ['Semester - 1','Semester - 2','Semester - 3','Semester - 4','Semester - 5','Semester - 6','Semester - 7','Semester - 8',];
		
		$scope.logout = function(){
			loginServ.logout();
		}
	}
})();