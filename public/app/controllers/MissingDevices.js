(function () {
    'use strict';

    app.controller('MissingDevices', MissingDevices);
    MissingDevices.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function MissingDevices($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.missingDevices = [];

        vm.getAll = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/missingdevices/getall')
                .getList()
                .then(function (missingdevices) {
                    vm.missingDevices = missingdevices;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function () {
            vm.missingDevices.push({ isNew: true });
        };
        vm.cancelEdit = function name(missingdevice) {
            if (missingdevice.isNew) {
                _.remove(vm.missingDevices, missingdevice);
            }
            else {
                delete missingdevice.isEdit;
            }
        };
        function saveMissingDevice(missingDevice) {
            delete vm.ErrorMessage;
            Restangular.all('api/missingdevices/savemissingdevice')
                .post({ missingDevice: missingDevice })
                .then(function (missingDeviceId) {
                    delete missingDevice.isNew;
                    missingDevice.id = missingDeviceId;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Missing Device saved successfully')
                            .position('right')
                            .hideDelay(1500)
                        );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateMissingDevice(missingDevice) {
            delete vm.ErrorMessage;
            Restangular.all('api/missingdevices/updatemissingdevice')
                .post({ missingDevice: missingDevice })
                .then(function (message) {
                    delete missingDevice.isEdit;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(1500)
                        );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        vm.addEditMissingDevice = function (missingDevice) {
            if (missingDevice.isNew) {
                saveMissingDevice(missingDevice);
            }
            else {
                updateMissingDevice(missingDevice);
            }
        };
        vm.deleteMissingDevice = function (evt, missingDevice) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this missing device?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                Restangular.all('api/missingdevices/deletemissingdevice')
                    .post({ missingDeviceId: missingDevice.id })
                    .then(function (message) {
                        _.remove(vm.missingDevices, missingDevice);
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(message)
                                .position('right')
                                .hideDelay(1500)
                            );
                    }, function (err) {
                        vm.ErrorMessage = err.data.message;
                    });
            }, function () {
                // do nothing for the time being
            });
        };
    }
})();
