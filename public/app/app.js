'use strict';

// var app = angular.module('reptran', ['ui.router', 'angular-loading-bar', 'restangular', 'ngMaterial', 'mdDataTable', 'smart-table']);
var app = angular.module('reptran', ['ui.router', 'angular-loading-bar', 'restangular', 'ngMaterial', 'mdPickers']);

// inject lodash.js (_) globally
app.constant('_', window._);
app.run(['$rootScope', '$state', function ($rootScope, $state, $cookies) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            
        });
}]);





