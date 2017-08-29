'use strict';
(function () {
	angular.module('myApp')
	
	.controller('aboutCtrl', ['$scope', aboutCtrl]);

	function aboutCtrl($scope) {
		$scope.title = 'About Us Page';
	}
})();