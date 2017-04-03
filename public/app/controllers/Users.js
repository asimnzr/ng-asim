(function() {
    'use strict';

    app.controller('Users', Users);
    Users.$inject = ['$mdToast', '$mdDialog', '$window', 'Restangular'];

    function Users($mdToast, $mdDialog, $window, Restangular) {
        var vm = this;
        vm.users = [];

        Restangular.all('api/auth/roles/getall')
            .getList()
            .then(function(roles) {
                vm.roles = roles;
            }, function(err) {
                vm.ErrorMessage = err.data.message;
            });

        vm.changePassword = function() {
            if (!vm.user.oldPassword) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Old Password Required!')
                    .position('right')
                    .hideDelay(1500)
                );
                return;
            }
            if (!vm.user.newPassword) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('New Password Required!')
                    .position('right')
                    .hideDelay(1500)
                );
                return;
            }
            if (!vm.user.confirmPassword) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Confirm Password Required!')
                    .position('right')
                    .hideDelay(1500)
                );
                return;
            }
            if (vm.user.newPassword !== vm.user.confirmPassword) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('New Password and Confirm Password dont match!')
                    .position('right')
                    .hideDelay(1500)
                );
                return;
            }
            delete vm.ErrorMessage;
            Restangular.all('api/auth/changepassword')
                .post({ user: vm.user })
                .then(function(message) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(message)
                        .position('right')
                        .hideDelay(1500)
                    );
                    $window.location = "/";
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        };

        vm.getAll = function() {
            delete vm.ErrorMessage;
            Restangular.all('api/auth/users/getall')
                .getList()
                .then(function(users) {
                    vm.users = users;
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        };

        vm.initializeNew = function() {
            vm.users.push({ isNew: true });
        };

        vm.startEdit = function(user) {
            vm.userBackup = angular.copy(user);
            user.isEdit = true;
        };

        vm.cancelEdit = function name(user) {
            if (user.isNew) {
                _.remove(vm.users, user);
            } else {
                user = angular.copy(vm.userBackup);
                delete user.isEdit;
                vm.getAll();
            }
        };

        function saveUser(user) {
            delete vm.ErrorMessage;
            Restangular.all('api/auth/users/saveuser')
                .post({ user: user })
                .then(function(userId) {
                    delete user.isNew;
                    user.id = userId;
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('User saved successfully')
                        .position('right')
                        .hideDelay(1500)
                    );
                }, function(err) {
                    vm.ErrorMessage = err.data.message;
                });
        }

        function updateUser(user) {
            delete vm.ErrorMessage;
            Restangular.all('api/auth/users/updateuser')
                .post({ user: user })
                .then(function(message) {
                    delete user.isEdit;
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

        vm.addEditUser = function(user) {
            if (user.isNew) {
                saveUser(user);
            } else {
                updateUser(user);
            }
        };

        vm.deleteUser = function(evt, user) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this user?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                Restangular.all('api/auth/users/deleteuser')
                    .post({ userId: user.id })
                    .then(function(message) {
                        _.remove(vm.users, user);
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

        vm.setPassword = function(ev, user) {
            var confirm = $mdDialog.prompt()
                .title('Set User Password')
                .placeholder('Password')
                .ariaLabel('Password')
                .targetEvent(ev)
                .ok('Set Password')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function(result) {
                var newUser = {};
                newUser.id = user.id;
                newUser.password = result;
                delete vm.ErrorMessage;
                Restangular.all('api/auth/users/setpassword')
                    .post({ user: newUser })
                    .then(function(message) {
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