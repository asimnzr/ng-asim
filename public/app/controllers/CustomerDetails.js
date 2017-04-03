(function () {
    'use strict';

    app.controller('CustomerDetails', CustomerDetails);
    CustomerDetails.$inject = ['$stateParams', '$mdToast', '$mdDialog', '$window', 'Restangular'];

    function CustomerDetails($stateParams, $mdToast, $mdDialog, $window, Restangular) {
        var vm = this;
        vm.customer = {};

        vm.getCustomer = function () {
            delete vm.ErrorMessage;
            Restangular.one('api/customers/getcustomerbyid')
                .get({ customerId: $stateParams.customerId })
                .then(function (customer) {
                    vm.customer = customer;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.saveCustomer = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/customers/savecustomer')
                .post({ customer: vm.customer })
                .then(function (customerId) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Customer saved successfully')
                            .position('right')
                            .hideDelay(1500)
                    );
                    $window.location = '/customers/' + customerId + '/edit';
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.updateCustomer = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/customers/updatecustomer')
                .post({ customer: vm.customer })
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
        vm.addEditCustomerPhone = function (evt, index) {
            $mdDialog.show({
                controller: EditPhone,
                templateUrl: 'app/partials/phone.edit.html',
                parent: angular.element(document.querySelector('#editPhoneDialog')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    isNew: index ? false : true,
                    phone: index ? angular.copy(vm.customer.phones[index - 1]) : {}
                }
            })
                .then(function (updatedPhone) {
                    var message = '';
                    if (!vm.customer.id) {
                        if (index) {
                            vm.customer.phones[index - 1] = updatedPhone;
                            message = 'Customer phone updated successfully!';
                        }
                        else {
                            if (!vm.customer.phones) {
                                vm.customer.phones = [];
                            }
                            vm.customer.phones.push(updatedPhone);
                            message = 'Customer phone added successfully!';
                        }
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(message)
                                .position('right')
                                .hideDelay(2500)
                        );
                    }
                    else {
                        if (index) {
                            Restangular.all('api/customers/updatecustomerphone')
                                .post({ customerPhone: updatedPhone })
                                .then(function (message) {
                                    vm.customer.phones[index - 1] = updatedPhone;
                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent('Customer phone updated successfully!')
                                            .position('right')
                                            .hideDelay(1500)
                                    );
                                }, function (err) {
                                    vm.ErrorMessage = err.data.message;
                                });
                        }
                        else {
                            updatedPhone.CustomerId = vm.customer.id;
                            Restangular.all('api/customers/savecustomerphone')
                                .post({ customerPhone: updatedPhone })
                                .then(function (customerPhoneId) {
                                    if (!vm.customer.phones) {
                                        vm.customer.phones = [];
                                    }
                                    updatedPhone.id = customerPhoneId;
                                    vm.customer.phones.push(updatedPhone);
                                    message = 'Phone added successfully!';
                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent('Customer phone updated successfully!')
                                            .position('right')
                                            .hideDelay(1500)
                                    );
                                }, function (err) {
                                    vm.ErrorMessage = err.data.message;
                                });

                        }
                    }
                });
        };
        vm.removeCustomerPhone = function (evt, phone) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this phone?')
                //.textContent('Deleting this record is not reverable.')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                if (!phone.id) {
                    _.remove(vm.customer.phones, phone);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Customer phone removed successfully!')
                            .position('right')
                            .hideDelay(2500)
                    );
                }
                else {
                    Restangular.all('api/customers/deletecustomerphone')
                        .post({ customerPhoneId: phone.id })
                        .then(function (message) {
                            _.remove(vm.customer.phones, phone);
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

            }, function () {
                console.log('Delete cancelled');
            });

        };
    }
    function EditPhone($scope, $mdDialog, isNew, phone) {
        if (phone) {
            $scope.phone = phone;
        }
        $scope.isNew = isNew;
        $scope.save = function () {
            if ($scope.phone.type !== 'Mobile') {
                delete $scope.phone.smsEnabled;
            }
            $mdDialog.hide($scope.phone);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
})();
