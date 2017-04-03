(function () {
    'use strict';

    app.controller('ReceiveDeviceDetails', ReceiveDeviceDetails);
    ReceiveDeviceDetails.$inject = ['$filter', '$stateParams', '$state', '$mdToast', '$mdDialog', 'Restangular'];

    function ReceiveDeviceDetails($filter, $stateParams, $state, $mdToast, $mdDialog, Restangular) {
        var vm = this;

        vm.getLookups = function () {
            vm.lookups = {};
            delete vm.ErrorMessage;
            Restangular.all('api/accessories/getall')
                .getList()
                .then(function (accessories) {
                    vm.lookups.accessories = accessories;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
            Restangular.all('api/deviceproblems/getall')
                .getList()
                .then(function (deviceProblems) {
                    vm.lookups.deviceProblems = deviceProblems;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
            Restangular.all('api/devices/getall')
                .getList()
                .then(function (devices) {
                    vm.lookups.devices = devices;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
            Restangular.all('api/locations/getall')
                .getList()
                .then(function (locations) {
                    vm.lookups.locations = locations;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
            Restangular.all('api/missingdevices/getall')
                .getList()
                .then(function (missingdevices) {
                    vm.lookups.missingDevices = missingdevices;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
            Restangular.all('api/receivedevices/getstatuses')
                .getList()
                .then(function (statuses) {
                    vm.lookups.statuses = statuses;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.searchCustomers = function (customerQuery) {
            delete vm.ErrorMessage;
            return Restangular.all('api/customers/searchcustomers')
                .getList({ searchText: customerQuery })
                .then(function (customers) {
                    return customers;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.searchEmployees = function (employeeQuery, type) {
            delete vm.ErrorMessage;
            return Restangular.all('api/employees/searchemployees')
                .post({ searchText: employeeQuery, type: type })
                .then(function (employees) {
                    return employees;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.searchDevices = function (deviceQuery) {
            delete vm.ErrorMessage;
            return Restangular.all('api/devices/searchdevices')
                .getList({ searchText: deviceQuery })
                .then(function (devices) {
                    return devices;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.searchAccessories = function (accessoryQuery) {
            var results = accessoryQuery ? $filter('filter')(vm.lookups.accessories, { name: accessoryQuery }) : [];
            return results;
        };
        vm.searchMissingDevices = function (missingDeviceQuery) {
            var results = missingDeviceQuery ? $filter('filter')(vm.lookups.missingDevices, { name: missingDeviceQuery }) : [];
            return results;
        };
        vm.searchLocations = function (locationQuery) {
            var results = locationQuery ? $filter('filter')(vm.lookups.locations, { name: locationQuery }) : [];
            return results;
        };
        vm.initReceiveDevice = function () {
            vm.receiveDevice = {};
            vm.receiveDevice.receiveDate = new Date();
            vm.receiveDevice.deliverStatus = false;
            vm.receiveDevice.ReceiveDeviceAccessories = [];
            vm.receiveDevice.ReceiveDeviceMissingDevices = [];
            vm.receiveDevice.ReceiveDeviceProblems = [];
            vm.receiveDevice.ReceiveDeviceEmployeeProblems = [];
            vm.receiveDevice.ReceiveDeviceCommunications = [];
            vm.getLookups();
        };
        vm.getReceiveDevice = function () {
            vm.getLookups();
            delete vm.ErrorMessage;
            Restangular.one('api/receivedevices/getreceivedevicebyid')
                .get({ receiveDeviceId: $stateParams.receiveDeviceId })
                .then(function (receiveDevice) {
                    vm.receiveDevice = receiveDevice;
                    vm.role = vm.receiveDevice.role;
                    delete vm.receiveDevice.role;
                    // to fix the issue of pre selection of already set lookups in autocomplete
                    vm.receiveDevice.search = {
                        customerQuery: '',
                        employeeQuery: '',
                        locationQuery: '',
                        hardwareEmployeeQuery: '',
                        softwareEmployeeQuery: ''
                    };
                    if (vm.receiveDevice.Customer) {
                        vm.receiveDevice.search.customerQuery = vm.receiveDevice.Customer.name;
                    }
                    if (vm.receiveDevice.Location) {
                        vm.receiveDevice.search.locationQuery = vm.receiveDevice.Location.name;
                    }
                    if (vm.receiveDevice.HardwareEmployee) {
                        vm.receiveDevice.search.hardwareEmployeeQuery = vm.receiveDevice.HardwareEmployee.name;
                    }
                    if (vm.receiveDevice.SoftwareEmployee) {
                        vm.receiveDevice.search.softwareEmployeeQuery = vm.receiveDevice.SoftwareEmployee.name;
                    }
                    var temp = vm.receiveDevice.ReceiveDeviceAccessories;
                    vm.receiveDevice.ReceiveDeviceAccessories = [];
                    if (temp) {
                        _.forEach(temp, function (accessory, key) {
                            vm.receiveDevice.ReceiveDeviceAccessories.push(_.find(vm.lookups.accessories, { id: accessory.Accessory.id }));
                        });
                    }
                    var temp = vm.receiveDevice.ReceiveDeviceMissingDevices;
                    if (temp) {
                        vm.receiveDevice.ReceiveDeviceMissingDevices = [];
                        _.forEach(temp, function (missingDevice, key) {
                            vm.receiveDevice.ReceiveDeviceMissingDevices.push(_.find(vm.lookups.missingDevices, { id: missingDevice.MissingDevice.id }));
                        });
                    }
                    if (vm.receiveDevice.receiveDate) {
                        vm.receiveDevice.receiveDate = new Date(vm.receiveDevice.receiveDate);
                    }
                    if (vm.receiveDevice.handoverDate) {
                        vm.receiveDevice.handoverDate = new Date(vm.receiveDevice.handoverDate);
                    }
                    if (vm.receiveDevice.ReceiveDeviceCommunications) {
                        _.forEach(vm.receiveDevice.ReceiveDeviceCommunications, function (communication, key) {
                            if (communication.communicationDate) {
                                communication.communicationDate = new Date(communication.communicationDate);
                            }
                            if (communication.communcationTime) {
                                communication.communcationTime = new Date(communication.communcationTime);
                            }
                        });
                    }
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };

        function mapRelations() {
            vm.receiveDevice.CustomerId = vm.receiveDevice.Customer ? vm.receiveDevice.Customer.id : null;
            vm.receiveDevice.DeviceId = vm.receiveDevice.Device ? vm.receiveDevice.Device.id : null;
            vm.receiveDevice.LocationId = vm.receiveDevice.Location ? vm.receiveDevice.Location.id : null;
            vm.receiveDevice.HardwareEmployeeId = vm.receiveDevice.HardwareEmployee ? vm.receiveDevice.HardwareEmployee.id : null;
            vm.receiveDevice.SoftwareEmployeeId = vm.receiveDevice.SoftwareEmployee ? vm.receiveDevice.SoftwareEmployee.id : null;
        }
        vm.saveReceiveDevice = function () {
            var softwareStatus = _.find(vm.lookups.statuses, { id: +vm.receiveDevice.SoftwareStatusId });
            var hardwareStatus = _.find(vm.lookups.statuses, { id: +vm.receiveDevice.HardwareStatusId });
            if ((softwareStatus && softwareStatus.name === 'Fixing' || hardwareStatus && hardwareStatus.name === 'Fixing') && !vm.receiveDevice.ReceiveDeviceProblems.length) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Please add one or more Customer Device Problems before saving')
                        .position('right')
                        .hideDelay(2000)
                );
            }
            else {
                delete vm.ErrorMessage;
                mapRelations();
                Restangular.all('/api/receivedevices/savereceivedevice')
                    .post({ receiveDevice: vm.receiveDevice })
                    .then(function (receiveDeviceId) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Receive Device saved successfully')
                                .position('right')
                                .hideDelay(1500)
                        );
                        $state.transitionTo('editreceivedevice', { receiveDeviceId: receiveDeviceId })
                    }, function (err) {
                        vm.ErrorMessage = err.data.message;
                    });
            }
        };
        vm.updateReceiveDevice = function () {
            delete vm.ErrorMessage;
            mapRelations();
            Restangular.all('/api/receivedevices/updatereceivedevice')
                .post({ receiveDevice: vm.receiveDevice })
                .then(function (message) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(1500)
                    );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };

        function updateTotals() {
            var approvedTotal = 0;
            _.forEach(vm.receiveDevice.ReceiveDeviceProblems, function (value, key) {
                approvedTotal = approvedTotal + (+value.cost + +value.serviceCharges);
            });
            vm.receiveDevice.approvedTotal = approvedTotal;
        }

        vm.addEditReceiveDeviceProblem = function (evt, index, isEmployeeProblem) {
            $mdDialog.show({
                controller: EditReceiveDeviceProblem,
                templateUrl: 'app/partials/receivedeviceproblem.edit.html',
                parent: angular.element(document.querySelector('#editReceiveDeviceProblemDialog')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    isNew: index ? false : true,
                    deviceProblems: vm.lookups.deviceProblems,
                    receiveDeviceProblem: index ? isEmployeeProblem ? angular.copy(vm.receiveDevice.ReceiveDeviceEmployeeProblems[index - 1]) : angular.copy(vm.receiveDevice.ReceiveDeviceProblems[index - 1]) : {}
                }
            })
                .then(function (updatedReceiveDeviceProblem) {
                    var message = '';
                    if (index) {
                        if (isEmployeeProblem) {
                            vm.receiveDevice.ReceiveDeviceEmployeeProblems[index - 1] = updatedReceiveDeviceProblem;
                        } else {
                            vm.receiveDevice.ReceiveDeviceProblems[index - 1] = updatedReceiveDeviceProblem;
                        }
                        message = 'Receive Device Problem updated successfully, please save the Receive Device record to save it permanently!';
                    } else {
                        if (isEmployeeProblem) {
                            if (!vm.receiveDevice.ReceiveDeviceEmployeeProblems) {
                                vm.receiveDevice.ReceiveDeviceEmployeeProblems = [];
                            }
                        } else {
                            if (!vm.receiveDevice.ReceiveDeviceProblems) {
                                vm.receiveDevice.ReceiveDeviceProblems = [];
                            }
                        }
                        if (isEmployeeProblem) {
                            vm.receiveDevice.ReceiveDeviceEmployeeProblems.push(updatedReceiveDeviceProblem);
                        } else {
                            vm.receiveDevice.ReceiveDeviceProblems.push(updatedReceiveDeviceProblem);
                        }
                        message = 'Receive Device Problem  added successfully, please save the Receive Device record to save it permanently!';
                    }
                    updateTotals();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(2500)
                    );
                });
        };

        vm.removeReceiveDeviceProblem = function (evt, problem, isEmployeeProblem) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this Receive Device Problem?')
                //.textContent('Deleting this record is not reverable.')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                if (isEmployeeProblem) {
                    _.remove(vm.receiveDevice.ReceiveDeviceEmployeeProblems, problem);
                } else {
                    _.remove(vm.receiveDevice.ReceiveDeviceProblems, problem);
                }
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Receive Device Problem removed, please update the Receive Device record to remove it permanently!')
                        .position('right')
                        .hideDelay(2500)
                );
                updateTotals();
            }, function () {
                console.log('Delete cancelled');
            });
        };

        vm.fixingAction = function (evt) {
            $mdDialog.show({
                controller: FixingAction,
                templateUrl: 'app/partials/fixingaction.html',
                parent: angular.element(document.querySelector('#fixingActionDialog')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    role: vm.role,
                    receiveDevice: angular.copy(vm.receiveDevice),
                    statuses: angular.copy(vm.lookups.statuses)
                }
            })
                .then(function (objStatus) {
                    var receiveDeviceToUpdate = angular.copy(vm.receiveDevice);
                    if (vm.role && vm.role === 'SOFTWARETECHNICIAN') {
                        receiveDeviceToUpdate.SoftwareStatusId = objStatus.newStatus.id;
                    }
                    if (vm.role && vm.role === 'HARDWARETECHNICIAN') {
                        receiveDeviceToUpdate.HardwareStatusId = objStatus.newStatus.id;
                    }
                    delete vm.ErrorMessage;
                    console.log(receiveDeviceToUpdate);
                    Restangular.all('/api/receivedevices/updatereceivedevicestatus')
                        .post({ receiveDeviceId: vm.receiveDevice.id, newStatusId: objStatus.newStatus.id })
                        .then(function (message) {
                            vm.getReceiveDevice();
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(message)
                                    .position('right')
                                    .hideDelay(1500)
                            );
                        }, function (err) {
                            vm.ErrorMessage = err.data.message;
                        });
                });
        };

        vm.addEditCustomerCommunication = function (evt, index) {
            $mdDialog.show({
                controller: EditReceiveDeviceCommunication,
                templateUrl: 'app/partials/receivedevicecommunication.edit.html',
                parent: angular.element(document.querySelector('#receiveDeviceCommunicationDialog')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    isNew: index ? false : true,
                    customerPhones: vm.receiveDevice.Customer.phones,
                    receiveDeviceCommunication: index ? angular.copy(vm.receiveDevice.ReceiveDeviceCommunications[index - 1]) : {}
                }
            })
                .then(function (updatedReceiveDeviceCommunication) {
                    var message = '';
                    if (index) {
                        vm.receiveDevice.ReceiveDeviceCommunications[index - 1] = updatedReceiveDeviceCommunication;
                        message = 'Receive Device Communication updated successfully, please save the Receive Device record to save it permanently!';
                    } else {
                        if (!vm.receiveDevice.ReceiveDeviceCommunications) {
                            vm.receiveDevice.ReceiveDeviceCommunications = [];
                        }
                        vm.receiveDevice.ReceiveDeviceCommunications.push(updatedReceiveDeviceCommunication);
                        message = 'Receive Device Communication added successfully, please save the Receive Device record to save it permanently!';
                    }
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(2500)
                    );
                });
        };
        vm.removeCustomerCommunication = function (evt, communication) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this Receive Device Communication?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                _.remove(vm.receiveDevice.ReceiveDeviceCommunications, communication);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Receive Device Communication removed, please update the Receive Device record to remove it permanently!')
                        .position('right')
                        .hideDelay(2500)
                );
            }, function () {
                console.log('Delete cancelled');
            });

        };
    }

    function FixingAction($scope, $mdDialog, role, receiveDevice, statuses) {
        $scope.objStatus = {};
        $scope.objStatus.location = receiveDevice.Location;
        if (role && role === 'SOFTWARETECHNICIAN') {
            if (receiveDevice.SoftwareStatus && receiveDevice.SoftwareStatus.name === 'Estimation') {
                $scope.objStatus.oldStatus = receiveDevice.SoftwareStatus;
                $scope.objStatus.newStatus = _.find(statuses, { name: 'Working' });
            }
            if (receiveDevice.SoftwareStatus && receiveDevice.SoftwareStatus.name === 'Fixing') {
                $scope.objStatus.oldStatus = receiveDevice.SoftwareStatus;
                $scope.objStatus.newStatus = _.find(statuses, { name: 'Fixing Start' });
            }
        }
        if (role && role === 'HARDWARETECHNICIAN') {
            if (receiveDevice.HardwareStatus && receiveDevice.HardwareStatus.name === 'Estimation') {
                $scope.objStatus.oldStatus = receiveDevice.HardwareStatus;
                $scope.objStatus.newStatus = _.find(statuses, { name: 'Working' });
            }
            if (receiveDevice.HardwareStatus && receiveDevice.HardwareStatus.name === 'Fixing') {
                $scope.objStatus.oldStatus = receiveDevice.HardwareStatus;
                $scope.objStatus.newStatus = _.find(statuses, { name: 'Fixing Start' });
            }
        }
        $scope.save = function () {
            $mdDialog.hide($scope.objStatus);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }

    function EditReceiveDeviceProblem($scope, $mdDialog, isNew, deviceProblems, receiveDeviceProblem) {
        $scope.isNew = isNew;
        $scope.deviceProblems = deviceProblems;
        if (receiveDeviceProblem) {
            $scope.receiveDeviceProblem = receiveDeviceProblem;
        }
        $scope.save = function () {
            $scope.receiveDeviceProblem.DeviceProblem = _.find(deviceProblems, { id: +$scope.receiveDeviceProblem.DeviceProblemId });
            $scope.receiveDeviceProblem.DeviceProblemId = +$scope.receiveDeviceProblem.DeviceProblemId;
            $mdDialog.hide($scope.receiveDeviceProblem);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }

    function EditReceiveDeviceCommunication($scope, $mdDialog, isNew, customerPhones, receiveDeviceCommunication) {
        $scope.isNew = isNew;
        $scope.customerPhones = customerPhones;
        if (receiveDeviceCommunication) {
            $scope.receiveDeviceCommunication = receiveDeviceCommunication;
        }
        $scope.save = function () {
            //$scope.receiveDeviceCommunication.phoneNo = _.find(customerPhones, { id: +$scope.receiveDeviceProblem.DeviceProblemId });
            //$scope.receiveDeviceProblem.DeviceProblemId = +$scope.receiveDeviceProblem.DeviceProblemId;
            $mdDialog.hide($scope.receiveDeviceCommunication);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
})();