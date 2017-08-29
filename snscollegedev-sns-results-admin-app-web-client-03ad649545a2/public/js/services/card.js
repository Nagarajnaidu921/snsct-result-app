'use strict';
(function () {
	angular.module('myApp')
	
	.factory('cardServ', ['$q', '$timeout', cardServ]);

	function cardServ($q, $timeout) {

		function getAll() {
			var defered = $q.defer();

			var cards = [];

			var cardImagePath = '../images/card-image.jpg'
			var text = `
			I am a very simple card.
			I am good at containing small bits of information. 
			I am convenient because I require little markup to use effectively.
			`;

			var numberOfCards = 10;

			for (var i = 0; i < numberOfCards; i++) {
				var card = {
					title: 'Card Title' + (i + 1),
					text: text,
					cardImagePath: cardImagePath
				};
				cards.push(card);
			};

			$timeout(function () {
				defered.resolve(cards)
			}, 100)

			return defered.promise;

		}

		return {
			getAll: getAll
		};
		
	}
})();