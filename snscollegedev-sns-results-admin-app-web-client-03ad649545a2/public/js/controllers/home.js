'use strict';
(function () {
	angular.module('myApp')
	
	.controller('homeCtrl', ['$scope', 'cardServ', homeCtrl]);

	function homeCtrl($scope, cardServ) {
		cardServ.getAll()
		.then(function (cards) {
			$scope.cards = cards;
		})
	}
})();