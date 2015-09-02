"use strict";


function FuelMeController(fuelMeModel, journeyBroker) {

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

module.exports = FuelMeController;