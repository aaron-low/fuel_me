"use strict";

function FuelMeController(fuelMeModel, journeyBroker) {

    this.selectPrice = function(price) {
        fuelMeModel.selectPrice(price);
    };

    this.selectJourney = function(journey) {
        fuelMeModel.selectJourney(journey);
    };

    this.findCheapFuel = function(origin, destination, buffer) {
        journeyBroker.findCheapFuel(origin, destination, buffer)
            .then(function(journeys) {
                fuelMeModel.setJourneys(journeys);
            });
    };
}

FuelMeController.$inject = ['fuelMeModel', 'journeyBroker'];

module.exports = FuelMeController;