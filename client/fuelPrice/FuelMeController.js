"use strict";


function FuelMeController(fuelMeView, fuelMeModel, journeyBroker) {

    this.selectJourney = function(journey) {
        fuelMeModel.selectJourney(journey);
    };

    this.findCheapFuel = function(origin, destination, buffer) {
        journeyBroker.findCheapFuel(origin, destination, buffer)
            .then(function(journey) {
                fuelMeModel.setJourneys(journey);
            }).catch(function(error) {
                fuelMeView.errorMsg(error);
            });
    };
}

module.exports = FuelMeController;