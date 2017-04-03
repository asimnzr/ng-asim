(function () {
    'use strict';

    app.controller('DeviceProblems', DeviceProblems);
    DeviceProblems.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function DeviceProblems($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.deviceProblems = [];

        function getProblemTypes() {
            Restangular.all('api/deviceproblems/getproblemtypes')
                .getList()
                .then(function (problemTypes) {
                    vm.problemTypes = problemTypes;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        getProblemTypes();

        vm.getAll = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/deviceproblems/getall')
                .getList()
                .then(function (deviceproblems) {
                    vm.deviceProblems = deviceproblems;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function () {
            vm.deviceProblems.push({ isNew: true });
        };
        vm.cancelEdit = function name(deviceProblem) {
            if (deviceProblem.isNew) {
                _.remove(vm.deviceProblems, deviceProblem);
            }
            else {
                delete deviceProblem.isEdit;
            }
        };
        function saveDeviceProblem(deviceProblem) {
            delete vm.ErrorMessage;
            Restangular.all('api/deviceproblems/savedeviceproblem')
                .post({ deviceProblem: deviceProblem })
                .then(function (deviceProblemId) {
                    delete deviceProblem.isNew;
                    deviceProblem.id = deviceProblemId;
                    deviceProblem.ProblemType = _.find(vm.problemTypes, { id: +deviceProblem.ProblemTypeId });
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Device Problem saved successfully')
                            .position('right')
                            .hideDelay(1500)
                        );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateDeviceProblem(deviceProblem) {
            delete vm.ErrorMessage;
            Restangular.all('api/deviceproblems/updatedeviceproblem')
                .post({ deviceProblem: deviceProblem })
                .then(function (message) {
                    delete deviceProblem.isEdit;
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
        vm.addEditDeviceProblem = function (deviceProblem) {
            if (deviceProblem.isNew) {
                saveDeviceProblem(deviceProblem);
            }
            else {
                updateDeviceProblem(deviceProblem);
            }
        };
        vm.deleteDeviceProblem = function (evt, deviceProblem) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this device probelm?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                Restangular.all('api/deviceproblems/deletedeviceproblem')
                    .post({ deviceProblemId: deviceProblem.id })
                    .then(function (message) {
                        _.remove(vm.deviceProblems, deviceProblem);
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
