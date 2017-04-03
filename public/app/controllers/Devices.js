(function() {
    'use strict';

    app.controller('Devices', Devices);
    Devices.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function Devices($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.deviceTypes = [];

        function getDeviceTypes() {
            Restangular.all('api/devicetypes/getall')
                .getList()
                .then(function(deviceTypes) {
                    vm.deviceTypes = deviceTypes;
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        getDeviceTypes();

        vm.getAll = function() {
            delete vm.ErrorMessage;
            Restangular.all('api/devices/getall')
                .getList()
                .then(function(devices) {
                    vm.devices = devices;
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function() {
            vm.devices.push({ isNew: true });
        };
        vm.cancelEdit = function name(device) {
            if (device.isNew) {
                _.remove(vm.devices, device);
            }
            else {
                delete device.isEdit;
            }
        };
        function saveDevice(device) {
            delete vm.ErrorMessage;
            Restangular.all('api/devices/savedevice')
                .post({ device: device })
                .then(function(deviceId) {
                    delete device.isNew;
                    device.id = deviceId;
                    device.DeviceType = _.find(vm.deviceTypes, { id: +device.DeviceTypeId });
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Device saved successfully')
                            .position('right')
                            .hideDelay(1500)
                    );
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateDevice(device) {
            delete vm.ErrorMessage;
            Restangular.all('api/devices/updatedevice')
                .post({ device: device })
                .then(function(message) {
                    delete device.isEdit;
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
        vm.addEditDevice = function(device) {
            if (device.isNew) {
                saveDevice(device);
            }
            else {
                updateDevice(device);
            }
        };
        vm.deleteDevice = function(evt, device) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this device?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                Restangular.all('api/devices/deletedevice')
                    .post({ deviceId: device.id })
                    .then(function(message) {
                        _.remove(vm.devices, device);
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
                // do nothing for the time being
            });
        };
    }
})();
