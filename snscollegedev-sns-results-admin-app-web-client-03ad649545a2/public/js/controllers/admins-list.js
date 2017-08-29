'use strict';
(function() {
    angular.module('myApp')

        .controller('adminsListCtrl', ['$scope', '$location', 'AdminServ', adminsListCtrl]);

    function adminsListCtrl($scope, $location, AdminServ) {

        function preventEventBubble(event) {
            if (event) {
                event.preventDefault();
            }
        }

        function preLoader(isPreloader) {
            $scope.isPreloader = isPreloader;
        }

        function removeAdmin(event, admin) {
            preventEventBubble(event);
            event.stopPropagation();
            var id = admin.id;
            preLoader(true);

            function cb(data) {
                preLoader(false);
                var isSuccess = data.isSuccess;
                if (isSuccess) {
                    var index = $scope.admins.indexOf(admin);
                    $scope.admins.splice(index, 1);
                    Materialize.toast('Admin Removed', 4000);
                } else {
                    Materialize.toast(data.message, 4000);
                }
            };

            AdminServ.remove(id)
                .then(cb)
        };

        function viewAdmin(event, admin) {
            preventEventBubble(event);
            var id = admin.id;
            var url = '/admins/' + id;
            $location.path(url);
        }

        $scope.removeAdmin = removeAdmin;
        $scope.viewAdmin = viewAdmin;


        // Show PreLoader On Initial Loading
        preLoader(true);

        // Get The List Of Active Admins..

        AdminServ.getList()
            .then(function cb(data) {
                preLoader(false);
                $scope.admins = data.admins;
            })

    }
})();