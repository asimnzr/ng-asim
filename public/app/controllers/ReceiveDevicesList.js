(function() {
    'use strict';

    app.controller('ReceiveDevicesList', ReceiveDevicesList);
    ReceiveDevicesList.$inject = ['$mdDialog', '$mdToast', '$state', 'Restangular'];

    function ReceiveDevicesList($mdDialog, $mdToast, $state, Restangular) {
        var vm = this;
        vm.PAGE_SIZE = 20;
        vm.getAll = function() {
            delete vm.ErrorMessage;
            vm.receiveDevices = [];
            vm.totalDisplayed = vm.PAGE_SIZE;
            Restangular.all('api/receivedevices/getall')
                .getList({ viewType: $state.current.name })
                .then(function(receiveDevices) {
                    vm.receiveDevices = receiveDevices;
                    //console.log(_.filter(vm.employees, { address: '313 Q Block Model Town Lahore' }));
                    //updateDisplaySize();
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.updatePageSize = function() {
            if (vm.query) {
                vm.totalDisplayed = vm.PAGE_SIZE;
                updateDisplaySize();
            }
        }

        function updateDisplaySize() {
            setTimeout(function() {
                _.times(vm.employees.length / vm.PAGE_SIZE, function(index) {
                    setTimeout(function() {
                        vm.totalDisplayed = vm.totalDisplayed + vm.PAGE_SIZE;
                    }, 10);
                });
            }, 200);
        }
        vm.deleteReceiveDevice = function(evt, receiveDeviceId) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this Receive Device?')
                //.textContent('Deleting this record is not reverable.')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                Restangular.all('/api/receivedevices/deletereceivedevice')
                    .post({ receiveDeviceId: receiveDeviceId })
                    .then(function(message) {
                        _.remove(vm.receiveDevices, { id: receiveDeviceId });
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
                console.log('Delete cancelled');
            });
        };

        vm.startEdit = function(receiveDeviceId) {
            if ($state.current.name === 'receivedevices') {
                $state.transitionTo('editreceivedevice', { receiveDeviceId: receiveDeviceId });
            }
            if ($state.current.name === 'communication') {
                $state.transitionTo('editcommunication', { receiveDeviceId: receiveDeviceId });
            }
            if ($state.current.name === 'fixing') {
                $state.transitionTo('editfixing', { receiveDeviceId: receiveDeviceId });
            }
        };

        vm.showPhones = function(evt, employee) {
            $mdDialog.show({
                controller: PhonesList,
                templateUrl: 'app/partials/phones.list.html',
                parent: angular.element(document.querySelector('#phonesDialogContainer')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    title: employee.name,
                    phones: employee.phones
                }
            })
        };
    }

    function PhonesList($scope, $mdDialog, title, phones) {
        $scope.title = title;
        $scope.phones = phones;
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();