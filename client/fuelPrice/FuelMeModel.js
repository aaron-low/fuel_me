"use strict";

var _ = require('lodash');

function FuelMeModel() {

    var self = this;

    var listeners = [];

    this.registerListener = function(l) {
        listeners.push(l);
    };

    var notifyListeners = function() {
        _(listeners).forEach(function(l) {
            l.refresh(self);
        }).value();
    };

    var journeys = null;

    this.setJourneys = function(journeyArray) {
        if (!_.isEmpty(journeyArray)) {
            journeyArray[0].selected = true;
        }
        journeys = journeyArray;
        notifyListeners();
    };

    this.getJourneys = function() {
        return journeys;
    };

    this.selectJourney = function(journey) {
        _(journeys).forEach(function(j) {
            if (j === journey) {
                j.selected = true;
            } else {
                j.selected = false;
            }
        }).value();
        notifyListeners();
    };

    this.getSelectedJourney = function() {
        var result = journeys.filter(function( obj ) {
            return obj.selected === true;
        });
        return !_.isEmpty(result) ? result[0] : null;
    };
}

module.exports = FuelMeModel;