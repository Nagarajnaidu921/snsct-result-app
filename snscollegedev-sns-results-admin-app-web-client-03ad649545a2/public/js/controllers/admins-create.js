'use strict';
(function() {
    angular.module('myApp')

        .controller('adminCreationCtrl', ['$scope', '$route', 'AdminServ', adminCreationCtrl]);

    function adminCreationCtrl($scope, $route, AdminServ) {

        function reloadController() {
            $route.reload();
        }

        function createNewAdmin() {
            function cb(data) {
                if (data.isSuccess) {
                    var message = 'New Admin User Created Successfully';
                    $scope.showToast(message, reloadController)
                } else {
                    var message = data.message || 'Something Went Wrong, Sorry!';
                    $scope.showToast(message)
                }
            };

            var admin = $scope.admin;
            AdminServ.createNew(admin)
                .then(cb)
        }


        $scope.createNewAdmin = createNewAdmin;

    }
})();