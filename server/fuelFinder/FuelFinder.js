"use strict";

var _ = require('lodash');
var jsts = require('jsts');
var Point = jsts.geom.Point;
var Coordinate = jsts.geom.Coordinate;

// A minute (1/60th of a degree) equals 1.852 km
//var KM_PER_MINUTE = 1.852;
//var MINUTE = 1.0 / 60.0;

/**
 *
 * @param fuelPrices
 * @param bufferDegreesMinutes
 * @constructor
 */
function FuelFinder(fuelPrices) {

    if (_.isEmpty(fuelPrices)) {
        throw new Error('Non empty fuelPrices is required');
    }

    this.getPrices = function(lineString, bufferDegreesMinutes) {
        if (!lineString) {
            throw new Error('lineString is required');
        }
        var searchGeom = lineString.buffer(bufferDegreesMinutes);

        var fuelPriceMatch = [];
        _(fuelPrices).forEach(function (fuelPrice) {
            var point = new Point(new Coordinate(fuelPrice.fuelStation.lng, fuelPrice.fuelStation.lat));
            if (point.within(searchGeom)) {
                fuelPriceMatch.push(fuelPrice);
            }
        }).value();

        return fuelPriceMatch;
    };
}

module.exports = FuelFinder;