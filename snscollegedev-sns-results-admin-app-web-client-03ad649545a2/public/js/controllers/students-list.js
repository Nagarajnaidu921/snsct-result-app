'use strict';
(function() {
    angular.module('myApp')

        .controller('studentsListCtrl', ['$scope', '$location', 'StudentServ', studentsListCtrl]);

    function studentsListCtrl($scope, $location, StudentServ) {

        function preventEventBubble(event) {
            if (event) {
                event.preventDefault();
            }
        }

        function preLoader(isPreloader) {
            $scope.isPreloader = isPreloader;
        }

        function removeStudent(event, student) {
            preventEventBubble(event);
            event.stopPropagation();
            var id = student.id;
            preLoader(true);

            function cb(data) {
                preLoader(false);
                var isSuccess = data.isSuccess;
                if (isSuccess) {
                    var index = $scope.students.indexOf(student);
                    $scope.students.splice(index, 1);
                    var message = 'Student Removed Successfully';
                    $scope.showToast(message)
                } else {
                    var message = data.message || 'Something Went Wrong, Sorry!';
                    $scope.showToast(message)
                }
            };

            StudentServ.remove(id)
                .then(cb)
        };

        function viewStudent(event, student) {
            preventEventBubble(event);
            var id = student.id;
            var url = '/students/' + id;
            $location.path(url);
        }

        $scope.removeStudent = removeStudent;
        $scope.viewStudent = viewStudent;


        // Show PreLoader On Initial Loading
        // preLoader(true);

        // Get The List Of Active Student..

        StudentServ.getList()
            .then(function cb(data) {
                preLoader(false);
                $scope.students = data.students;
            })

    }
})();