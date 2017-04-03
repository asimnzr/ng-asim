(function () {
    'use strict';

    app.controller('Accessories', Accessories);
    Accessories.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function Accessories($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.accessories = [];

        vm.getAll = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/accessories/getall')
                .getList()
                .then(function (accessories) {
                    vm.accessories = accessories;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function () {
            vm.accessories.push({ isNew: true });
        };
        vm.cancelEdit = function name(accessory) {
            if (accessory.isNew) {
                _.remove(vm.accessories, accessory);
            }
            else {
                delete accessory.isEdit;
            }
        };
        function saveAccessory(accessory) {
            delete vm.ErrorMessage;
            Restangular.all('api/accessories/saveaccessory')
                .post({ accessory: accessory })
                .then(function (accessoryId) {
                    delete accessory.isNew;
                    accessory.id = accessoryId;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Accessory saved successfully')
                            .position('right')
                            .hideDelay(1500)
                        );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateAccessory(accessory) {
            delete vm.ErrorMessage;
            Restangular.all('api/accessories/updateaccessory')
                .post({ accessory: accessory })
                .then(function (message) {
                    delete accessory.isEdit;
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
        vm.addEditAccessory = function (accessory) {
            if (accessory.isNew) {
                saveAccessory(accessory);
            }
            else {
                updateAccessory(accessory);
            }
        };
        vm.deleteAccessory = function (evt, accessory) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this accessory?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                Restangular.all('api/accessories/deleteaccessory')
                    .post({ accessoryId: accessory.id })
                    .then(function (message) {
                        _.remove(vm.accessories, accessory);
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
            });
        };
    }
})();
