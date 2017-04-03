(function () {
    'use strict';

    app.controller('Locations', Locations);
    Locations.$inject = ['$mdToast', '$mdDialog', 'Restangular'];

    function Locations($mdToast, $mdDialog, Restangular) {
        var vm = this;
        vm.locations = [];

        vm.getAll = function () {
            delete vm.ErrorMessage;
            Restangular.all('api/locations/getall')
                .getList()
                .then(function (locations) {
                    vm.locations = locations;
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        };
        vm.initializeNew = function () {
            vm.locations.push({ isNew: true });
        };
        vm.cancelEdit = function name(location) {
            if (location.isNew) {
                _.remove(vm.locations, location);
            }
            else {
                delete location.isEdit;
            }
        };
        function saveLocation(location) {
            delete vm.ErrorMessage;
            Restangular.all('api/locations/savelocation')
                .post({ location: location })
                .then(function (locationId) {
                    delete location.isNew;
                    location.id = locationId;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Location saved successfully')
                            .position('right')
                            .hideDelay(1500)
                        );
                }, function (err) {
                    vm.ErrorMessage = err.data.message;
                });
        }
        function updateLocation(location) {
            delete vm.ErrorMessage;
            Restangular.all('api/locations/updatelocation')
                .post({ location: location })
                .then(function (message) {
                    delete location.isEdit;
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
        vm.addEditLocation = function (location) {
            if (location.isNew) {
                saveLocation(location);
            }
            else {
                updateLocation(location);
            }
        };
        vm.deleteLocation = function (evt, location) {
            delete vm.ErrorMessage;
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this location?')
                .targetEvent(evt)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                Restangular.all('api/locations/deletelocation')
                    .post({ locationId: location.id })
                    .then(function (message) {
                        _.remove(vm.locations, location);
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
    }
})();
