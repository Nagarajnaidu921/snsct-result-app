'use strict';
(function() {
    angular.module('myApp')

        .controller('studentCreationCtrl', ['$scope', '$route', 'StudentServ', studentCreationCtrl]);

    function studentCreationCtrl($scope, $route, StudentServ) {


        function initalizeUpdateGenderValues() {
            $('select').material_select();
        }

        function reloadController() {
            $route.reload();
        }

        function onRouteChangeSuccess() {
            initalizeUpdateGenderValues();
        }

        $scope.$on('$routeChangeSuccess', onRouteChangeSuccess);
        $scope.updateGenderValues = initalizeUpdateGenderValues;
        $scope.registerNumberPattern = /[1-9][1-9](au|ae|ag|bm|ce|cp|cs|ee|ei|ec|it|mc|me|ma)[0-9][0-9][0-9]/g;

        function createNewStudent() {
            function cb(data) {
                if (data.isSuccess) {
                    var message = 'New Student Created Successfully';
                    $scope.showToast(message, reloadController)
                } else {
                    var message = data.message || 'Something Went Wrong, Sorry!';
                    $scope.showToast(message);
                }
            };

            var student = $scope.student;
            StudentServ.createNew(student)
                .then(cb)
        }


        $scope.createNewStudent = createNewStudent;

    }
})();