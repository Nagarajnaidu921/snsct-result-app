'use strict';
(function() {
    angular.module('myApp')

    .factory('StudentServ', ['$http', 'API_SERVER', StudentServ]);

    function StudentServ($http, API_SERVER) {

        function getList() {
            return $http.get(API_SERVER.students)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function createNew(student) {
            return $http.post(API_SERVER.students, student)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function remove(id) {
            var url = API_SERVER.students + '/' + id;
            return $http.delete(url)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function getStudent(id) {
            var url = API_SERVER.students + '/' + id;
            return $http.get(url)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function updateStudent(id, updateFields) {
            function filterValidUpdateFields(key) {
                return updateFields[key];
            }

            function makeDataForUpdate(keys) {
                var data = {};
                keys.forEach(function(key) {
                    data[key] = updateFields[key];
                })
                return data;
            }

            var keys = ['registerNumber', 'fullName', 'email', 'gender', 'password'].filter(filterValidUpdateFields);
            var data = makeDataForUpdate(keys);

            var url = API_SERVER.students + '/' + id;
            return $http.put(url, data)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function resetPassword(id, password) {
            return updateStudent(id, { password: password });
        }

        return {
            getStudent: getStudent,
            getList: getList,
            createNew: createNew,
            remove: remove,
            resetPassword: resetPassword,
            updateStudent: updateStudent
        };

    }
})();
