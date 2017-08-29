(function() {
	angular.module('snsct')
	.factory('localStorageServ', ['$window', localStorageServ]);
	function localStorageServ($window) {
		var storage = $window.localStorage;
		var key = 'snsctuserdata';
		function storeUserData(data) {
			storage.setItem(key, data);
		}
		function getUserData(){
			return storage.getItem(key);
		}
		function getUserId(){
			var data = JSON.parse(storage.getItem(key));
			console.log(data);
			return data.id;
		}
		function removeUserData(){
			storage.removeItem(key);
		}
		return {
			storeUserData: storeUserData,
			getUserData: getUserData,
			removeUserData: removeUserData,
			getUserId: getUserId
		}
	}
})();
