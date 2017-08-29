'use strict';
(function() {
    angular.module('myApp')

        .controller('studentViewCtrl', ['$scope', '$route', '$routeParams', 'StudentServ', studentViewCtrl]);

    function studentViewCtrl($scope, $route, $routeParams, StudentServ) {
        var id = $routeParams.studentID;
        $scope.isStudentDetailsLoadded = false;
        $scope.keys = ['email', 'fullName'];
        $scope.editStudent = {};
        $scope.registerNumberPattern = /^[1-9][1-9](au|ae|ag|bm|ce|cp|cs|ee|ei|ec|it|mc|me|ma)[0-9][0-9][0-9]/;

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


        function preventEventBubble(event) {
            if (event) {
                event.preventDefault();
            }
        }

        ;
        (function initalizeModals() {
            $('.modal').modal();
        })();

        StudentServ.getStudent(id)
            .then(function cb(data) {
                var student = (data.student || {});
                $scope.student = data.student;
                for (var key in student) {
                    if (student.hasOwnProperty(key)) {
                        $scope.editStudent[key] = data.student[key]
                    }
                }

                $scope.isStudentDetailsLoadded = true;
            });


        function resetPassword() {
            var password = $scope.student.password;
            StudentServ.resetPassword(id, password)
                .then(function cb(data) {
                    if (data.isSuccess) {
                        var message = 'Password Reseted Successfully';
                        $scope.showToast(message)
                    } else {
                        var message = data.message || 'Something Went Wrong, Sorry!';
                        $scope.showToast(message);
                    }
                })
        }


        function updateStudent() {
            var data = $scope.editStudent || {};

            StudentServ.updateStudent(id, data)
                .then(function cb(data) {
                    if (data.isSuccess) {
                        var student = data.student || {};
                        $scope.student = student;
                        var message = 'Updated Successfully';
                        // $scope.showToast(message, reloadController)
                        $scope.showToast(message, reloadController)
                        if (student.id !== id) {
                            id = student.id;
                            var url = '/students/' + id;
                            $location.path(url);
                        }
                    }
                })
        }

        $scope.resetPassword = resetPassword;
        $scope.updateStudent = updateStudent;


    }
})();