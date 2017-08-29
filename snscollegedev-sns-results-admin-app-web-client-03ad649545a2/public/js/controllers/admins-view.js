'use strict';
(function() {
    angular.module('myApp')

        .controller('adminViewCtrl', ['$scope', '$routeParams', 'AdminServ', adminViewCtrl]);

    function adminViewCtrl($scope, $routeParams, AdminServ) {
        var id = $routeParams.adminID;
        $scope.isAdminDetailsLoadded = false;
        $scope.keys = ['email', 'fullName'];
        $scope.editAdmin = {};

        function preventEventBubble(event) {
            if (event) {
                event.preventDefault();
            }
        }

        ;
        (function initalizeModals() {
            $('.modal').modal();
        })();

        AdminServ.getAdmin(id)
            .then(function cb(data) {
                $scope.admin = data.admin;
                $scope.editAdmin.email = data.admin.email;
                $scope.editAdmin.fullName = data.admin.fullName;
                $scope.isAdminDetailsLoadded = true;
            });


        function resetPassword() {
            var password = $scope.admin.password;
            AdminServ.resetPassword(id, password)
                .then(function cb(data) {
                    if (data.isSuccess) {
                        var message = 'Pasword Reseted Successfully';
                        $scope.showToast(message)
                    } else {
                        var message = data.message || 'Something Went Wrong, Sorry!';
                        $scope.showToast(message)
                    }
                })
        }

        function updateAdmin() {
            var fullName = $scope.editAdmin.fullName;
            var email = $scope.editAdmin.email;
            var data = {
                fullName: fullName,
                email: email
            };

            AdminServ.updateAdmin(id, data)
                .then(function cb(data) {
                    if (data.isSuccess) {
                        $scope.admin = data.admin;
                        alert('Updated Successfully')
                    }
                })
        }

        $scope.resetPassword = resetPassword;
        $scope.updateAdmin = updateAdmin;


    }
})();