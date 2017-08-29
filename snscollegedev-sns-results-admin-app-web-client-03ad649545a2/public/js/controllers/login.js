'use strict';
(function() {
    angular.module('myApp')

        .controller('loginCtrl', ['$scope', '$location', 'AuthServ', loginCtrl]);

    function loginCtrl($scope, $location, AuthServ) {

                        $scope.errors = {};

        function login() {
            var email = $scope.admin.email;
            var password = $scope.admin.password;
            AuthServ.logIn(email, password)
                .then(function cb(data) {
                    if (data.token) {
                        $scope.errors.hasError = false;
                        $location.path('/dash');
                    } else {
                        $scope.errors.hasError = true;
                        $scope.errors.message = data.message;
                    }
                })
                .catch(function errorCb(error) {
                    console.error(error)
                })
        }


        $scope.login = login;
    }
})();