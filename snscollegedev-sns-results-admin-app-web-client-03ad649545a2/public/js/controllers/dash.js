'use strict';
(function () {
	angular.module('myApp')
	
	.controller('dashCtrl', ['$scope', dashCtrl]);

	function dashCtrl($scope) {
		    $('ul.tabs').tabs();
	}
})();