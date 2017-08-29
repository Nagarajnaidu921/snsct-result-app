'use strict';
(function() {
    angular.module('myApp')

    .factory('AdminServ', ['$http', 'API_SERVER', AdminServ]);

    function AdminServ($http, API_SERVER) {

        function getList() {
            return $http.get(API_SERVER.admins)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function createNew(admin) {
            return $http.post(API_SERVER.admins, admin)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function remove(id) {
            var url = API_SERVER.admins + '/' + id;
            return $http.delete(url)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function getAdmin(id) {
            var url = API_SERVER.admins + '/' + id;
            return $http.get(url)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function updateAdmin(id, updateFields) {
            var password = updateFields.password;
            var fullName = updateFields.fullName;
            var email = updateFields.email;
            var data = {};
            if (password) {
                data.password = password;
            }

            if (fullName) {
                data.fullName = fullName;
            }

            if (email) {
                data.email = email;
            }

            var url = API_SERVER.admins + '/' + id;
            return $http.put(url, data)
                .then(function cb(res) {
                    var data = res.data || {};
                    return data;
                })
        }

        function resetPassword(id, password) {
            return updateAdmin(id, { password: password });
        }

        return {
            getAdmin: getAdmin,
            getList: getList,
            createNew: createNew,
            remove: remove,
            resetPassword: resetPassword,
            updateAdmin: updateAdmin
        };

    }
})();
