'use strict';
(function() {
    var app = angular.module('myApp', ['ngRoute']);
    app.run(['$rootScope', function cb($rootScope) {
        function showToast(message, timePeriod, toastStyle, cb) {

            if (typeof timePeriod === 'function' && typeof cb === 'undefined') {
                cb = timePeriod;
            }

            if (typeof toastStyle === 'function' && typeof cb === 'undefined') {
                cb = toastStyle;
            }

            if (typeof timePeriod !== 'number') {
                timePeriod = 2000
            }

            if (typeof timePeriod !== 'string') {
                toastStyle = '';
            }

            if (typeof cb === 'function') {
                Materialize.toast(message, timePeriod, toastStyle, cb);
            } else {
                Materialize.toast(message, timePeriod, toastStyle);
            }

        }

        $rootScope.showToast = showToast;

    }])
    /*

    app.run(['$rootScope', '$location', '$route', 'AuthServ', function($rootScope, $location, $route, AuthServ) {
        function logOut() {
            AuthServ.logOut()
        };

        // Event Handler For $routeChangeStart Event..
        function onRouteChangeStart(event, next, current) {
            // Check Whether User Logged In Or Not..
            var isLoggedIn = AuthServ.isLoggedIn();
            $rootScope.isLoggedIn = isLoggedIn;

            // Check Whether The Next Route Needs Authentication..
            var isAuthNeeded = !(next.$$route && next.$$route.isPublic);

            // Deside Whether User Needs To Be Redirected To Login Page Or Not..
            var redirectToLoginPage = (isAuthNeeded && (!isLoggedIn));

            if (redirectToLoginPage) {
                $location.path('/login');
            }

        }

        // Logout Function...
        $rootScope.logOut = logOut;

        // Listener For Route Change Start...
        $rootScope.$on('$routeChangeStart', onRouteChangeStart);
    }]);
        */


    app.constant('AUTH_SERVER', {
        login: '//localhost:3000/auth/api/login',
        forgotPassword: '//localhost:3000/auth/api/forgot-password'
    })

    app.constant('API_SERVER', {
        admins: '//localhost:3000/api/admins',
        students: '//localhost:3000/api/students',
        results: '//localhost:3000/api/results'
    })

    app.config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '../templates/home.html',
                controller: 'homeCtrl',
                isPublic: true
            })
            .when('/dash', {
                templateUrl: '../templates/dash.html',
                controller: 'dashCtrl',
                isPublic: false
            })
            .when('/login', {
                templateUrl: '../templates/login.html',
                controller: 'loginCtrl',
                isPublic: true
            })
            .when('/about', {
                templateUrl: '../templates/about.html',
                controller: 'aboutCtrl',
                isPublic: true
            })
            .when('/admins', {
                templateUrl: '../templates/admins-list.html',
                controller: 'adminsListCtrl',
                isPublic: false
            })
            .when('/admins/new', {
                templateUrl: '../templates/admins-create.html',
                controller: 'adminCreationCtrl',
                isPublic: false
            })
            .when('/admins/:adminID', {
                templateUrl: '../templates/admins-view.html',
                controller: 'adminViewCtrl',
                isPublic: false
            })
            .when('/students', {
                templateUrl: '../templates/students-list.html',
                controller: 'studentsListCtrl',
                isPublic: false
            })
            .when('/students/new', {
                templateUrl: '../templates/students-create.html',
                controller: 'studentCreationCtrl',
                isPublic: false
            })
            .when('/students/:studentID', {
                templateUrl: '../templates/students-view.html',
                controller: 'studentViewCtrl',
                isPublic: false
            })
            .when('/results', {
                templateUrl: '../templates/results-dashboard.html',
                controller: 'resultsDashBoardCtrl',
                isPublic: false
            })
            .when('/results/upload', {
                templateUrl: '../templates/results-upload.html',
                controller: 'resultsUploadCtrl',
                isPublic: false
            })
            .otherwise('/home')
    }


})();