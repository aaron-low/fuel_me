var _ = require('lodash');
var $ = require('jquery');

function FuelListController($scope, fuelMeModel, fuelMeController) {

    fuelMeModel.registerListener(this);

    var updateSidePanel = function(fuelMeModel) {
        $scope.journey = fuelMeModel.getSelectedJourney();
        _.defer(function(){$scope.$apply();});
    };

    this.pricesUpdated = function(fuelMeModel) {
        var journeys = fuelMeModel.getJourneys();
        if (_.isEmpty(journeys)) {
            $.notify("That was not a valid journey", "error");
        } else {
            $.notify("Fuel locations updated", "success");
        }
        updateSidePanel(fuelMeModel);
    };

    this.journeyUpdated = function(fuelMeModel) {
        updateSidePanel(fuelMeModel);
    };

    this.priceSelected = function(fuelMeModel) {

    };

    $scope.selectPrice = function(price) {
        fuelMeController.selectPrice(price);
    };
}

FuelListController.$inject = ['$scope', 'fuelMeModel', 'fuelMeController'];

module.exports = FuelListController;