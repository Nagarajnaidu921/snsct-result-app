
(function(){
	angular.module('snsct')
	.controller('resultDataCtrl', ['$scope', '$routeParams', '$location', 'loginServ', 'localStorageServ', 'resultServ', resultDataCtrl]);
	function resultDataCtrl($scope, $routeParams, $location, loginServ, localStorageServ, resultServ) {
		console.log($routeParams)

		resultServ.getResult($routeParams.sem)
		.then(data => {
		     var results = data.result;
		     // console.log(results)
		     if(results){
		     	console.log(data)
		     	$scope.id = JSON.parse(localStorageServ.getUserData()).regNum;
		     	$scope.results = results;	
		     	console.log($scope.results)	;
		     	$scope.isSuccess = true;
		     }
		     else if(!results) {
		     	$scope.isSuccess = data.isSuccess;
		     	$scope.message = data.message;
		     }
		     
		})
	
		
	}
})();