(function() {
    'use strict';

    app.controller('DeviceTypes', DeviceTypes);
    DeviceTypes.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function DeviceTypes($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.deviceTypes = [];

        vm.getAll = function() {
            delete vm.ErrorMessage;
            Restangular.all('api/devicetypes/getall')
                .getList()
                .then(function(deviceTypes) {
                    vm.deviceTypes = deviceTypes;
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function() {
            vm.deviceTypes.push({ isNew: true });
        };
        vm.cancelEdit = function name(deviceType) {
            if (deviceType.isNew) {
                _.remove(vm.deviceTypes, deviceType);
            }
            else {
                delete deviceType.isEdit;
            }
        };
        function saveDeviceType(deviceType) {
            delete vm.ErrorMessage;
            Restangular.all('api/devicetypes/savedevicetype')
                .post({ deviceType: deviceType })
                .then(function(deviceTypeId) {
                    delete deviceType.isNew;
                    deviceType.id = deviceTypeId;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Device Type saved successfully')
                            .position('right')
                            .hideDelay(1500)
                    );
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateDeviceType(deviceType) {
            delete vm.ErrorMessage;
            Restangular.all('api/devicetypes/updatedevicetype')
                .post({ deviceType: deviceType })
                .then(function(message) {
                    delete deviceType.isEdit;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(1500)
                    );
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        vm.addEditDeviceType = function(deviceType) {
            if (deviceType.isNew) {
                saveDeviceType(deviceType);
            }
            else {
                updateDeviceType(deviceType);
            }
        };
        vm.deleteDeviceType = function(evt, deviceType) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this device type?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                Restangular.all('api/devicetypes/deletedevicetype')
                    .post({ deviceTypeId: deviceType.id })
                    .then(function(message) {
                        _.remove(vm.deviceTypes, deviceType);
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(message)
                                .position('right')
                                .hideDelay(1500)
                        );
                    }, function(err) {
                        vm.ErrorMessage = err.data.message;
                    });
            }, function() {
            });
        };
    }
})();

