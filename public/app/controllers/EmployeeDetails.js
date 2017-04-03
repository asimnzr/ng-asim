(function () {
    'use strict';

    app.controller('EmployeeDetails', EmployeeDetails);
    EmployeeDetails.$inject = ['$stateParams', '$mdToast', '$mdDialog', '$window', 'Restangular'];

    function EmployeeDetails($stateParams, $mdToast, $mdDialog, $window, Restangular) {
        var vm = this;
        vm.employee = {};

        vm.getEmployee = function () {
            delete vm.ErrorMessage;
            Restangular.one('api/employees/getemployeebyid')
                .get({ employeeId: $stateParams.employeeId })
                .then(function (employee) {
                    vm.employee = employee;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.saveEmployee = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/employees/saveemployee')
                .post({ employee: vm.employee })
                .then(function (employeeId) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Employee saved successfully')
                            .position('right')
                            .hideDelay(1500)
                        );
                    $window.location = '/employees/' + employeeId + '/edit';
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.updateEmployee = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/employees/updateemployee')
                .post({ employee: vm.employee })
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
        vm.addEditEmployeePhone = function (evt, index) {
            $mdDialog.show({
                controller: EditPhone,
                templateUrl: 'app/partials/phone.edit.html',
                parent: angular.element(document.querySelector('#editPhoneDialog')),
                targetEvent: evt,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    isNew: index ? false : true,
                    phone: index ? angular.copy(vm.employee.phones[index - 1]) : {}
                }
            })
                .then(function (updatedPhone) {
                    var message = '';
                    if (index) {
                        vm.employee.phones[index - 1] = updatedPhone;
                        message = 'Phone updated successfully, please save the employee record to save it permanently!';
                    }
                    else {
                        if (!vm.employee.phones) {
                            vm.employee.phones = [];
                        }
                        vm.employee.phones.push(updatedPhone);
                        message = 'Phone added successfully, please save the employee record to save it permanently!';
                    }
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('right')
                            .hideDelay(2500)
                        );
                });
        };
        vm.removeEmployeePhone = function (evt, phone) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this phone?')
            //.textContent('Deleting this record is not reverable.')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                _.remove(vm.employee.phones, phone);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Phone removed, please update the employee record to remove it permanently!')
                        .position('right')
                        .hideDelay(2500)
                    );
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


