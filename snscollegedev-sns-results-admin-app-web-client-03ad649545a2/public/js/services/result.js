'use strict';
(function() {
    angular.module('myApp')

        .factory('ResultServ', ['$http', 'API_SERVER', ResultServ]);

    function ResultServ($http, API_SERVER) {

        function uploadResults(data) {
            var url = API_SERVER.results + '/upload';
            var config = {
                headers: { 'Content-Type': undefined }
            };
            return $http.post(url, data, config)
                .then(function(res) {
                    return res.data;
                })
        }

        function remove(id) {
            var url = API_SERVER.results + '/' + id;
            return $http.delete(url)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function getResults(registerNumber) {
            var url = API_SERVER.results + '/search';

            var params = {
                registerNumber: registerNumber
            };

            return $http.get(url, { params: params })
                .then(function(res) {
                    return res.data;
                })
        }

        function update(id, data) {
            var url = API_SERVER.results + '/' + id;
            var updatedData = {};

            return $http.put(url, data)
                .then(function(res) {
                    return res.data;
                })
        }

        return {
            uploadResults: uploadResults,
            getResults: getResults,
            remove: remove,
            update: update
        };

    }
})();