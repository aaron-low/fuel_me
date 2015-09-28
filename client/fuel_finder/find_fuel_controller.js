

function FindFuelController($scope, fuelMeController) {

    $scope.origin = '';
    $scope.destination = '';
    $scope.buffer = 0;

    $scope.goClicked = function () {
        fuelMeController.findCheapFuel($scope.origin, $scope.destination, $scope.buffer);
    };
}

FindFuelController.$inject = ['$scope', 'fuelMeController'];

module.exports = FindFuelController;
