(function() {
    'use strict';

    app.controller("IndexController", IndexController);
    IndexController.$inject = ['$window'];

    function IndexController($window) {
        var vm = this;
        vm.logout = function() {
            $window.location = "/api/auth/logout";
        };
    }
})();