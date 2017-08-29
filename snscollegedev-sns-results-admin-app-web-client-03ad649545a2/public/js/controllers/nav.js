'use strict';
(function() {
    angular.module('myApp')

    .controller('navCtrl', ['$scope', '$location', '$route', 'AuthServ', navCtrl]);

    function navCtrl($scope, $location, $route, AuthServ) {
        function mkMenuItems(menuItem) {
            var url = menuItem[0];
            var text = menuItem[1];
            return {
                url: url,
                text: text
            };
        }

        var navMenuItems = [
            ['#!/home', 'Home'],
            ['#!/dash', 'Dash'],
            ['#!/login', 'Login'],
            ['#!/admins', 'Admins'],
            ['#!/students', 'Students'],
            ['#!/results', 'Results'],
            ['#!/about', 'About Us']
            // ['#!/login', 'Logout']
        ].map(mkMenuItems);

        $scope.navMenuItems = navMenuItems;

        function logOut() {
            AuthServ.logOut()
        };

        // Event Handler For $routeChangeStart Event..
        function onRouteChangeStart(event, next, current) {
            // Check Whether User Logged In Or Not..
            var isLoggedIn = AuthServ.isLoggedIn();
            $scope.isLoggedIn = isLoggedIn;

            // Check Whether The Next Route Needs Authentication..
            var isAuthNeeded = !(next.$$route && next.$$route.isPublic);

            // Deside Whether User Needs To Be Redirected To Login Page Or Not..
            var redirectToLoginPage = (isAuthNeeded && (!isLoggedIn));

            if (redirectToLoginPage) {
                $location.path('/login');
            }

            
            var isLoginPath = (next.$$route && next.$$route.originalPath === '/login');

            if (isLoginPath && isLoggedIn) {
                $location.path('/');
            }

        }

        // Logout Function...
        $scope.logOut = logOut;
        $scope.$on('$routeChangeStart', onRouteChangeStart);

    }
})();
