(function () {
    'use strict';

    app.controller('CustomersList', CustomersList);
    CustomersList.$inject = ['$mdDialog', '$mdToast', 'Restangular'];

    function CustomersList($mdDialog, $mdToast, Restangular) {
        var vm = this;
        vm.PAGE_SIZE = 20;
        vm.getAll = function () {
            delete vm.ErrorMessage;
            vm.customers = [];
            vm.totalDisplayed = vm.PAGE_SIZE;
            Restangular.all('api/customers/getall')
                .getList()
                .then(function (customers) {
                    vm.customers = customers;
                    updateDisplaySize();
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.updatePageSize = function () {
            if (vm.query) {
                vm.totalDisplayed = vm.PAGE_SIZE;
                updateDisplaySize();
            }
        }
        function updateDisplaySize() {
            setTimeout(function () {
                _.times(vm.customers.length / vm.PAGE_SIZE, function (index) {
                    setTimeout(function () {
                        vm.totalDisplayed = vm.totalDisplayed + vm.PAGE_SIZE;
                    }, 10);
                });
            }, 200);
        }
        vm.confirmDelete = function (evt, customerId) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this customer?')
            //.textContent('Deleting this record is not reverable.')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                Restangular.all('api/customers/deletecustomer')
                    .post({ customerId: customerId })
                    .then(function (message) {
                        _.remove(vm.customers, { id: customerId });
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
                console.log('Delete cancelled');
            });
        };
        vm.showPhones = function (evt, customer) {
            $mdDialog.show({
                controller: PhonesList,
                templateUrl: 'app/partials/phones.list.html',
                parent: angular.element(document.querySelector('#phonesDialogContainer')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    title: customer.name,
                    phones: customer.phones
                }
            })
        };
    }
    function PhonesList($scope, $mdDialog, title, phones) {
        $scope.title = title;
        $scope.phones = phones;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
})();

