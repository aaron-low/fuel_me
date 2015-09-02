"use strict";

var _ = require('lodash');

var Journey = require('./Journey');

function JourneyBroker(fuelFinderWebService) {

    this.findCheapFuel = function (origin, destination, buffer) {
        return fuelFinderWebService.findCheapFuel(origin, destination, buffer)
            .then(function (data) {
                var result = [];
                _(data).forEach(function(thing) {
                    result.push(new Journey(thing.line, thing.prices));
                }).value();
                return result;
            }).catch(function () {
                // return no journeys
                return [];
            });
    };

}

module.exports = JourneyBroker;