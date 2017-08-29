'use strict';
(function() {
    angular.module('myApp')

        .controller('resultsUploadCtrl', ['$scope', 'ResultServ', resultsUploadCtrl]);

    function resultsUploadCtrl($scope, ResultServ) {
        // ResultServ.uploadResultsFile(fileElem);
        function uploadResultsFile(event) {
            var fileInputElem = resultsUploadForm['resultsFile'];
            var selectedFile = fileInputElem.files[0];
            var formData = new FormData();
            formData.append('results', selectedFile);
            ResultServ.uploadResults(formData)
                .then(function(data) {
                    console.log(resultsUploadForm)
                    resultsUploadForm.reset();
                    $scope.resultsUploadForm.$dirty = false;
                    $scope.resultsUploadForm.$pristine = true;
                    $scope.resultsUploadForm.$submitted = false;
                })
        }

        $scope.uploadResultsFile = uploadResultsFile;
    }
})();