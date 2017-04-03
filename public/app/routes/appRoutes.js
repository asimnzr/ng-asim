'use strict';

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // enable html5 mode to remove ugly urls
    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider
        .state('home', {
            url: "/home",
            //templateUrl: "/index.html",
            //controller: 'Index',
            //controllerAs: "vm"
        })
        .state('changepassword', {
            url: "/changepassword",
            templateUrl: "app/partials/changepassword.html",
            controller: 'Users',
            controllerAs: "vm"
        })
        .state('users', {
            url: "/users",
            templateUrl: "app/partials/users.html",
            controller: 'Users',
            controllerAs: "vm"
        })
        .state('receivedevices', {
            url: "/receivedevices",
            templateUrl: "app/partials/receivedevices.list.html",
            controller: 'ReceiveDevicesList',
            controllerAs: "vm"
        })
        .state('newreceivedevice', {
            url: "/receivedevices/new",
            templateUrl: "app/partials/receivedevice.new.html",
            controller: 'ReceiveDeviceDetails',
            controllerAs: "vm"
        })
        .state('editreceivedevice', {
            url: "/receivedevices/:receiveDeviceId/edit",
            templateUrl: "app/partials/receivedevice.edit.html",
            controller: 'ReceiveDeviceDetails',
            controllerAs: "vm"
        })
        .state('communication', {
            url: "/communication",
            templateUrl: "app/partials/receivedevices.list.html",
            controller: 'ReceiveDevicesList',
            controllerAs: "vm"
        })
        .state('editcommunication', {
            url: "/communication/:receiveDeviceId/edit",
            templateUrl: "app/partials/receivedevice.edit.html",
            controller: 'ReceiveDeviceDetails',
            controllerAs: "vm"
        })
        .state('fixing', {
            url: "/fixing",
            templateUrl: "app/partials/receivedevices.list.html",
            controller: 'ReceiveDevicesList',
            controllerAs: "vm"
        })
        .state('editfixing', {
            url: "/fixing/:receiveDeviceId/edit",
            templateUrl: "app/partials/receivedevice.edit.html",
            controller: 'ReceiveDeviceDetails',
            controllerAs: "vm"
        })
        .state('employees', {
            url: "/employees",
            templateUrl: "app/partials/employees.list.html",
            controller: 'EmployeesList',
            controllerAs: "vm"
        })
        .state('editemployee', {
            url: "/employees/:employeeId/edit",
            templateUrl: "app/partials/employee.edit.html",
            controller: 'EmployeeDetails',
            controllerAs: "vm"
        })
        .state('newemployee', {
            url: "/employees/new",
            templateUrl: "app/partials/employee.new.html",
            controller: 'EmployeeDetails',
            controllerAs: "vm"
        })
        .state('customers', {
            url: "/customers",
            templateUrl: "app/partials/customers.list.html",
            controller: 'CustomersList',
            controllerAs: "vm"
        })
        .state('newcustomer', {
            url: "/customers/new",
            templateUrl: "app/partials/customer.new.html",
            controller: 'CustomerDetails',
            controllerAs: "vm"
        })
        .state('editcustomer', {
            url: "/customers/:customerId/edit",
            templateUrl: "app/partials/customer.edit.html",
            controller: 'CustomerDetails',
            controllerAs: "vm"
        })
        .state('devicetypes', {
            url: "/devicetypes",
            templateUrl: "app/partials/devicetypes.html",
            controller: 'DeviceTypes',
            controllerAs: "vm"
        })
        .state('devices', {
            url: "/devices",
            templateUrl: "app/partials/devices.html",
            controller: 'Devices',
            controllerAs: "vm"
        })
        .state('locations', {
            url: "/locations",
            templateUrl: "app/partials/locations.html",
            controller: 'Locations',
            controllerAs: "vm"
        })
        .state('missingdevices', {
            url: "/missingdevices",
            templateUrl: "app/partials/missingdevices.html",
            controller: 'MissingDevices',
            controllerAs: "vm"
        })
        .state('accessories', {
            url: "/accessories",
            templateUrl: "app/partials/accessories.html",
            controller: 'Accessories',
            controllerAs: "vm"
        })
        .state('deviceproblems', {
            url: "/deviceproblems",
            templateUrl: "app/partials/deviceproblems.html",
            controller: 'DeviceProblems',
            controllerAs: "vm"
        });
});