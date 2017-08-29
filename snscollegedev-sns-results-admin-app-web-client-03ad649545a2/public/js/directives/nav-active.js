'use strict';
(function() {
    angular.module('myApp')
        .directive('navActive', ['$rootScope', '$window', 'AuthServ', navActive]);

    // This Directive Will Controll Which Menu Item Should Be Higlited..
    // So That User Can See Where He Is Now..
    // And Also Controlls Which Menu Items Should Be Shown After/Before Login.

    function navActive($rootScope, $window, AuthServ) {

        function link(scope, element, attrs) {
            var li = element.parent();
            if (li[0].nodeName === 'LI') {
                $rootScope.$on('$routeChangeSuccess', function(e) {
                    if (element[0].href === $window.location.href) {
                        li.addClass('active');
                    } else {
                        li.removeClass('active');
                    }
                })


                $rootScope.$on('$routeChangeStart', function(e) {

                    var isLoggedIn = AuthServ.isLoggedIn();

                    var isLoginMenu = (element[0].innerText === 'Login');
                    var isRegisterMenu = (element[0].innerText === 'Register');

                    if (isRegisterMenu || isLoginMenu) {
                        if (isLoggedIn) {
                            li.addClass('hide');
                        } else {
                            li.removeClass('hide');
                        }
                    }


                })

            }
        }

        return {
            restrict: 'A',
            link: link
        }
    }


})();
