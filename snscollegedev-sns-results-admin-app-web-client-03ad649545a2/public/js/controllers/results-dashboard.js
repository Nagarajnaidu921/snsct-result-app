'use strict';
(function() {
    angular.module('myApp')

        .controller('resultsDashBoardCtrl', ['$scope', 'ResultServ', resultsDashBoardCtrl]);

    function resultsDashBoardCtrl($scope, ResultServ) {

        function preventEventDefaultAction(event) {
            if (event) {
                event.preventDefault();
            }
        }

        ;
        (function initalizeModals() {
            $('.modal').modal();
        })();

        $scope.editResult = {};

        function getResultsByRegisterNumber(event) {
            var registerNumber = $scope.student.registerNumber;
            ResultServ.getResults(registerNumber)
                .then(function(data) {
                    $scope.student = data.student;
                    $scope.results = data.results;
                })
        }

        function removeResult(event, result) {
            preventEventDefaultAction(event);
            event.stopPropagation();

            var id = result.id;
            ResultServ.remove(id)
                .then(function(data) {
                    if (data.isSuccess) {
                        var index = $scope.results.indexOf(result);
                        $scope.results.splice(index, 1);
                        console.log('removed')
                    }
                })
        }

        function updateResult() {
            var result = $scope.editResult.sourceResultObj;
            var id = $scope.editResult.id;
            var grade = $scope.editResult.grade;
            var subjectCode = $scope.editResult.subjectCode;
            var data = {
                grade: grade,
                subjectCode: subjectCode
            };

            ResultServ.update(id, data)
                .then(function(data) {
                    var isSuccess = (data || {}).isSuccess;
                    if (isSuccess) {
                        result.grade = grade;
                        result.subjectCode = subjectCode;
                    }
                })
        }

        function editResult(event, result) {
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    $scope.editResult[key] = result[key];
                }
            }

            $scope.editResult.sourceResultObj = result;
        }


        $scope.getResultsByRegisterNumber = getResultsByRegisterNumber;
        $scope.removeResult = removeResult;
        $scope.updateResult = updateResult;
        $scope.editResult = editResult;

    }
})();