"use strict";

var _ = require('lodash');

function FuelMeModel() {

    var self = this;

    var listeners = [];

    this.registerListener = function(l) {
        listeners.push(l);
    };

    var notifyListenersPricesUpdated = function() {
        _(listeners).forEach(function(l) {
            l.pricesUpdated(self);
        }).value();
    };

    var notifyListenersJourneyUpdated = function() {
        _(listeners).forEach(function(l) {
            l.journeyUpdated(self);
        }).value();
    };

    var notifyListenersPriceSelected = function() {
        _(listeners).forEach(function(l) {
            l.priceSelected(self);
        }).value();
    };

    var journeys = null;

    this.setJourneys = function(journeyArray) {
        this.selectedPrice = null;
        if (!_.isEmpty(journeyArray)) {
            journeyArray[0].selected = true;
        }
        journeys = journeyArray;
        notifyListenersPricesUpdated();
    };

    this.getJourneys = function() {
        return journeys;
    };

    this.selectPrice = function(price) {
        this.selectedPrice = price;
        notifyListenersPriceSelected();
    };

    this.selectJourney = function(journey) {
        _(journeys).forEach(function(j) {
            if (j === journey) {
                j.selected = true;
            } else {
                j.selected = false;
            }
        }).value();
        notifyListenersJourneyUpdated();
    };

    this.getSelectedJourney = function() {
        var result = journeys.filter(function( obj ) {
            return obj.selected === true;
        });
        return !_.isEmpty(result) ? result[0] : null;
    };
}

module.exports = FuelMeModel;